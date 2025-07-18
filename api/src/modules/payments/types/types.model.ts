import { db } from "../../../database/database";
import transformResponse from "../../../utils/transformResponse";
export const columns = {
  translatable: [
    "name",
    "account_input_label",
    "account_input_hint",
    "payment_group",
    "payment_inputs",
    "description",
  ],
  money: [],
  date: [],
};
export const fetchTypes = async (lang: any, default_lang: string) => {
  const result = await db
    .selectFrom("payment_types")
    .select([
      "id",
      "code",
      "name",
      "image",
      "card_image",
      "account_input_type",
      "account_input_label",
      "account_input_hint",
      "payment_inputs",
      "minimum_amount",
      "transaction_fees_allowed",
      "transaction_fees_amount",
      "transaction_fees_type",
      "transaction_bonus_allowed",
      "transaction_bonus_amount",
      "transaction_bonus_type",
      "conversion_enabled",
      "conversion_rate",
      "cashback_allowed",
      "bonus_allowed",
      "payment_group",
      "enabled",
      "country_customizable",
      "country_configuration",
      "description",
    ])
    .where("enabled", "=", 1)
    .execute();
  const paymentGroups = await db
    .selectFrom("payment_types")
    .select(["payment_group"])
    .distinct()
    .where("enabled", "=", 1)
    .execute();
  const transformedResponse = await transformResponse(
    result,
    columns,
    default_lang,
    lang?.toString() || "en",
    null
  );
  const groupTransformResponse = await transformResponse(
    paymentGroups,
    columns,
    default_lang,
    lang?.toString() || "en",
    null
  );
  return { modes: groupTransformResponse, details: transformedResponse };
};
