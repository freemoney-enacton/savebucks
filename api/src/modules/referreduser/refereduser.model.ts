import transformResponse from "./../../utils/transformResponse";
import { sql } from "kysely";
import { db } from "../../database/database";
import { getSetCachedData } from "../../utils/getCached";
import app from "../../app";
const columns = {
  translatable: ["name", "offerName", "networkName"],
  money: [],
  date: [],
};

export const getRefererCode = async (userId: number) => {
  const result = await db
    .selectFrom("users")
    .select(["referral_code"])
    .where("id", "=", userId)
    .executeTakeFirst();
  return result;
};
export const stats = async (userId: number) => {
  const referer_code = await getRefererCode(userId);
  if (!referer_code) throw new Error("Referer code not found");
  const total_users = await db
    .selectFrom("users")
    .select([sql`COUNT(*)`.as("total_users")])
    .where("referrer_code", "=", referer_code.referral_code)
    .executeTakeFirst();
  const total_amount_tasks = await db
    .selectFrom("user_referral_earnings")
    .select([sql`SUM(referral_amount)`.as("total_sums")])
    .where("user_id", "=", userId)
    .executeTakeFirst();

  const total_amount_cashback = await db
    .selectFrom("user_referrer_sales")
    .select([sql`SUM(referral_amount)`.as("total_sums")])
    .where("user_id", "=", userId)
    .executeTakeFirst();

  const total_amount = {
    total_sums: Number(total_amount_tasks?.total_sums || 0) + Number(total_amount_cashback?.total_sums || 0)
  };

  const totalReferralEarningTasks = await db
    .selectFrom("user_referral_earnings")
    .select([sql`SUM(referral_amount)`.as("total_sums")])
    .where("status", "in", ["confirmed", "pending"])
    .where("user_id", "=", userId)
    .executeTakeFirst();

  const totalReferralEarningCashback = await db
    .selectFrom("user_referrer_sales")
    .select([sql`SUM(referral_amount)`.as("total_sums")])
    .where("status", "in", ["confirmed", "pending"])
    .where("user_id", "=", userId)
    .executeTakeFirst();

  // Calculate combined totalReferralEarning
  const totalReferralEarning =
    Number(totalReferralEarningTasks?.total_sums || 0) + Number(totalReferralEarningCashback?.total_sums || 0);

  const totalRewardEarning = await db
    .selectFrom("user_bonus")
    .select([sql`SUM(amount)`.as("total_sums")])
    .where("status", "in", ["confirmed", "pending"])
    .where("user_id", "=", userId)
    .executeTakeFirst();

  return {
    total_users,
    total_amount,
    totalReferralEarning: totalReferralEarning ? totalReferralEarning : 0,
    totalRewardEarning: totalRewardEarning ? totalRewardEarning.total_sums : 0,
  };
};
export const trends = async (userId: number) => {
  const referer_code = await getRefererCode(userId);
  if (!referer_code) throw new Error("Referer code not found");
  const result = await db
    .selectFrom("users")
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
    .where("referrer_code", "=", referer_code.referral_code)
    .execute();
  return result;
};
export const dateFormat = async () => {
  const query = await db
    .selectFrom("users")
    .select([
      sql`DATE_FORMAT(created_at,'%M_%Y')`.as("created_month_name"),
      sql`DATE_FORMAT(created_at,'%m_%Y')`.as("created_month_number"),
    ])
    .distinct()
    .execute();
  return query;
};

export const taskReferred = async (
  userId: number,
  date: string | null,
  pageNumber: number | null,
  limit: number | null,
  lang: string
) => {

  const referredTaskUserDetails = await db.selectFrom("user_referral_earnings")
    .innerJoin("users", "users.id", "user_referral_earnings.referee_id")
    .innerJoin("user_offerwall_sales", "user_offerwall_sales.id", "user_referral_earnings.sale_id")
    .select([
      "users.email",
      "users.name",
      "users.created_at as joining_date",

      "user_referral_earnings.amount as sale_amount",
      "user_referral_earnings.referral_amount",
      "user_referral_earnings.task_offer_id",
      "user_referral_earnings.status",
      "user_referral_earnings.transaction_time",

      "user_offerwall_sales.task_offer_id",
      "user_offerwall_sales.task_name as offerName",
      "user_offerwall_sales.network",

    ])
    .where("user_referral_earnings.user_id", "=", userId)
    .where("user_referral_earnings.status", "!=", "declined")
    .where("users.status", "=", "active")
    .where("users.is_deleted", "!=", 1)
    .orderBy("user_referral_earnings.created_at", "desc")
    .limit(limit ? limit : 20)
    .offset(limit && pageNumber
      ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
      : 0)
    .execute();

  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  const transformedResponse = await transformResponse(
    referredTaskUserDetails,
    columns,
    fallback_lang,
    lang,
    null
  );
  return transformedResponse;
};
export const taskReferredCount = async (
  userId: number,
) => {

  const referredTaskCount = await db.selectFrom("user_referral_earnings")
    .innerJoin("users", "users.id", "user_referral_earnings.referee_id")
    .select(db.fn.count('user_referral_earnings.id').as('total_count'))
    .where("user_referral_earnings.user_id", "=", userId)
    .where("user_referral_earnings.status", "=", "declined")
    .where("users.status", "=", "active")
    .where("users.is_deleted", "!=", 1)
    .executeTakeFirst();

  if (!referredTaskCount) return 0;

  return referredTaskCount.total_count;
};

