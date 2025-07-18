import { db } from "../../../database/database";

export const fetch = async () => {
  const result = await db.selectFrom("banners").selectAll().where("status", "=", "publish").execute();
  return result;
};
