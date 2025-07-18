import { db } from "../../database/database";

export const getNetworkData = async (network: string) => {
  const result = await db
    .selectFrom("offerwall_networks")
    .select(["api_key"])
    .where("code", "=", network)
    .where("type", "=", "surveys")
    .executeTakeFirst();
  return result;
};
