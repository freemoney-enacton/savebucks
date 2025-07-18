import { sql } from "kysely";
import app from "../../app";
import { db } from "../../database/database";
import transformResponse from "../../utils/transformResponse";
const columns = {
  translatable: ["name","h1","h2","meta_title","meta_desc"],
  money: [],
  date: ['created_at','updated_at'],
};
export const fetch = async (lang: string, default_lang: string) => {
  const result = await db
    .selectFrom("store_categories")
    .select([
     "id",
      "name",
      "slug",
      "icon",
      "parent_id",
      "header_image",
      "is_featured",  
      "store_count",
      "h1",
      "h2",
      "meta_title",
      "meta_desc",
    
    ])
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
