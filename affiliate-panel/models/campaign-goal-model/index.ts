import { db } from "@/db";
import { campaignGoals } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export const getAllCampaignGoals = async ({ filters }: any) => {
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

    if (filters?.campaignId) {
      whereConditions.push(
        eq(campaignGoals.campaignId, parseInt(filters.campaignId))
      );
    }

    if (filters?.status) {
      whereConditions.push(eq(campaignGoals.status, filters.status));
    }

    const countResult = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(campaignGoals)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / rows_per_page);

    const result = await db
      .select()
      .from(campaignGoals)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(campaignGoals.createdAt)
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

export const getCampaignGoalById = async (id: number) => {
  try {
    const result = await db
      .select()
      .from(campaignGoals)
      .where(eq(campaignGoals.id, id));

    return {
      data: result[0] || null,
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

export const getCampaignGoalsByCampaignId = async (campaignId: number) => {
  try {
    const result = await db
      .select()
      .from(campaignGoals)
      .where(eq(campaignGoals.campaignId, campaignId));

    return {
      data: result,
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

export const getCampaignGoalByTrackingCode = async (trackingCode: string) => {
  try {
    const result = await db
      .select()
      .from(campaignGoals)
      .where(eq(campaignGoals.trackingCode, trackingCode));

    return {
      data: result[0] || null,
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

export const insertCampaignGoal = async (campaignGoalData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(campaignGoals)
        .values(campaignGoalData)
        .returning();
      return inserted[0];
    });

    return {
      data: result,
      message: "Campaign goal created successfully",
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

export const updateCampaignGoal = async (id: number, updateData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(campaignGoals)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(campaignGoals.id, id))
        .returning();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Campaign goal not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Campaign goal updated successfully",
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

export const deleteCampaignGoal = async (id: number) => {
  try {
    const result = await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(campaignGoals)
        .where(eq(campaignGoals.id, id))
        .returning();
      return deleted[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Campaign goal not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Campaign goal deleted successfully",
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
