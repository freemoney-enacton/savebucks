import { db } from "@/db";
import { clicks } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export const getAllClicks = async ({ filters }: any) => {
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
        eq(clicks.affiliateId, parseInt(filters.affiliateId))
      );
    }

    if (filters?.campaignId) {
      whereConditions.push(eq(clicks.campaignId, parseInt(filters.campaignId)));
    }

    if (filters?.affiliateLinkId) {
      whereConditions.push(
        eq(clicks.affiliateLinkId, parseInt(filters.affiliateLinkId))
      );
    }

    if (filters?.isConverted !== undefined) {
      whereConditions.push(eq(clicks.isConverted, filters.isConverted));
    }

    const countResult = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(clicks)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / rows_per_page);

    const result = await db
      .select()
      .from(clicks)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(sql`${clicks.clickedAt} DESC`)
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

export const getClickById = async (id: number) => {
  try {
    const result = await db.select().from(clicks).where(eq(clicks.id, id));

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

export const getClickByClickCode = async (clickCode: string) => {
  try {
    const result = await db
      .select()
      .from(clicks)
      .where(eq(clicks.clickCode, clickCode));

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

export const getClicksByAffiliateId = async (affiliateId: number) => {
  try {
    const result = await db
      .select()
      .from(clicks)
      .where(eq(clicks.affiliateId, affiliateId))
      .orderBy(sql`${clicks.clickedAt} DESC`);

    const totalClicks = result?.length;

    return {
      data: result ? { result, totalClicks } : null,
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

export const getClicksByCampaignId = async (campaignId: number) => {
  try {
    const result = await db
      .select()
      .from(clicks)
      .where(eq(clicks.campaignId, campaignId))
      .orderBy(sql`${clicks.clickedAt} DESC`);

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

export const getClicksByAffiliateLinkId = async (affiliateLinkId: number) => {
  try {
    const result = await db
      .select()
      .from(clicks)
      .where(eq(clicks.affiliateLinkId, affiliateLinkId))
      .orderBy(sql`${clicks.clickedAt} DESC`);

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

export const insertClick = async (clickData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const inserted = await tx.insert(clicks).values(clickData).returning();
      return inserted[0];
    });

    return {
      data: result,
      message: "Click recorded successfully",
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

export const updateClick = async (id: number, updateData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(clicks)
        .set(updateData)
        .where(eq(clicks.id, id))
        .returning();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Click not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Click updated successfully",
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

export const markClickAsConverted = async (clickCode: string) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(clicks)
        .set({ isConverted: true })
        .where(eq(clicks.clickCode, clickCode))
        .returning();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Click not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Click marked as converted successfully",
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

export const deleteClick = async (id: number) => {
  try {
    const result = await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(clicks)
        .where(eq(clicks.id, id))
        .returning();
      return deleted[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Click not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Click deleted successfully",
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
