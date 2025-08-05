import { sql } from "kysely";
import app from "../../app";
import { db } from "../../database/database";
import { OfferwallPostbackLogs, UserOfferwallSales } from "../../database/db";
import { sendConversionRequest } from "../../utils/sendAffiliatePostback";

export const processLevelCheck = async (saleData: any) => {
  const tokensPerLevel = await db
    .selectFrom("settings")
    .select("val")
    .where("name", "=", "tokens_per_level")
    .executeTakeFirst();

  const user = await db
    .selectFrom("users")
    .select(["current_level", "current_level_tokens", "total_tokens"])
    .where("id", "=", saleData.user_id)
    .executeTakeFirst();

  const userTotalToken =
    Number(user?.total_tokens) +
    Number(saleData.amount) * Number(tokensPerLevel?.val);
  const userNewLevel = Math.floor(userTotalToken / Number(tokensPerLevel?.val));
  const userRemainingTokens = userTotalToken % Number(tokensPerLevel?.val);

  await db
    .updateTable("users")
    .set({
      total_tokens: userTotalToken,
      current_level: userNewLevel,
      current_level_tokens: userRemainingTokens,
    })
    .where("id", "=", saleData.user_id)
    .execute();
};

export const getNetworkDetails = async (
  type: "tasks" | "surveys",
  name: string
) => {
  const result = db
    .selectFrom("offerwall_networks")
    .selectAll()
    .where("type", "=", type)
    .where("code", "=", name)
    .executeTakeFirst();
  return result;
};

export const updateOrCreateUserSale = async (saledata: any) => {
  const userData = await db
    .selectFrom("users")
    .select(["affiliate_click_code"])
    .where("id", "=", saledata.user_id)
    .executeTakeFirst();

  const existingUserSale = await db
    .selectFrom("user_offerwall_sales")
    .selectAll()
    .where("user_id", "=", parseInt(saledata.user_id))
    .where("network", "=", saledata.network)
    .where("offer_id", "=", saledata.offer_id)
    .where("transaction_id", "=", saledata.transaction_id)
    .executeTakeFirst();

  if (existingUserSale) {
    if (Number(saledata.amount) < 0) {
      await db
        .updateTable("user_offerwall_sales")
        .set({
          amount: saledata.amount,
          payout: saledata.payout,
          status: "declined",
          is_chargeback: 1,
          mail_sent: 0,
        })
        .where("user_id", "=", parseInt(saledata.user_id))
        .where("network", "=", saledata.network)
        .where("offer_id", "=", saledata.offer_id)
        .where("transaction_id", "=", saledata.transaction_id)
        .execute();
    } else {
      await db
        .updateTable("user_offerwall_sales")
        .set({
          amount: saledata.amount,
          payout: saledata.payout,
          status: saledata.status,
          mail_sent: 0,
        })
        .where("user_id", "=", parseInt(saledata.user_id))
        .where("network", "=", saledata.network)
        .where("offer_id", "=", saledata.offer_id)
        .where("transaction_id", "=", saledata.transaction_id)
        .execute();
    }
  } else {
    if (Number(saledata.amount) < 0) {
      await db
        .insertInto("user_offerwall_sales")
        .values({
          ...saledata,
          is_chargeback: 1,
          mail_sent: 0,
        })
        .execute();
    } else {
      await db
        .insertInto("user_offerwall_sales")
        .values({
          ...saledata,
          created_at: sql`NOW()`,
          updated_at: sql`NOW()`,
          mail_sent: 0,
        })
        .executeTakeFirst();

      if (userData && userData.affiliate_click_code) {
        console.log("Firing Affiliate Conversion Request", "user_transaction");
        const res = await sendConversionRequest({
          tracking_code: "user_transaction",
          click_code: userData?.affiliate_click_code,
          transaction_id: saledata.user_id,
          user_earning: saledata?.amount,
        });
      }
    }
  }

  const userSaleData = await db
    .selectFrom("user_offerwall_sales")
    .selectAll()
    .where("user_id", "=", parseInt(saledata.user_id))
    .where("network", "=", saledata.network)
    .where("offer_id", "=", saledata.offer_id)
    .where("transaction_id", "=", saledata.transaction_id)
    .executeTakeFirst();

  return userSaleData;

  // return await db
  //   .insertInto("user_offerwall_sales")
  //   .onDuplicateKeyUpdate({
  //     amount: saledata.amount,
  //     payout: saledata.payout,
  //     status: saledata.status,
  //   })
  //   .values({
  //     ...saledata,
  //     created_at: sql`NOW()`,
  //     updated_at: sql`NOW()`
  //   })
  //   .executeTakeFirst();
};

export const getUserSale = async ({
  user_id,
  network,
  offer_id,
  transaction_id,
}: {
  user_id: string;
  network: string;
  offer_id: string;
  transaction_id: string;
}) => {
  return await db
    .selectFrom("user_offerwall_sales")
    .selectAll()
    .where("user_id", "=", parseInt(user_id))
    .where("network", "=", network)
    .where("offer_id", "=", offer_id)
    .where("transaction_id", "=", transaction_id)
    .executeTakeFirst();
};

