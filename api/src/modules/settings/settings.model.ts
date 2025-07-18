import { db } from "../../database/database";

export const fetch = async (group: string) => {
  const result = db
    .selectFrom("settings")
    .selectAll()
    .where("group", "=", group)
    .execute();
  return result;
};

export const fetchCountry = async () => {
  const result = await db
    .selectFrom("countries")
    .select(["name", "code", "dial_code"])
    .where("is_enabled", "=", 1)
    .execute();
  return result;
};
export const fetchAll = async () => {
  const result = await db.selectFrom("settings").selectAll().execute();
  return result;
};
export const fetchLanguage = async () => {
  const result = await db
    .selectFrom("languages")
    .selectAll()
    .where("is_enabled", "=", 1)
    .execute();
  return result;
};
export const fetchBonus = async () => {
  const bonus = await db
    .selectFrom("bonus_types")
    .select(["code", "amount"])
    .where("enabled", "=", 1)
    .execute();
  return bonus;
};
export const fetchCurrency=async()=>{
  const result =await db
    .selectFrom("currencies")
    .selectAll()
    .where("enabled","=",1)
    .execute()
  return result;
}

export const fetchMinAmount=async()=>{
  const result = await db
  .selectFrom("payment_types")
  .select(({ fn }) => [
    fn.min("minimum_amount").as("lowest_minimum_amount")
  ])
  .executeTakeFirst();

  return result
}

export const getDefaultCurrency = async () => {
  const default_currency = await db
    .selectFrom("settings")
    .select("val")
    .where("name", "=", "default_currency")
    .executeTakeFirst();

  if(!default_currency) return null;

  const bonus = await db
    .selectFrom("currencies")
    .select([
      "name",
      "iso_code",
      "symbol",
      "symbol_position"
    ])
    .where("enabled", "=", 1)
    .where('iso_code', "=", default_currency.val)
    .executeTakeFirst();

  return bonus;
};


export const getPagesMetaTitleDesc = async () => {
  return await db.selectFrom("pages")
    .select([
      "slug",
      "meta_title",
      "meta_desc"
    ])
    .where("status","=","publish")
    .execute();
}



