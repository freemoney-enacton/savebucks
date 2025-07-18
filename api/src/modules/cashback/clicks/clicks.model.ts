import { sql } from "kysely";
import { db } from "../../../database/database";
import { date } from "zod";

export const fetch = async (
  pageNumber: number | null,
  limit: number | null,
  date: string | null,
  userId: number
) => {
  const query = await db
    .selectFrom("clicks")
    .leftJoin("stores", "stores.id", "clicks.store_id")
    .select([
      "stores.name as store_name",
      "clicks.cashback_enabled",
      "clicks.click_time",
      "clicks.code",
      "clicks.confirm_duration",
      "clicks.id",
      "clicks.user_cashback_id",
      "clicks.user_id",
    ])

    .$if(date != null, (qb) =>
      qb.where(sql`DATE_FORMAT(clicked_on,"%m_%Y")`, "=", date)
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
    .orderBy("click_time", "desc")
    .execute();
  const count = await db
    .selectFrom("clicks")
    .select(sql`COUNT(*)`.as("count"))
    .$if(date != null, (qb) =>
      qb.where(sql`DATE_FORMAT(clicked_on,"%m_%Y")`, "=", date)
    )
    .where("user_id", "=", userId)
    .executeTakeFirst();
  return { clicks: query, count: count?.count };
};


export const dateFormat = async () => {
  const query = await db
    .selectFrom("clicks")
    .select([
      sql`DATE_FORMAT(clicked_on,'%M_%Y')`.as("clicked_month_name"),
      sql`DATE_FORMAT(clicked_on,'%m_%Y')`.as("clicked_month_number"),
    ])
    .distinct()
    .execute();
  return query;
};

export const getClickById=async(click_id:number)=>{
  const result=await db
    .selectFrom("clicks")
    .selectAll()
    .where("id",'=',click_id)
    .executeTakeFirst()
    return result || null
}

