import { sql } from "kysely";
import { db } from "../../database/database";
import transformResponse from "../../utils/transformResponse";
const columns = {
  translatable: ["label"],
  money: [],
  date: [],
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

export const fetch = async (country_code: string | null, limit: number) => {
  if (limit <= 0) limit = 1;

  const result = await db
    .selectFrom("tickers")
    .innerJoin("users", "users.id", "tickers.user_id")
    .select([
      "user_id",
      "users.name as user_name",
      "users.referral_code as user_referral_code",
      "users.country_code as user_country_code",
      "users.is_private as user_is_private",
      "users.avatar as user_avatar",
      "ticker_type",
      "ticker_data",
    ])
    .$if(!!country_code, (query) =>
      query.where("users.country_code", "=", country_code)
    )
    .limit(limit)
    .where("users.status","=","active")
    .where("users.is_deleted","!=",1)
    .orderBy("tickers.created_at", "desc")
    .execute();

  return result;
};