// export const referralEarningLeaderboard = async (
//   pageNumber: number | null,
//   limit: number | null,
// ) => {

//   const referredTaskUserDetails = await db.selectFrom("user_referral_earnings")
//     .innerJoin("users","users.id","user_referral_earnings.referee_id")
//     .select([
//       "users.id as user_id",
//       "users.email as user_email",
//       "users.name as user_name",
//       sql<number>`SUM(user_referral_earnings.referral_amount)`.as("user_earning_amount"),
//     ])
//     .where("user_referral_earnings.status","=","confirmed")
//     .where("users.status","=","active")
//     .orderBy("user_earning_amount","desc")
//     .groupBy(["users.id","users.name","users.email"])
//     .limit(limit ? limit : 20)
//     .offset(limit && pageNumber
//       ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
//       : 0)
//     .execute();

//   return referredTaskUserDetails;
// };
export const referralEarningLeaderboard = async (
  pageNumber: number | null,
  limit: number | null,
) => {
  // Using a SQL query to combine data from both tables
  const combinedLeaderboard = await sql<any>`
    WITH combined_earnings AS (
      SELECT 
        users.id as user_id,
        users.email as user_email,
        users.name as user_name,
        users.avatar as user_image,
        (
          COALESCE((
            SELECT SUM(ure.referral_amount)
            FROM user_referral_earnings ure
            WHERE ure.referee_id = users.id
            AND ure.status = 'confirmed'
          ), 0) +
          COALESCE((
            SELECT SUM(urs.referral_amount)
            FROM user_referrer_sales urs
            WHERE urs.shopper_id = users.id
            AND urs.status = 'confirmed'
          ), 0)
        ) as user_earning_amount
      FROM 
        users
      WHERE 
        users.status = 'active'
      GROUP BY 
        users.id, users.email, users.name
      HAVING
        (
          COALESCE((
            SELECT SUM(ure.referral_amount)
            FROM user_referral_earnings ure
            WHERE ure.referee_id = users.id
            AND ure.status = 'confirmed'
          ), 0) +
          COALESCE((
            SELECT SUM(urs.referral_amount)
            FROM user_referrer_sales urs
            WHERE urs.shopper_id = users.id
            AND urs.status = 'confirmed'
          ), 0)
        ) > 0
    )
    SELECT * FROM combined_earnings
    ORDER BY user_earning_amount DESC
    LIMIT ${limit ? limit : 20}
    OFFSET ${limit && pageNumber
      ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
      : 0}
  `.execute(db);

  return combinedLeaderboard.rows;
};
// export const referralEarningLeaderboardCount = async () => {

//   const referredTaskUserDetailsCount = await db.selectFrom("user_referral_earnings")
//     .select([
//       sql<number>`COUNT(user_referral_earnings.user_id)`.as("user_count"),
//     ])
//     .where("user_referral_earnings.status","=","confirmed")
//     .groupBy("user_referral_earnings.user_id")
//     .executeTakeFirst(); 

//   if(!referredTaskUserDetailsCount) return 0;

//   return referredTaskUserDetailsCount.user_count;
// };
export const referralEarningLeaderboardCount = async () => {
  // We need to count unique users who have earnings from either source
  const combinedCount = await sql<any>`
    SELECT COUNT(*) as user_count
    FROM (
      SELECT 
        users.id
      FROM 
        users
      WHERE 
        users.status = 'active'
      GROUP BY 
        users.id
      HAVING
        (
          COALESCE((
            SELECT SUM(ure.referral_amount)
            FROM user_referral_earnings ure
            WHERE ure.referee_id = users.id
            AND ure.status = 'confirmed'
          ), 0) +
          COALESCE((
            SELECT SUM(urs.referral_amount)
            FROM user_referrer_sales urs
            WHERE urs.shopper_id = users.id
            AND urs.status = 'confirmed'
          ), 0)
        ) > 0
    ) as users_with_earnings
  `.execute(db);

  if (!combinedCount.rows[0]) return 0;

  return combinedCount.rows[0].user_count;
};

