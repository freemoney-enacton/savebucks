import { sql } from "kysely";
import app from "../../app";
import { db } from "../../database/database";
import transformResponse from "../../utils/transformResponse";
const columns = {
  translatable: ["name"],
  money: [],
  date: [],
};
export const fetch = async (lang: string, default_lang: string) => {
  const result = await db
    .selectFrom("offerwall_categories")
    .select([
      "id",
      "name",
      "slug",
      "icon",
      "bg_color",
      "text_color",
      "sort_order",
      "show_menu",
    ])
    .where("is_enabled", "=", 1)
    .orderBy("sort_order asc")
    .execute();
  const transformedResponse = await transformResponse(
    result,
    columns,
    default_lang,
    lang,
    null
  );
  return transformedResponse;
};
