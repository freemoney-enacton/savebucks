// import { QueryCreator, sql } from "kysely";

import { sql } from "kysely";
import { db } from "../../database/database";
import { UserPayment } from "./payments.schema";
import transformResponse from "../../utils/transformResponse";
import app from "../../app";
import { getSetCachedData } from "../../utils/getCached";


export const doKycValidations = async (user: any) => {
  // Get KYC enabled setting directly from DB
  const kycEnabledSetting = await db
    .selectFrom("settings")
    .select("val")
    .where("name", "=", "kyc_verification_enabled")
    .executeTakeFirst();

  const kycEnabled = kycEnabledSetting?.val === "1";

  // If KYC is not enabled, no validation needed
  if (!kycEnabled) return true;

  // If user has already completed KYC, no validation needed
  if (user?.kyc_verified) return true;

  // Get KYC on first payout setting directly from DB
  const kycOnFirstPayoutSetting = await db
    .selectFrom("settings")
    .select("val")
    .where("name", "=", "kyc_verification_on_first_payout")
    .executeTakeFirst();

  const kycOnFirstPayout = kycOnFirstPayoutSetting?.val === "1";

  // Get user's payout history
  const userPayouts = await db
    .selectFrom("user_payments")
    .selectAll()
    .where("user_id", "=", Number(user.id))
    .execute();

  const payoutLength = userPayouts.length;

  // Logic based on frontend conditions:
  // If KYC on first payout is enabled:
  //   - If user has previous payouts (length > 0), don't ask for KYC
  //   - If no previous payouts, ask for KYC
  // If KYC on first payout is disabled:
  //   - If no previous payouts (length == 0), don't ask for KYC
  //   - If has previous payouts, ask for KYC

  if (kycOnFirstPayout) {
    return payoutLength > 0;  // true = no KYC needed, false = KYC needed
  } else {
    return payoutLength === 0;  // true = no KYC needed, false = KYC needed
  }
};

export const fetchTypes = async () => {
  const result = await db.selectFrom("payment_types").selectAll().execute();
  return result;
};
export const columns = {
  translatable: ["name"],
  // hidden: ["ID", "status", "category_id"],
  money: [],
  date: [],
};
export const fetch = async (
  pageNumber: number,
  limit: number,
  userId: number,
  type: string | null,
  status: "created" | "processing" | "completed" | "declined" | null,
  month_year: string | null,
  lang: string
) => {
  const result = await db
    .with("giftcard_data", (db) =>
      db.selectFrom("user_payments as up2")
        .innerJoin("giftcard_brands as gb2", (join) =>
          join.on(
            "gb2.sku",
            "=",
            sql`JSON_UNQUOTE(JSON_EXTRACT(up2.payment_input, '$.sku'))`
          )
        )
        .select([
          "up2.payment_id",
          "gb2.name as giftcard_name",
          "gb2.image as giftcard_image"
        ])
        .where("up2.user_id", "=", userId)
        .where("up2.payment_method_code", "=", "giftcard")
        .where(sql`JSON_VALID(up2.payment_input)`, "=", 1)
    )
    .selectFrom("user_payments")
    .leftJoin(
      "payment_types",
      "payment_types.code",
      "user_payments.payment_method_code"
    )
    .leftJoin(
      "giftcard_data as gb",
      "gb.payment_id",
      "user_payments.payment_id"
    )
    .select([
      "user_payments.payment_id",
      "user_payments.payment_method_code",
      "user_payments.account",
      "user_payments.amount",
      "user_payments.payable_amount",
      "user_payments.bonus_amount",
      "user_payments.cashback_amount",
      "user_payments.status",
      "user_payments.paid_at",
      "user_payments.created_at",
      sql<any>`COALESCE(gb.giftcard_name, payment_types.name)`.as("name"),
      sql<any>`COALESCE(gb.giftcard_image, payment_types.icon)`.as("icon"),
      "payment_types.code",
    ])
    .$if(type != null, (qb) => qb.where("payment_method_code", "=", type))
    .$if(status != null, (qb) => qb.where("status", "=", status))
    .$if(month_year != null, (qb) =>
      qb.where(sql`DATE_FORMAT(paid_at,"%m_%Y")`, "=", month_year)
    )
    .$if(pageNumber !== undefined, (qb) =>
      qb
        .limit(limit ? limit : 20)
        .offset(
          limit && pageNumber
            ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
            : 0
        )
    )
    .where("user_id", "=", userId)
    .orderBy("user_payments.created_at desc")
    .execute();
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));

  const transformedData = await transformResponse(
    result,
    columns,
    fallback_lang?.val,
    lang,
    null
  );
  const count = await db
    .selectFrom("user_payments")
    .select(sql`COUNT(*)`.as("count"))
    .$if(type != null, (qb) => qb.where("payment_method_code", "=", type))
    .$if(status != null, (qb) => qb.where("status", "=", status))
    .$if(month_year != null, (qb) =>
      qb.where(sql`DATE_FORMAT(paid_at,"%m_%Y")`, "=", month_year)
    )
    .where("user_id", "=", userId)
    .executeTakeFirst();
  return { payments: transformedData, count: count?.count };
};

