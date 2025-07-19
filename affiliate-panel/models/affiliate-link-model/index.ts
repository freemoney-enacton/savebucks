import { db } from "@/db";
import {
  affiliateLinks,
  affiliates,
  campaigns,
  clicks,
  conversions,
} from "@/db/schema";
import { and, eq, sql, desc, ilike, gte, lte } from "drizzle-orm";

export const getAllAffiliateLinks = async ({ filters }: any) => {
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

    // Build where conditions
    const whereConditions = [];

    if (filters?.campaignId) {
      whereConditions.push(
        eq(affiliateLinks.campaignId, parseInt(filters.campaignId))
      );
    }

    if (filters?.affiliateId) {
      whereConditions.push(
        eq(affiliateLinks.affiliateId, parseInt(filters.affiliateId))
      );
    }

    if (filters?.status) {
      whereConditions.push(eq(affiliateLinks.status, filters.status));
    }

    if (filters?.search) {
      whereConditions.push(ilike(affiliateLinks.slug, `%${filters.search}%`));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const countResult = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(affiliateLinks)
      .where(whereClause);

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / rows_per_page);

    const result = await db
      .select({
        id: affiliateLinks.id,
        campaignId: affiliateLinks.campaignId,
        affiliateId: affiliateLinks.affiliateId,
        slug: affiliateLinks.slug,
        destinationUrl: affiliateLinks.destinationUrl,
        sub1: affiliateLinks.sub1,
        sub2: affiliateLinks.sub2,
        sub3: affiliateLinks.sub3,
        totalClicks: affiliateLinks.totalClicks,
        totalEarnings: affiliateLinks.totalEarnings,
        status: affiliateLinks.status,
        createdAt: affiliateLinks.createdAt,
        updatedAt: affiliateLinks.updatedAt,
        campaign: {
          id: campaigns.id,
          name: campaigns.name,
        },
        affiliate: {
          id: affiliates.id,
          name: affiliates.name,
          email: affiliates.email,
        },
      })
      .from(affiliateLinks)
      .leftJoin(campaigns, eq(affiliateLinks.campaignId, campaigns.id))
      .leftJoin(affiliates, eq(affiliateLinks.affiliateId, affiliates.id))
      .where(whereClause)
      .orderBy(desc(affiliateLinks.createdAt))
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

export const getAffiliateLinkById = async (id: number) => {
  try {
    const result = await db
      .select({
        id: affiliateLinks.id,
        campaignId: affiliateLinks.campaignId,
        affiliateId: affiliateLinks.affiliateId,
        slug: affiliateLinks.slug,
        name: affiliateLinks.name,
        destinationUrl: affiliateLinks.destinationUrl,
        sub1: affiliateLinks.sub1,
        sub2: affiliateLinks.sub2,
        sub3: affiliateLinks.sub3,
        totalClicks: affiliateLinks.totalClicks,
        totalEarnings: affiliateLinks.totalEarnings,
        status: affiliateLinks.status,
        createdAt: affiliateLinks.createdAt,
        updatedAt: affiliateLinks.updatedAt,
        campaign: {
          id: campaigns.id,
          name: campaigns.name,
          description: campaigns.description,
        },
        affiliate: {
          id: affiliates.id,
          name: affiliates.name,
          email: affiliates.email,
        },
      })
      .from(affiliateLinks)
      .leftJoin(campaigns, eq(affiliateLinks.campaignId, campaigns.id))
      .leftJoin(affiliates, eq(affiliateLinks.affiliateId, affiliates.id))
      .where(eq(affiliateLinks.id, id));

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

export const getAffiliateLinkBySlug = async (slug: string) => {
  try {
    const result = await db
      .select()
      .from(affiliateLinks)
      .where(eq(affiliateLinks.slug, slug));

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

export const getAffiliateLinkNameById = async (id: number) => {
  try {
    const result = await db
      .select({
        name: affiliateLinks.name,
      })
      .from(affiliateLinks)
      .where(eq(affiliateLinks.id, id));
    return {
      data: result[0]?.name || null,
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

export const getAffiliateLinksByAffiliateId = async (
  affiliateId: number,
  filters?: any
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

    const whereConditions = [
      eq(affiliateLinks.affiliateId, affiliateId),
      gte(affiliateLinks.createdAt, fromDate),
      lte(affiliateLinks.createdAt, toDate),
    ];

    if (filters?.status) {
      whereConditions.push(eq(affiliateLinks.status, filters.status));
    }

    const whereClause = and(...whereConditions);

    const countResult = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(affiliateLinks)
      .where(whereClause);

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / rows_per_page);

    const result = await db
      .select({
        id: affiliateLinks.id,
        campaignId: affiliateLinks.campaignId,
        name: affiliateLinks.name,
        slug: affiliateLinks.slug,
        destinationUrl: affiliateLinks.destinationUrl,
        sub1: affiliateLinks.sub1,
        sub2: affiliateLinks.sub2,
        sub3: affiliateLinks.sub3,
        totalClicks: affiliateLinks.totalClicks,
        totalEarnings: affiliateLinks.totalEarnings,
        status: affiliateLinks.status,
        createdAt: affiliateLinks.createdAt,
        updatedAt: affiliateLinks.updatedAt,
        campaign: {
          id: campaigns.id,
          name: campaigns.name,
        },
      })
      .from(affiliateLinks)
      .leftJoin(campaigns, eq(affiliateLinks.campaignId, campaigns.id))
      .where(whereClause)
      .orderBy(desc(affiliateLinks.createdAt))
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

export const insertAffiliateLink = async (linkData: any) => {
  try {
    const insertedId = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(affiliateLinks)
        .values(linkData)
        .execute();
      return (inserted as any).insertId ?? (inserted as any)[0]?.insertId;
    });

    return {
      data: { id: insertedId },
      message: "Affiliate link created successfully",
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

export const updateAffiliateLink = async (id: number, updateData: any) => {
  try {
    // If updating slug, check for uniqueness
    if (updateData.slug) {
      const existingSlug = await db
        .select()
        .from(affiliateLinks)
        .where(
          and(
            eq(affiliateLinks.slug, updateData.slug),
            sql`${affiliateLinks.id} != ${id}`
          )
        );

      if (existingSlug.length > 0) {
        return {
          data: null,
          message: "Slug already exists. Please choose a different slug.",
          status: "error",
        };
      }
    }

    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(affiliateLinks)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(affiliateLinks.id, id))
        .execute();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate link not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate link updated successfully",
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

export const deleteAffiliateLink = async (id: number) => {
  try {
    const result = await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(affiliateLinks)
        .where(eq(affiliateLinks.id, id))
        .execute();
      return deleted[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate link not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate link deleted successfully",
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

export const updateAffiliateLinkStats = async (
  id: number,
  clickCount?: number,
  earnings?: string
) => {
  try {
    const updateData: any = { updatedAt: new Date() };

    if (clickCount !== undefined) {
      updateData.totalClicks = Number(clickCount);
    }

    if (earnings !== undefined) {
      updateData.totalEarnings = Number(earnings).toFixed(2);
    }

    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(affiliateLinks)
        .set(updateData)
        .where(eq(affiliateLinks.id, id))
        .execute();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate link not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate link stats updated successfully",
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

export const getAffiliateLinkStats = async (id: number) => {
  try {
    const result = await db
      .select({
        id: affiliateLinks.id,
        slug: affiliateLinks.slug,
        totalClicks: affiliateLinks.totalClicks,
        totalEarnings: affiliateLinks.totalEarnings,
        clicksToday: sql<number>`
          COALESCE((
            SELECT COUNT(*)
            FROM ${clicks}
            WHERE ${clicks.affiliateLinkId} = ${affiliateLinks.id}
            AND DATE(${clicks.clickedAt}) = CURRENT_DATE
          ), 0)
        `,
        conversionsCount: sql<number>`
          COALESCE((
            SELECT COUNT(*)
            FROM ${conversions}
            WHERE ${conversions.campaignId} = ${affiliateLinks.campaignId}
            AND ${conversions.affiliateId} = ${affiliateLinks.affiliateId}
          ), 0)
        `,
      })
      .from(affiliateLinks)
      .where(eq(affiliateLinks.id, id));

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

export const getAllAffiliateLinksEarnings = async (affiliateId: number) => {
  try {
    const result = await db
      .select({
        totalEarnings: sql<number>`COALESCE(SUM(${affiliateLinks.totalEarnings}), 0)`,
      })
      .from(affiliateLinks)
      .where(eq(affiliateLinks.affiliateId, affiliateId));

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

export const updateAffiliateLinkStatus = async (
  id: number,
  status: "active" | "inactive"
) => {
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(affiliateLinks)
        .set({ status, updatedAt: new Date() })
        .where(eq(affiliateLinks.id, id))
        .execute();
    });

    if (!id) {
      return {
        data: null,
        message: "Affiliate link not found",
        status: "error",
      };
    }

    return {
      data: { id },
      message: "Affiliate link status updated successfully",
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
