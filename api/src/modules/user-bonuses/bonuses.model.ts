import { sql } from "kysely";
import { db } from "../../database/database";
import transformResponse from "../../utils/transformResponse";
import app from "../../app";

export const columns = {
  translatable: ["name"],
  money: [],
  date: [],
};
export const fetch = async (
  pageNumber: number | null,
  limit: number | null,
  user_id: number,
  status: "confirmed" | "declined" | "pending" | null,
  date: string | null,
  lang: string
) => {
  const count = await db
    .selectFrom("user_bonus")
    .select(sql`COUNT(*)`.as("bonus_count"))
    .$if(date != null, (qb) =>
      qb.where(sql`DATE_FORMAT(awarded_on,"%m_%Y")`, "=", date)
    )
    .$if(status != null, (qb) => qb.where("status", "=", status))
    .where("user_id", "=", user_id)
    .orderBy("created_at desc")
    .executeTakeFirst();
  const result = await db
    .selectFrom("user_bonus")
    // .selectAll()
    .leftJoin("bonus_types", "bonus_types.code", "user_bonus.bonus_code")
    .select([
      "user_bonus.id",
      "user_bonus.bonus_code",
      "user_bonus.user_id",
      "user_bonus.amount",
      "user_bonus.status",
      "user_bonus.expires_on",
      "user_bonus.created_at",
      "user_bonus.metadata",
      "bonus_types.name",
    ])
    .$if(date != null, (qb) =>
      qb.where(sql`DATE_FORMAT(awarded_on,"%m_%Y")`, "=", date)
    )
    .$if(status != null, (qb) => qb.where("status", "=", status))
    .$if(pageNumber !== undefined, (qb) =>
      qb
        .limit(limit ? limit : 20)
        .offset(
          limit && pageNumber
            ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
            : 0
        )
    )
    .where("user_id", "=", user_id)
    .orderBy("created_at desc")
    .execute();
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  const transformedResponse = await transformResponse(
    result,
    columns,
    fallback_lang,
    lang?.toString() || "en",
    null
  );
  return { transformedResponse, count: count?.bonus_count };
};
export const checkBonusStatus = async (userId: number) => {
  const check = await db
    .selectFrom("user_bonus")
    .select(["status"])
    .where("user_id", "=", userId)
    .executeTakeFirst();
  return check;
};
export const bonusDetails = async (code: string) => {
  const result = await db
    .selectFrom("bonus_types")
    .select(["code", "amount", "validity_days","qualifying_amount"])
    .where("code", "=", code)
    .where("enabled", "=", 1)
    .executeTakeFirst();
  return result;
};
export const dateFormat = async () => {
  const query = await db
    .selectFrom("user_bonus")
    .select([
      sql`DATE_FORMAT(awarded_on,'%M_%Y')`.as("awarded_month_name"),
      sql`DATE_FORMAT(awarded_on,'%m_%Y')`.as("awarded_month_number"),
    ])
    .distinct()
    .execute();
  return query;
};
export const stats = async (userId: number) => {
  const bonus_stats = await db
    .selectFrom("user_bonus")
    .select([
      "bonus_code",
      sql`count(*)`.as("bonus_count"),
      sql`SUM(amount)`.as("total_amount"),
      "status",
    ])
    .groupBy(["bonus_code", "status"])
    .where("user_id", "=", userId)
    .execute();
  const bonus_status = await db
    .selectFrom("user_bonus")
    .select(["status", sql`count(*)`.as("status_count")])
    .groupBy("status")
    .where("user_id", "=", userId)
    .execute();
  return {
    bonus_stats,
    bonus_status,
  };
};
export const fetchTrends = async (userId: number) => {
  const result = await db
    .selectFrom("user_bonus")
    .select([
      sql` SUM(CASE WHEN awarded_on >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 ELSE 0 END)`.as(
        "LastDay"
      ),
      sql`SUM(CASE WHEN awarded_on >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END)`.as(
        "Last30Days"
      ),
      sql` SUM(CASE WHEN awarded_on >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END)`.as(
        "Last7Days"
      ),
    ])
    .where("user_id", "=", userId)
    .execute();
  return result;
};
export const insertBonus = async(userId:number,bonusCode:any,amount:any,status:any)=>{
  const result = await db.insertInto("user_bonus").values({
    user_id:userId,
    bonus_code:bonusCode,
    amount:amount,
    status:status,
    awarded_on:new Date()
  }).execute();
  return result;
}