export const fetchAlreadyProcessingRequest = async (user_id: number) => {
  return await db
    .selectFrom("user_payments")
    .select([
      "id",
      "status",
      "amount"
    ])
    .where("status", "in", ["created", "processing"])
    .where("user_id", "=", user_id)
    .executeTakeFirst();
};

export const fetchIcon = async (code: string) => {
  const icon = await db
    .selectFrom("payment_types")
    .select("image")
    .where("code", "=", code)
    .executeTakeFirst();
  return icon?.image;
};

export const insert = async (data: UserPayment) => {
  try {
    console.log(data)
    const result = await db
      .insertInto("user_payments")
      .values({
        payment_id: data.payment_id,
        user_id: data.user_id,
        payment_method_code: data.payment_method_code,
        account: data.account,
        payment_input: data.payment_input,
        amount: data.amount,
        payable_amount: data.payable_amount,
        cashback_amount: data.cashback_amount,
        bonus_amount: data.bonus_amount,
        status: data.status,
      })
      .executeTakeFirst();
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const fetchAmount = async (id: number) => {
  const bonus = await db
    .selectFrom("user_bonus")
    .select([db.fn.sum("user_bonus.amount").as("bonus")])
    .where("user_bonus.user_id", "=", id)
    .where("status", "=", "confirmed")
    .executeTakeFirst();
  const amount = await db
    .selectFrom("user_offerwall_sales")
    .select([db.fn.sum("user_offerwall_sales.amount").as("amount")])
    .where("user_offerwall_sales.user_id", "=", id)
    .where("status", "=", "confirmed")
    .executeTakeFirst();
  const refer = await db
    .selectFrom("user_referral_earnings")
    .select([db.fn.sum("user_referral_earnings.referral_amount").as("refer")])
    .where("user_id", "=", id)
    .where("status", "=", "confirmed")
    .executeTakeFirst()
  const cashback = await db
    .selectFrom("user_sales")
    .select([db.fn.sum("cashback").as("cashback")])
    .where("user_id", "=", id)
    .where("status", "=", "confirmed")
    .executeTakeFirst()
  const cashback_refer = await db
    .selectFrom("user_referrer_sales")
    .select([db.fn.sum("referral_amount").as("cashback_refer")])
    .where("user_id", "=", id)
    .where("status", "=", "confirmed")
    .executeTakeFirst()

  const bonusAmount = Number(bonus?.bonus ?? 0);
  const salesAmount = Number(amount?.amount ?? 0);
  const referAmount = Number(refer?.refer ?? 0);
  const cashbackAmount = Number(cashback?.cashback ?? 0);
  const cashbackReferAmount = Number(cashback_refer?.cashback_refer ?? 0);


  const payments = await db
    .selectFrom("user_payments")
    .select([db.fn.sum("user_payments.payable_amount").as("payments")])
    .where("user_payments.user_id", "=", id)
    .where("user_payments.status", "<>", "declined")
    .executeTakeFirst();
  // Calculate total
  const total = (bonusAmount + salesAmount + referAmount + cashbackAmount + cashbackReferAmount) - Number(payments?.payments ?? 0);
  return {
    bonus: bonusAmount,
    amount: salesAmount + cashbackAmount,
    refer: referAmount + cashbackReferAmount,
    total: total,
  };
};

export const stats = async (id: number) => {
  const payout_count = await db
    .selectFrom("user_payments")
    .select(["status", sql`count(*)`.as("status_count")])
    .groupBy("status")
    .where("user_id", "=", id)
    .execute();
  const payout_amount = await db
    .selectFrom("user_payments")
    .select(["status", sql`SUM(amount)`.as("status_amount")])
    .groupBy("status")
    .where("user_id", "=", id)
    .execute();
  return {
    payout_count,
    payout_amount,
  };
};

export const dateFormat = async () => {
  const query = await db
    .selectFrom("user_payments")
    .select([
      sql`DATE_FORMAT(created_at,'%M_%Y')`.as("created_at_month_name"),
      sql`DATE_FORMAT(created_at,'%m_%Y')`.as("created_at_month_number"),
    ])
    .distinct()
    .execute();
  return query;
};

export const fetchTrends = async (userId: number) => {
  const result = await db
    .selectFrom("user_payments")
    .select([
      sql` SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 ELSE 0 END)`.as(
        "LastDay"
      ),
      sql`SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END)`.as(
        "Last7Days"
      ),
      sql` SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END)`.as(
        "Last30Days"
      ),
    ])
    .where("user_id", "=", userId)
    .execute();
  return result;
};

export const fetchType = async (code: string, lang: any) => {
  const result = await db
    .selectFrom("payment_types")
    .selectAll()
    .where("code", "=", code)
    .executeTakeFirst();
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));

  const transformedData = await transformResponse(
    result,
    columns,
    fallback_lang?.val,
    lang,
    null
  );
  return transformedData;
};

export const getCurrencyConversion = async (curr: string) => {
  const result = await db
    .selectFrom("currencies")
    .select(["conversion_rate"])
    .where("iso_code", "=", curr)
    .executeTakeFirst();
  return result
}