export const countFunction = async (userId: any) => {
  const countReferredTask = await sql<any>`SELECT 
  COUNT(*) as countTask
FROM 
  users u
LEFT JOIN 
  user_referral_earnings ure 
ON 
u.id = ure.referee_id /*COLLATE utf8mb4_general_ci*/
LEFT JOIN 
  offerwall_tasks ot 
ON 
  ot.offer_id = ure.task_offer_id COLLATE utf8mb4_general_ci
LEFT JOIN 
  offerwall_networks ont 
ON 
  ont.code = ot.network COLLATE utf8mb4_general_ci
WHERE 
  ure.user_id =  ${userId}
  AND ure.status != 'declined'
ORDER BY 
  u.created_at DESC`.execute(db);
  const countAffiliatesUsers = await sql<any>`SELECT 
  u.email,
  u.name,
  DATE_FORMAT(u.created_at, "%d/%m/%Y") AS joining_date,
  COALESCE(SUM(ure.referral_amount), 0) AS earnings
FROM 
  users u
LEFT JOIN 
  user_referral_earnings ure 
ON 
  u.id = ure.referee_id
WHERE
ure.user_id = ${userId} 
  AND ure.status != 'declined'
GROUP BY 
  u.id, u.email, u.name, u.created_at
ORDER BY 
  u.created_at DESC
`.execute(db);
  return {
    task: countReferredTask.rows,
    users: countAffiliatesUsers.rows.length,
  };
};
export const list = async (
  userId: number,
  date: string | null,
  pageNumber: number | null,
  limit: number | null
) => {
  const affiliatesUsers = await sql<any>`SELECT 
      u.email,
      u.name,
      u.created_at AS joining_date,
      COALESCE(SUM(ure.referral_amount), 0) + COALESCE((
        SELECT SUM(urs.referral_amount)
        FROM user_referrer_sales urs
        WHERE u.id = urs.shopper_id
        AND urs.user_id = ${userId}
        AND urs.status != 'declined'
      ), 0) AS earnings,
      COALESCE(SUM(ure.amount), 0) AS referral_earning,
      COALESCE(COUNT(ure.id), 0) AS count
    FROM 
      users u
    LEFT JOIN 
      user_referral_earnings ure 
    ON 
      u.id = ure.referee_id
    WHERE
      ure.user_id = ${userId} 
      AND ure.status != 'declined'
      AND u.is_deleted != 1
      AND u.status = 'active'
    GROUP BY 
      u.id, u.email, u.name, u.created_at
    ORDER BY 
      u.created_at DESC
LIMIT ${limit ? limit : 20} OFFSET ${limit && pageNumber
      ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
      : 0
    }`.execute(db);
  return affiliatesUsers.rows;
};

export const cashbackReferred = async (
  userId: number,
  date: string | null,
  pageNumber: number | null,
  limit: number | null,
  lang: string
) => {
  const referredCashbackUserDetails = await db.selectFrom("user_referrer_sales")
    .innerJoin("users", "users.id", "user_referrer_sales.shopper_id")
    .innerJoin("stores", "stores.id", "user_referrer_sales.store_id")
    .leftJoin("networks", "networks.id", "stores.network_id")
    .select([
      "users.email",
      "users.name",
      "users.created_at as joining_date",
      "user_referrer_sales.order_amount as sale_amount",
      "user_referrer_sales.referral_amount",
      "user_referrer_sales.order_amount",
      "user_referrer_sales.store_id",
      "user_referrer_sales.transaction_time",
      "user_referrer_sales.status",
      "stores.name as store_name",
      "stores.logo as store_logo",
      "stores.slug as store_slug",
      "stores.network_campaign_id",
      "networks.name as network_name",
      "networks.id as network_id"
    ])
    .where("user_referrer_sales.user_id", "=", userId)
    .where("user_referrer_sales.status", "!=", "declined")
    .orderBy("user_referrer_sales.created_at", "desc")
    .limit(limit ? limit : 20)
    .offset(limit && pageNumber
      ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
      : 0)
    .execute();

  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  const transformedResponse = await transformResponse(
    referredCashbackUserDetails,
    columns,
    fallback_lang,
    lang,
    null
  );
  return transformedResponse;
};

export const cashbackReferredCount = async (
  userId: number,
) => {
  const referredCashbackCount = await db.selectFrom("user_referrer_sales")
    .select(db.fn.count('user_referrer_sales.id').as('total_count'))
    .where("user_referrer_sales.user_id", "=", userId)
    .where("user_referrer_sales.status", "!=", "declined")
    .executeTakeFirst();
  if (!referredCashbackCount) return 0;
  return referredCashbackCount.total_count;
};
