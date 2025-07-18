import { sql } from "kysely";
import { db } from "../../database/database";
import app from "../../app";
import transformResponse from "../../utils/transformResponse";
const columns = {
  translatable: ["name", "content"],
  money: [],
  date: [],
};

export const fetchIcon = async (code: string) => {
  const logo = await db
    .selectFrom("offerwall_networks")
    .select(["logo", "name"])
    .where("code", "=", code)
    .executeTakeFirst();
  return logo;
};

export const fetch = async (
  type: "tasks" | "surveys",
  network: string | null,
  lang: string,
  featured: number | null,
  iframe: number | null,
  default_lang: string
) => {
  const result = await db
    .selectFrom("offerwall_networks")
    .select([
      "id",
      "name",
      "code",
      "logo",
      "background_image",
      "survey_url",
      "offer_url",
      "rating",
      "rating_count",
      "rating",
      "render_type",
      "postback_key",
    ])
    .$if(featured != null || featured != undefined, (qb) =>
      qb.where("is_featured", "=", featured)
    )
    .$if(network != null || network != undefined, (qb) =>
      qb.where("code", "=", network)
    )
    .$if(type === "tasks" && iframe === 1, (qb) =>
      qb.where("offer_url", "is not", null)
    )
    .$if(type === "tasks" && iframe === 0, (qb) =>
      qb.where(eb =>
        eb('offer_url', 'is', null).or(eb('task_iframe_only', '=', 0))
      )
        
    )
    .where("type", "=", type)
    .where("enabled", "=", 1)
    .where("hidden","=",0)
    .orderBy("sort_order", "asc")
    .execute();

  const response = await transformResponse(
    result,
    columns,
    default_lang,
    lang,
    null
  );
  return response;
};

export const fetchDetails = async (network: string | null) => {
  const result = await db
    .selectFrom("offerwall_networks")
    .selectAll()
    .where("code", "=", network)
    .where("enabled", "=", 1)
    .execute();
  return result;
};
