import { Ratelimit } from "@upstash/ratelimit";
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

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(1, "1 m"),
  analytics: true,
});

export async function POST(request: NextRequest) {
  const { t } = await createTranslation();

  try {
    const body = await request.json();
    const { id, amount, type } = body;

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.ip || "unknown";

    const identifier = `payout:${id}:${ip}`;
    const { success, limit, reset, remaining } = await ratelimit.limit(
      identifier
    );

    if (!success) {
      const resetDate = new Date(reset);
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
      paymentAccount:
        type === "paypal"
          ? affiliate.paypalAddress
          : // @ts-ignore
            affiliate.bankDetails?.accountNumber || "",
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
    return commonResponse({
      data: error,
      status: "error",
      message: t("postback.invalidData"),
    });
  }
}
