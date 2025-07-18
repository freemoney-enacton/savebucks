import { db } from "@/db";
import { affiliateCampaignGoals } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export const getAllAffiliateCampaignGoals = async ({ filters }: any) => {
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

    if (filters?.affiliateId) {
      whereConditions.push(
        eq(affiliateCampaignGoals.affiliateId, parseInt(filters.affiliateId))
      );
    }

    if (filters?.campaignId) {
      whereConditions.push(
        eq(affiliateCampaignGoals.campaignId, parseInt(filters.campaignId))
      );
    }

    if (filters?.campaignGoalId) {
      whereConditions.push(
        eq(
          affiliateCampaignGoals.campaignGoalId,
          parseInt(filters.campaignGoalId)
        )
      );
    }

    const countResult = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(affiliateCampaignGoals)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / rows_per_page);

    const result = await db
      .select()
      .from(affiliateCampaignGoals)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(affiliateCampaignGoals.createdAt)
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

export const getAffiliateCampaignGoalById = async (
  goal_id: number,
  affiliate_id: any
) => {
  try {
    const result = await db
      .select()
      .from(affiliateCampaignGoals)
      .where(
        and(
          eq(affiliateCampaignGoals.campaignGoalId, goal_id),
          eq(affiliateCampaignGoals.affiliateId, affiliate_id)
        )
      );

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

export const getAffiliateCampaignGoalsByAffiliateId = async (
  affiliateId: number
) => {
  try {
    const result = await db
      .select()
      .from(affiliateCampaignGoals)
      .where(eq(affiliateCampaignGoals.affiliateId, affiliateId));

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

export const getAffiliateCampaignGoalsByCampaignId = async (
  campaignId: number,
  affiliateId: number
) => {
  try {
    const result = await db
      .select()
      .from(affiliateCampaignGoals)
      .where(
        and(
          eq(affiliateCampaignGoals.campaignId, campaignId),
          eq(affiliateCampaignGoals.affiliateId, affiliateId)
        )
      );

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

export const insertAffiliateCampaignGoal = async (
  affiliateCampaignGoalData: any
) => {
  try {
    const result = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(affiliateCampaignGoals)
        .values(affiliateCampaignGoalData)
        .returning();
      return inserted[0];
    });

    return {
      data: result,
      message: "Affiliate campaign goal created successfully",
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

export const updateAffiliateCampaignGoal = async (
  id: number,
  updateData: any
) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(affiliateCampaignGoals)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(affiliateCampaignGoals.id, id))
        .returning();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate campaign goal not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate campaign goal updated successfully",
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

export const deleteAffiliateCampaignGoal = async (id: number) => {
  try {
    const result = await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(affiliateCampaignGoals)
        .where(eq(affiliateCampaignGoals.id, id))
        .returning();
      return deleted[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate campaign goal not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate campaign goal deleted successfully",
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
