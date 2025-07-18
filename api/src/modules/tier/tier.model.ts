import { db } from "../../database/database";
import transformResponse from "../../utils/transformResponse";
const columns = {
  translatable: ["label"],
  money: [],
  date: [],
};

export const fetch = async (
  lang: string,
  default_lang: string
) => {
  const result = await db
    .selectFrom("tiers")
    .select([
      "tier",
      "label",
      "icon",
      "affiliate_commission",
      "required_affiliate_earnings",
    ])
    .where("enabled", "=", 1)
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