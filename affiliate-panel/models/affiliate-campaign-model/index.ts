import { db } from "@/db";
import { affiliateCampaigns, campaigns } from "@/db/schema";
import { eq } from "drizzle-orm";

export const insertAffiliateCampaigns = async (records: any[]) => {
  try {
    await db.transaction(async (tx) => {
      if (records.length > 0) {
        await tx.insert(affiliateCampaigns).values(records).execute();
      }
    });
    return { data: true, status: "success", message: "Affiliate campaigns added" };
  } catch (error: any) {
    return { data: null, status: "error", message: error.message || "An error occurred" };
  }
};

export const getDefaultCampaigns = async () => {
  try {
    const result = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.isDefault, true));

    return { data: result, status: "success", message: "ok" };
  } catch (error: any) {
    return { data: null, status: "error", message: error.message || "An error occurred" };
  }
};
