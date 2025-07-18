import { db } from "../../../database/database";

export const fetch = async (lang: string) => {
  const result = await db
    .selectFrom("footers")
    .selectAll()
    .where("status", "=", "publish")
    .orderBy("sort_order asc")
    .execute();
  return result;
};