export const processReferral = async (userSale: UserOfferwallSales) => {
  // Get current user & referral user details
  const currentUserDetails = await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", userSale.user_id)
    .executeTakeFirst();
  if (!currentUserDetails) return null;

  // @ts-ignore
  const referralUser = await db
    .selectFrom("users")
    .innerJoin("tiers", "tiers.tier", "users.current_tier")
    .select([
      "users.id as user_id",
      "users.name as name",
      "users.email as email",
      "users.lang as lang",
      "users.current_tier as user_tier",
      "tiers.affiliate_commission as tier_commission",
      "tiers.required_affiliate_earnings as tier_required_affiliate_earning",
    ])
    .where("referral_code", "=", currentUserDetails.referrer_code)
    .executeTakeFirst();
  if (!referralUser) return null;
  console.log(referralUser);

  // Referral Earning Processing
  const referralEarningAsPerCurrentTierCommission =
    parseFloat(userSale.amount.toString()) *
    parseFloat(referralUser.tier_commission) *
    0.01;
  await db
    .insertInto("user_referral_earnings")
    .onDuplicateKeyUpdate({
      amount: Number(userSale.amount),
      payout: Number(userSale.payout),
      referral_amount: referralEarningAsPerCurrentTierCommission,
      // @ts-ignore
      status: userSale.status,
    })
    .values({
      network: userSale.network,
      offer_id: userSale.offer_id,
      transaction_id: userSale.transaction_id,
      sale_id: Number(userSale.id),
      task_offer_id: userSale.task_offer_id,
      task_type: userSale.task_type,

      user_id: referralUser.user_id,
      referee_id: userSale.user_id,

      amount: Number(userSale.amount),
      payout: Number(userSale.payout),
      transaction_time: sql`now()`,
      referral_amount: referralEarningAsPerCurrentTierCommission,

      // @ts-ignore
      status: userSale.status,
    })
    .execute();
  const referralEarning = await db
    .selectFrom("user_referral_earnings")
    .selectAll()
    .where("user_id", "=", referralUser.user_id)
    .where("transaction_id", "=", userSale.transaction_id)
    .executeTakeFirst();

  // Tier Processing
  const referrerReferralEarnings = await db
    .selectFrom("user_referral_earnings")
    .select(({ fn }) => [
      "user_id",
      fn.sum<number>("referral_amount").as("referral_earnings"),
    ])
    .where("user_id", "=", referralUser.user_id)
    .where("status", "=", "confirmed")
    .groupBy("user_id")
    .executeTakeFirst();

  const totalReferralEarnings: any = referrerReferralEarnings
    ? Number(referrerReferralEarnings.referral_earnings)
    : 0;
  const newQualifingTier = await db
    .selectFrom("tiers")
    .select(["tier", "affiliate_commission", "required_affiliate_earnings"])
    .where("required_affiliate_earnings", "<=", totalReferralEarnings)
    .where("enabled", "=", 1)
    .orderBy("required_affiliate_earnings", "desc")
    .executeTakeFirst();

  let referralUpdateInfo: any = {
    affiliate_earnings: totalReferralEarnings,
  };
  if (Number(newQualifingTier?.tier) !== Number(referralUser.user_tier)) {
    referralUpdateInfo = {
      ...referralUpdateInfo,
      current_tier: newQualifingTier?.tier,
      affiliate_commission: newQualifingTier?.affiliate_commission,
    };
  }

  await db
    .updateTable("users")
    .set(referralUpdateInfo)
    .where("id", "=", referralUser.user_id)
    .execute();

  return {
    currentUserDetails,
    referralEarning,
    referralUser,
  };
};

export const getUserDetails = async (user_id: any) => {
  return await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", user_id)
    .executeTakeFirst();
};

export const insertTicker = async (
  userId: any,
  ticker_type: any,
  ticker_data: any
) => {
  const result = await db
    .insertInto("tickers")
    .values({
      user_id: userId,
      ticker_type: ticker_type,
      ticker_data: ticker_data,
      created_at: new Date(),
    })
    .execute();
  return result;
};

export const increaseRedemptionTask = async (
  network: string,
  campaign_id: string
) => {
  const result = await db
    .updateTable("offerwall_tasks")
    .set({ redemptions: sql`redemptions + 1` })
    .where("network", "=", network)
    .where("campaign_id", "=", campaign_id)
    .execute();
  return result;
};

type PostbackLogData = {
  network: string | null;
  transaction_id: string | null;
  status: "error" | "pending" | "processed";
  message: string | null;
  data: string | null;
  payload: string | null;
};

export const insertPostbackLog = async (postbackData: PostbackLogData) => {
  await db
    .insertInto("offerwall_postback_logs")
    .values({
      created_at: sql`now()`,
      data: postbackData.data,
      message: postbackData.message,
      network: postbackData.network,
      payload: postbackData.payload,
      status: postbackData.status,
      transaction_id: postbackData.transaction_id,
      updated_at: sql`now()`,
    })
    .execute();
};

export const clickCodeVerify= async (user_id: number, code: string,network: string,offer_id: string) => {
  const result = await db
    .selectFrom("user_task_clicks")
    .select(["id"])
    .where("user_id", "=", user_id)
    .where("click_code", "=", code)
    .where("network", "=", network)
    .where('campaign_id', '=', offer_id)
    .executeTakeFirst();
  return result;
}

export const verifyIframeClick = async (
  user_id: number,
  network: string,
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await db
    .selectFrom("user_task_clicks")
    .select(["id"])
    .where("user_id", "=", user_id)
    .where("network", "=", network)
    .where("campaign_id", "=", 'iframe')
    .where("created_at", ">=", today)
    .executeTakeFirst();

  return result; // Returns record if a matching iframe click exists today
};
