import { sql } from "kysely";
import { db } from "../../../database/database";
import transformResponse from "../../../utils/transformResponse";
import app from "../../../app";

export const columns = {
  translatable: ["name", "goal_name", "network_name"],
  // hidden: ["ID", "status", "category_id"],
  money: [],
  date: [],
};
export const stats = async (userId: number) => {
  const result = await db
    .selectFrom("user_sales")
    .select([
      "status", 
      sql`COUNT(*)`.as("earnings_count"),
      sql`SUM(amount)`.as("earnings_amount"),
    ])
    .groupBy(["status"])
    .where("user_id", "=", userId)
    .execute();
  return result;
};

export const lists = async (
  userId: number,
  status: "pending" | "confirmed" | "declined" | null,
  month_year: string | null,
  limit: number | null,
  pageNumber: number | undefined,
  lang: string
) => {
  const result = await db
    .selectFrom("user_sales")
    .leftJoin("stores", "stores.id", "user_sales.store_id")
    .select([
      "stores.name as store_name",
      "stores.logo as store_logo",
      "user_sales.id",
      "user_sales.user_id",
      "user_sales.order_id",
      "user_sales.store_id",
      "user_sales.click_id",
      "user_sales.click_code",
      "user_sales.order_amount",
      "user_sales.cashback",
      "user_sales.cashback_type",
      "user_sales.currency",
      "user_sales.status",
      "user_sales.transaction_time",
      "user_sales.expected_date"
    ])
    .$if(month_year != null, (qb) =>
      qb.where(
        sql`DATE_FORMAT(user_sales.created_at,"%m_%Y")`,
        "=",
        month_year
      )
    )
    .where("user_sales.status", "!=", "declined")
    .where("user_sales.user_id", "=", userId)
    .$if(pageNumber !== undefined, (qb) =>
      qb
        .limit(limit ? limit : 20)
        .offset(
          limit && pageNumber
            ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
            : 0
        )
    )
    .orderBy("transaction_time", "desc") 
    .execute();

  const count = await db
    .selectFrom("user_sales")
    .select(sql`COUNT(*)`.as("count"))
    .$if(month_year != null, (qb) =>
      qb.where(sql`DATE_FORMAT(created_at,"%m_%Y")`, "=", month_year)
    )
    .$if(status != null, (qb) => qb.where("status", "=", status))
    .where("user_id", "=", userId)
    .where("status", "!=", "declined")
    .executeTakeFirst();
  
  return { earnings: result, count: count?.count };
};

export const dateFormat = async () => {
  const query = await db
    .selectFrom("user_sales")
    .select([
      sql`DATE_FORMAT(created_at,'%M_%Y')`.as("created_month_name"),
      sql`DATE_FORMAT(created_at,'%m_%Y')`.as("created_month_number"),
    ])
    .distinct()
    .execute();
  return query;
};

