import { Redis } from "@upstash/redis";
import { createTranslation } from "@/i18n/server";
import { getAffiliateById } from "@/models/affiliates-model";
import { getEarningsDataForAffiliate } from "@/models/conversions-model";
import {
  getApprovedPayoutsByAffiliateId,
  insertPayout,
} from "@/models/payouts-model";
import { commonResponse } from "@/utils/response-format";
import { NextRequest } from "next/server";
import { Config } from "@/utils/config";
import { sendEmailToAffiliate } from "@/services/email-service";
import CryptoJS from "crypto-js";

const redis = Redis.fromEnv();

async function checkRateLimit(
  identifier: string,
  maxRequests = 1,
  windowSeconds = 60
) {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / windowSeconds) * windowSeconds;
  const key = `rate_limit:${identifier}:${windowStart}`;

  try {
    const script = `
      local key = KEYS[1]
      local ttl = tonumber(ARGV[1])
      local limit = tonumber(ARGV[2])
      
      local current = redis.call('GET', key)
      if current == false then
        current = 0
      else
        current = tonumber(current)
      end
      
      if current >= limit then
        local remaining_ttl = redis.call('TTL', key)
        if remaining_ttl == -1 then
          remaining_ttl = ttl
        end
        return {0, current, remaining_ttl}
      end
      
      local new_val = redis.call('INCR', key)
      if new_val == 1 then
        redis.call('EXPIRE', key, ttl)
      end
      
      local remaining_ttl = redis.call('TTL', key)
      return {1, new_val, remaining_ttl}
    `;

    const result = (await redis.eval(
      script,
      [key],
      [windowSeconds, maxRequests]
    )) as number[];
    const [allowed, count, ttl] = result;

    const success = allowed === 1;
    const remaining = Math.max(0, maxRequests - count);
    const resetTime = now + (ttl > 0 ? ttl : windowSeconds);

    return {
      success,
      limit: maxRequests,
      remaining,
      reset: resetTime * 1000,
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: (now + windowSeconds) * 1000,
    };
  }
}

export async function POST(request: NextRequest) {
  const { t } = await createTranslation();

  try {
    const body = await request.json();
    const { id, amount, type } = body;

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.ip || "unknown";

    const identifier = `payout:${id}:${ip}`;

    const rateLimitResult = await checkRateLimit(identifier, 1, 60);

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.reset);
      const waitMinutes = Math.ceil(
        (resetDate.getTime() - Date.now()) / (1000 * 60)
      );

      return commonResponse({
        data: null,
        status: "error",
        message: `Too many payout requests. Please try again in ${waitMinutes} minutes.`,
      });
    }

    const affiliate = (await getAffiliateById(Number(id)))?.data;

    if (!affiliate) {
      return commonResponse({
        data: null,
        status: "error",
        message: t("payouts.affiliateNotFound"),
      });
    }

    const affiliatePaidAmount =
      (await getApprovedPayoutsByAffiliateId(id))?.data || 0;

    const affiliateEarnings = await getEarningsDataForAffiliate(id);

    const amountAvailable =
      (affiliateEarnings.totalEarnings || 0) - (affiliatePaidAmount || 0);

    if (amount > amountAvailable) {
      return commonResponse({
        data: null,
        status: "error",
        message: t("payouts.insufficientBalance"),
      });
    }

    let payment_details = {};
    if (type === "bank") {
      payment_details = {
        ...(affiliate.bankDetails || {}),
      };
    }

    const generateTransactionId = () => {
      const timestamp = Date.now().toString(36);
      const randomString =
        affiliate.email + Math.random().toString(36) + Date.now().toString(36);
      const randomPart = CryptoJS.MD5(randomString).toString().substring(0, 10);

      return `${timestamp}-${randomPart}`;
    };

    const data = {
      affiliateId: id,
      paymentMethod: type,
      paymentAccount: type === "paypal" ? affiliate.paypalAddress : (affiliate.bankDetails as any)?.bank_account_no || "",
      requestedAmount: amount,
      paymentDetails: JSON.stringify(payment_details),
      transactionId: generateTransactionId(),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await insertPayout(data);

    if (result.status === "error") {
      return commonResponse({
        data: result.data,
        status: "error",
        message: t("payouts.errorCreatingPayout"),
      });
    }

    try {
      const email = await sendEmailToAffiliate({
        type: "payout_request",
        user_id: id,
        payout_id: result.data?.id?.toString(),
      });
    } catch (error) {
      return commonResponse({
        data: null,
        status: "error",
        message: t("auth.signup.errorSendingVerificationEmail"),
      });
    }

    return commonResponse({
      data: result.data?.id,
      status: "success",
      message: t("payouts.payoutCreated"),
    });
  } catch (error) {
    console.error("Error processing payout request:", error);
    return commonResponse({
      data: error,
      status: "error",
      message: t("postbook.invalidData"),
    });
  }
}
