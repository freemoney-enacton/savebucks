import app from "../../../app";
import { db } from "../../../database/database";
import transformResponse from "../../../utils/transformResponse";
export const columns = {
  translatable: ["title"],
  money: [],
  date: [],
};

export const fetch = async (lang: string, default_lang: string) => {
  const result = await db.selectFrom("menus").selectAll().where("status", "=", "publish").execute();
  const response = await transformResponse(
    result,
    columns,
    default_lang,
    lang,
    null
  );
  return response;
};
