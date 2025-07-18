import app from "../../../app";
import { db } from "../../../database/database";
import transformResponse from "../../../utils/transformResponse";
export const columns = {
  translatable: ["name", "title", "blocks"],
  money: [],
  date: [],
};
export const fetch = async () => {
  const result = await db
    .selectFrom("pages")
    .selectAll()
    .where("status", "=", "publish")
    .execute();
  return result;
};
