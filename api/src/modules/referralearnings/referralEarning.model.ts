import { sql } from "kysely";
import { db } from "../../database/database";

export const fetchReferralPercent = async () => {
  const result = await db
    .selectFrom("settings")
    .selectAll()
    .where("name", "=", "referral_percent")
    .executeTakeFirst();
  return result;
};
// - sales_id (transaction id of john sale)
// - user_id (alice id)
// - referee_id (john id)
// - amount
// - transaction_time
// - task_offer_id
// - referral_amount
// - status
// - note
// - admin_note
// - created_at
// - updated_at
// export const insert = async (
//   sale_id: Number,
//   user_id: number,
//   referee_id: number,
//   amount: number,
//   payout: number,
//   transaction_time: any,
//   task_offer_id: string,
//   referral_amount: number,
//   status: "confirmed" | "declined" | "pending",
//   note: string | null,
//   admin_note: string | null
// ) => {
//   const result = await db
//     .insertInto("user_referral_earnings")
//     .values({
//       sale_id: Number(sale_id),
//       user_id: user_id,
//       referee_id: referee_id,
//       amount: amount,
//       payout: amount,
//       transaction_time: transaction_time,
//       task_offer_id: task_offer_id,
//       referral_amount: referral_amount,
//       status: status,
//       note: note,
//       admin_note: admin_note,
//     })
//     .execute();
//   return result;
// };
export const fetchReferrerDetails = async (user_id: number) => {
  const result = await db
    .selectFrom("users")
    .select(["referrer_code"])
    .where("id", "=", user_id)
    .executeTakeFirst();
  if (!result?.referrer_code) {
    return null;
  }
  const referrer = await db
    .selectFrom("users")
    .select(["id", "name","affiliate_earnings"])
    .where("referral_code", "=", result.referrer_code)
    .executeTakeFirst();
  return referrer;
};
export const updateStatus = async (
  transaction_id: string,
  status: "pending" | "confirmed" | "declined"
) => {
  const result = await db
    .updateTable("user_referral_earnings")
    .set({
      status: status,
    })
    .where("transaction_id", "=", transaction_id)
    .execute();
  return result;
};
export const stats = async (userId: number) => {
  const bonus_stats = await db
    .selectFrom("user_referral_earnings")
    .select([
      "user_id",
      sql`count(*)`.as("earnings_count"),
      sql`SUM(amount)`.as("total_amount"),
    ])
    .groupBy("user_id")
    .where("user_id", "=", userId)
    .execute();
  const bonus_status = await db
    .selectFrom("user_referral_earnings")
    .select(["status", sql`count(*)`.as("status_count")])
    .groupBy("status")
    .where("user_id", "=", userId)
    .execute();
  return {
    bonus_stats,
    bonus_status,
  };
};
export const trends = async (userId: number) => {
  const result = await db
    .selectFrom("user_referral_earnings")
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
export const dateFormat = async () => {
  const query = await db
    .selectFrom("user_referral_earnings")
    .select([
      sql`DATE_FORMAT(created_at,'%M_%Y')`.as("created_month_name"),
      sql`DATE_FORMAT(created_at,'%m_%Y')`.as("created_month_number"),
    ])
    .distinct()
    .execute();
  return query;
};
