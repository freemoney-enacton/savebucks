import { db } from "@/db";
import { affiliatePostbacks, campaignGoals, campaigns } from "@/db/schema";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";

export const insertAffiliatePostback = async (postbackData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(affiliatePostbacks)
        .values(postbackData)
        .returning();
      return inserted[0];
    });

    return {
      data: result,
      message: "Affiliate postback created successfully",
      status: "success",
    };
  } catch (error: any) {
    return {
      data: error,
      message: error.message || "An error occurred",
      status: "error",
    };
  }
};

export const updateAffiliatePostback = async (id: number, updateData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(affiliatePostbacks)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(affiliatePostbacks.id, id))
        .returning();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate postback not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate postback updated successfully",
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

export const deleteAffiliatePostback = async (id: number) => {
  try {
    const result = await db.transaction(async (tx) => {
      const deleted = await tx
        .update(affiliatePostbacks)
        .set({
          isDeleted: true,
          deletedAt: new Date(),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(affiliatePostbacks.id, id))
        .returning();
      return deleted[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate postback not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate postback deleted successfully",
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

export const getAffiliatePostbackById = async (id: number) => {
  try {
    const result = await db
      .select()
      .from(affiliatePostbacks)
      .where(eq(affiliatePostbacks.id, id))
      .limit(1);

    if (result.length === 0) {
      return {
        data: null,
        message: "Affiliate postback not found",
        status: "error",
      };
    }

    return {
      data: result[0],
      message: "Affiliate postback retrieved successfully",
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

export const getAffiliatePostbacksByAffiliate = async (
  affiliateId: number,
  filters: any
) => {
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

    const defaultTo = new Date();
    const defaultFrom = new Date();
    defaultFrom.setMonth(defaultFrom.getMonth() - 1);

    const fromDate = filters?.from ? new Date(filters?.from) : defaultFrom;
    const toDate = filters?.to ? new Date(filters?.to) : defaultTo;
    toDate.setHours(23, 59, 59, 999);

    const countResult = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(affiliatePostbacks)
      .where(
        and(
          eq(affiliatePostbacks.affiliateId, affiliateId),
          eq(affiliatePostbacks.isDeleted, false),
          gte(affiliatePostbacks.createdAt, fromDate.toISOString()),
          lte(affiliatePostbacks.createdAt, toDate.toISOString())
        )
      );

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / rows_per_page);

    const result = await db
      .select({
        ...(affiliatePostbacks as any),
        goalName: campaignGoals.name,
        campaignName: campaigns.name,
      })
      .from(affiliatePostbacks)
      .where(
        and(
          eq(affiliatePostbacks.affiliateId, affiliateId),
          eq(affiliatePostbacks.isDeleted, false),
          gte(affiliatePostbacks.createdAt, fromDate.toISOString()),
          lte(affiliatePostbacks.createdAt, toDate.toISOString())
        )
      )
      .leftJoin(
        campaignGoals,
        eq(affiliatePostbacks.campaignGoalId, campaignGoals.id)
      )
      .leftJoin(campaigns, eq(affiliatePostbacks.campaignId, campaigns.id))
      .orderBy(desc(affiliatePostbacks.createdAt))
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
        countResult: countResult[0]?.count || 0,
      },
      message: "Affiliate postbacks retrieved successfully",
      status: "success",
    };
  } catch (error: any) {
    return {
      data: [],
      message: error.message || "An error occurred",
      status: "error",
    };
  }
};

export const getAffiliatePostbacksByCampaign = async (campaignId: number) => {
  try {
    const result = await db
      .select()
      .from(affiliatePostbacks)
      .where(eq(affiliatePostbacks.campaignId, campaignId))
      .orderBy(desc(affiliatePostbacks.createdAt));

    return {
      data: result,
      message: "Affiliate postbacks retrieved successfully",
      status: "success",
    };
  } catch (error: any) {
    return {
      data: [],
      message: error.message || "An error occurred",
      status: "error",
    };
  }
};

export const getAffiliatePostbackByCampaignAndGoal = async (
  affiliateId: number,
  campaignId: number,
  campaignGoalId?: number
) => {
  try {
    let query = db
      .select()
      .from(affiliatePostbacks)
      .where(
        and(
          eq(affiliatePostbacks.affiliateId, affiliateId),
          eq(affiliatePostbacks.campaignId, campaignId),
          campaignGoalId
            ? eq(affiliatePostbacks.campaignGoalId, campaignGoalId)
            : undefined
        )
      );

    const result = await query;

    if (result.length === 0) {
      return {
        data: null,
        message: "Affiliate postback not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate postback retrieved successfully",
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
