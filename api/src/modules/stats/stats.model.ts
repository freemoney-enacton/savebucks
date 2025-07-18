import { sql } from "kysely";
import { db } from "../../database/database";
import { getRefererCode } from "../referreduser/refereduser.model";
import { currencyTransform } from "../../utils/transformResponse";
import { getSetCachedData } from "../../utils/getCached";
import app from "../../app";

export const fetchStats = async (userId: any) => {
  const referer_code = await getRefererCode(userId);
  if (!referer_code) throw new Error("Referer code not found");
  const total_users = await db
    .selectFrom("users")
    .select([sql`COUNT(*)`.as("total_users")])
    .where("referrer_code", "=", referer_code.referral_code)
    .executeTakeFirst();
  const total_referral_tasks = await db
    .selectFrom("user_referral_earnings")
    .select([sql`SUM(referral_amount)`.as("total_sums")])
    .where("user_id", "=", userId)
    .executeTakeFirst();
    //console.log("🚀 ~ fetchStats ~ total_referral_tasks:", total_referral_tasks)
  const total_referral_sales=await db
    .selectFrom("user_referrer_sales")
    .select([sql`SUM(referral_amount)`.as("total_sums")])
    .where("user_id","=",userId)
    .executeTakeFirst()
    //console.log("🚀 ~ fetchStats ~ total_referral_sales:", total_referral_sales)
  const total_amount=Number(total_referral_sales?.total_sums)+Number(total_referral_tasks?.total_sums)
  //console.log("🚀 ~ fetchStats ~ total_amount:", total_amount)
  const confirmedEarningsResult = await db
    .selectFrom(["user_offerwall_sales"])
    .select([sql`sum(user_offerwall_sales.amount)`.as("totalSalesConfirmed")])
    .where("user_offerwall_sales.user_id", "=", userId)
    .where("user_offerwall_sales.status", "=", "confirmed")
    .execute();
    //console.log("🚀 ~ fetchStats ~ confirmedEarningsResult :", confirmedEarningsResult )
  const pendingEarningsResult = await db
    .selectFrom(["user_offerwall_sales"])
    .select([sql`sum(user_offerwall_sales.amount)`.as("totalSalesPending")])
    .where("user_offerwall_sales.user_id", "=", userId)
    .where("user_offerwall_sales.status", "=", "pending")
    .execute();
    //console.log("🚀 ~ fetchStats ~ pendingEarningsResult:", pendingEarningsResult)
  const confirmedSalesEarningsResult=await db
    .selectFrom("user_sales")
    .select([sql`sum(user_sales.cashback)`.as("totalSalesConfirmed")])
    .where("user_sales.user_id", "=", userId)
    .where("user_sales.status", "=", "confirmed")
    .execute();
    
    //console.log("🚀 ~ fetchStats ~ confirmedSalesEarningsResult:", confirmedSalesEarningsResult)
  const pendingSalesEarningsResult=await db
    .selectFrom("user_sales")
    .select([sql`sum(user_sales.cashback)`.as("totalSalesPending")])
    .where("user_sales.user_id", "=", userId)
    .where("user_sales.status", "=", "pending")
    .execute();
    
    //console.log("🚀 ~ fetchStats ~ pendingSalesEarningsResult:", pendingSalesEarningsResult)
  const confirmedBonusResult = await db
    .selectFrom(["user_bonus"])
    .select([sql`sum(user_bonus.amount)`.as("totalBonusConfirmed")])
    .where("user_bonus.user_id", "=", userId)
    .where("user_bonus.status", "=", "confirmed")
    .execute();

    
    //console.log("🚀 ~ fetchStats ~ confirmedBonusResult:", confirmedBonusResult)
  const pendingBonusResult = await db
  .selectFrom(["user_bonus"])
  .select([sql`sum(user_bonus.amount)`.as("totalBonusPending")])
  .where("user_bonus.user_id", "=", userId)
  .where("user_bonus.status", "=", "pending")
  .execute();
  
  //console.log("🚀 ~ fetchStats ~ pendingBonusResult:", pendingBonusResult)
  const confirmedEarnings =
    Number(confirmedBonusResult[0]?.totalBonusConfirmed) +Number(confirmedEarningsResult[0]?.totalSalesConfirmed) + Number(confirmedSalesEarningsResult[0]?.totalSalesConfirmed)|| 0;
   // console.log("🚀 ~ fetchStats ~ confirmedEarnings:", confirmedEarnings)
  const pendingEarnings= Number(pendingBonusResult[0]?.totalBonusPending)+Number(pendingEarningsResult[0]?.totalSalesPending)+Number(pendingSalesEarningsResult[0]?.totalSalesPending)
  const paymentsResult = await db
    .selectFrom("user_payments")
    .select([
      sql`sum(case when status = 'completed' then payable_amount else 0 end)`.as(
        "totalPaid"
      ),
      sql`sum(case when status in ('processing', 'created') then payable_amount else 0 end)`.as(
        "inProgressPayments"
      ),
    ])
    .where("user_payments.user_id", "=", userId)
    .execute();
  const { totalPaid, inProgressPayments } = paymentsResult[0];
  const offerCompletedResult = await db
    .selectFrom("user_offerwall_sales")
    .select(sql`count(DISTINCT(task_offer_id))`.as("offerCount"))
    .where("status", "=", "confirmed")
    .where("user_offerwall_sales.user_id", "=", userId)
    .execute();
  const offerCompleted = offerCompletedResult[0]?.offerCount || 0;

  const earningsInPeriods = await db
    .selectFrom("user_payments")
    .select([
      sql`sum(case when created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) then payable_amount else 0 end)`.as(
        "earningsLastDay"
      ),
      sql`sum(case when created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) then payable_amount else 0 end)`.as(
        "earningsLastWeek"
      ),
      sql`sum(case when created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) then payable_amount else 0 end)`.as(
        "earningsLastMonth"
      ),
    ])
    .where("status", "=", "completed")
    .where("user_payments.user_id", "=", userId)
    .execute();
  return {
    lifetimeEarning:
      (Number(confirmedEarnings) + total_amount +Number(pendingEarnings)).toFixed(2), 
    availablePayout: Number(confirmedEarnings) +
        total_amount -
        (Number(totalPaid) + Number(inProgressPayments)),
    offerCompleted,
    referredUsers: total_users?.total_users,
  };
};
