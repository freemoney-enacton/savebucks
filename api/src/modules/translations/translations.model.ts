import { db } from "../../database/database";

export const fetch = async () => {
  const result = await db.selectFrom("translations").selectAll().execute();
  return result;
};
