import { db } from "@/db";
import { campaigns, affiliateCampaigns } from "@/db/schema";
import { and, eq, sql, inArray } from "drizzle-orm";

export const getAllCampaigns = async ({ filters, affiliateId }: { filters?: any; affiliateId?: number }) => {
  try {
    let rows_per_page = 10;
    let page = 1;

    if (filters?.rows_per_page) {
      rows_per_page = parseInt(filters.rows_per_page);
    }

    if (filters?.page) {
      page = parseInt(filters.page);
    }

    const offset = (page - 1) * rows_per_page;

    let whereConditions = [];

    if (filters?.status) {
      whereConditions.push(eq(campaigns.status, filters.status));
    }

    if (affiliateId) {
      whereConditions.push(
        inArray(
          campaigns.id,
          db
            .select({ campaignId: affiliateCampaigns.campaignId })
            .from(affiliateCampaigns)
            .where(
              and(
                eq(affiliateCampaigns.affiliateId, affiliateId),
                eq(affiliateCampaigns.status, "approved")
              )
            )
        )
      );
    }

    const countResult = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(campaigns)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / rows_per_page);

    const result = await db
      .select()
      .from(campaigns)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(campaigns.createdAt)
      .limit(rows_per_page)
      .offset(offset);

    return {
      data: {
        result,
        pagination: {
          totalCount,
          totalPages,
          currentPage: page,
          rows_per_page,
        },
      },
      message: "ok",
      status: "success",
    };
  } catch (error: any) {
    return {
      data: null,
      message: error.message || "An error occurred",
      status: "error",
    };
  }
};

export const getCampaignById = async (id: number) => {
  try {
    const result = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id));
    return {
      data: result[0] || null,
      message: "ok",
      status: "success",
    };
  } catch (error: any) {
    console.log("Error:", error);
    return {
      data: null,
      message: error.message || "An error occurred",
      status: "error",
    };
  }
};

export const insertCampaign = async (campaignData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(campaigns)
        .values(campaignData)
        .execute();
      return inserted[0];
    });

    return {
      data: result,
      message: "Campaign created successfully",
      status: "success",
    };
  } catch (error: any) {
    return {
      data: null,
      message: error.message || "An error occurred",
      status: "error",
    };
  }
};

export const updateCampaign = async (id: number, updateData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(campaigns)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(campaigns.id, id))
        .execute();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Campaign not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Campaign updated successfully",
      status: "success",
    };
  } catch (error: any) {
    return {
      data: null,
      message: error.message || "An error occurred",
      status: "error",
    };
  }
};

export const deleteCampaign = async (id: number) => {
  try {
    const result = await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(campaigns)
        .where(eq(campaigns.id, id))
        .execute();
      return deleted[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Campaign not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Campaign deleted successfully",
      status: "success",
    };
  } catch (error: any) {
    return {
      data: null,
      message: error.message || "An error occurred",
      status: "error",
    };
  }
};
