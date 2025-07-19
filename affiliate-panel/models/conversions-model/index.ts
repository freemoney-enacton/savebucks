import { db } from "@/db";
import { affiliateConversionsSummary, conversions } from "@/db/schema";
import {
  and,
  count,
  desc,
  eq,
  gte,
  InferSelectModel,
  lte,
  or,
  sql,
  sum,
} from "drizzle-orm";
import { date } from "drizzle-orm/mysql-core";
import moment from "moment";

type AffiliateConversionsSummaryType = InferSelectModel<
  typeof affiliateConversionsSummary
>;

export const insertConversion = async (conversionData: any) => {
  try {
    const insertedId = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(conversions)
        .values(conversionData)
        .execute();
      return (inserted as any).insertId ?? (inserted as any)[0]?.insertId;
    });

    return {
      data: { id: insertedId },
      message: "Conversion created successfully",
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

export const updateConversion = async (id: number, updateData: any) => {
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(conversions)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(conversions.id, id))
        .execute();
    });

    if (!id) {
      return {
        data: null,
        message: "Conversion not found",
        status: "error",
      };
    }

    return {
      data: { id },
      message: "Conversion updated successfully",
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

export const deleteConversion = async (id: number) => {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(conversions).where(eq(conversions.id, id)).execute();
    });

    if (!id) {
      return {
        data: null,
        message: "Conversion not found",
        status: "error",
      };
    }

    return {
      data: { id },
      message: "Conversion deleted successfully",
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

export const getConversionById = async (id: number) => {
  try {
    const result = await db
      .select()
      .from(conversions)
      .where(eq(conversions.id, id))
      .limit(1);

    if (result.length === 0) {
      return {
        data: null,
        message: "Conversion not found",
        status: "error",
      };
    }

    return {
      data: result[0],
      message: "Conversion retrieved successfully",
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

export const getConversionsByAffiliate = async (
  affiliateId: number,
  rows_per_page: number = 10,
  page: number = 1,
  status?: "pending" | "approved" | "declined" | "paid",
  from?: string,
  to?: string
) => {
  try {
    const defaultTo = new Date();
    const defaultFrom = new Date();
    defaultFrom.setMonth(defaultFrom.getMonth() - 1);

    const fromDate = from ? new Date(from) : defaultFrom;
    const toDate = to ? new Date(to) : defaultTo;

    let whereConditions = [
      eq(conversions.affiliateId, affiliateId),
      gte(conversions.createdAt, fromDate),
      lte(conversions.createdAt, toDate),
    ];

    if (status) {
      whereConditions.push(eq(conversions.status, status));
    }

    const offset = (page - 1) * rows_per_page;

    const countResult = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${conversions.id})`,
      })
      .from(conversions)
      .where(and(...whereConditions));

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / rows_per_page);

    const result = await db
      .select()
      .from(conversions)
      .where(and(...whereConditions))
      .limit(rows_per_page)
      .offset(offset)
      .orderBy(desc(conversions.createdAt));

    // console.log(result);

    return {
      data: result,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        rowsPerPage: rows_per_page,
      },
      message: "Conversions retrieved successfully",
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

export const getConversionsByCampaign = async (
  campaignId: number,
  limit: number = 50,
  offset: number = 0
) => {
  try {
    const result = await db
      .select()
      .from(conversions)
      .where(eq(conversions.campaignId, campaignId))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(conversions.createdAt));

    return {
      data: result,
      message: "Conversions retrieved successfully",
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

export const getConversionByTransactionId = async (transactionId: string) => {
  try {
    const result = await db
      .select()
      .from(conversions)
      .where(eq(conversions.transactionId, transactionId))
      .limit(1);

    if (result.length === 0) {
      return {
        data: null,
        message: "Conversion not found",
        status: "error",
      };
    }

    return {
      data: result[0],
      message: "Conversion retrieved successfully",
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

export const updateConversionStatus = async (
  id: number,
  status: "approved" | "declined" | "pending" | "paid"
) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(conversions)
        .set({ status, updatedAt: new Date() })
        .where(eq(conversions.id, id))
        .execute();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Conversion not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Conversion status updated successfully",
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

export const getConversionStatsForAffiliate = async (affiliateId: number) => {
  try {
    const result = await db
      .select({
        totalCount: count(),
        totalValue: sum(conversions.conversionValue),
        totalCommission: sum(conversions.commission),
      })
      .from(conversions)
      .where(
        and(
          eq(conversions.affiliateId, affiliateId),
          or(eq(conversions.status, "approved"), eq(conversions.status, "paid"))
        )
      );

    return {
      data: {
        count: result[0]?.totalCount || 0,
        totalValue: result[0]?.totalValue || "0",
        totalCommission: result[0]?.totalCommission || "0",
      },
      message: "Conversion stats retrieved successfully",
      status: "success",
    };
  } catch (error: any) {
    return {
      data: {
        count: 0,
        totalValue: "0",
        totalCommission: "0",
      },
      message: error.message || "An error occurred",
      status: "error",
    };
  }
};

// Helper function to determine the appropriate grouping based on date range
function getDateGrouping(startDate: Date, endDate: Date) {
  const daysDiff = moment(endDate).diff(moment(startDate), "days");

  if (daysDiff <= 7) {
    return "day";
  } else if (daysDiff <= 31) {
    return "day"; // Still show daily for up to a month
  } else if (daysDiff <= 365) {
    return "week";
  } else {
    return "month";
  }
}

function formatDateForGrouping(date: moment.Moment, grouping: string) {
  switch (grouping) {
    case "day":
      return date.format("MMM DD");
    case "week":
      return `Week ${date.week()}`;
    case "month":
      return date.format("MMM YYYY");
    default:
      return date.format("MMM DD");
  }
}
export async function getCommissionDataByDateRange(
  affiliate_id: number,
  fromDate: string,
  toDate: string
) {
  const startDate = moment(fromDate).startOf("day").toDate();
  const endDate = moment(toDate).endOf("day").toDate();

  const grouping = getDateGrouping(startDate, endDate);

  try {
    let result: any[] = [];

    if (grouping === "day") {
      result = await db
        .select({
          date: sql<string>`DATE(${conversions.updatedAt})`,
          totalCommission: sql<string>`SUM(${conversions.commission})`,
        })
        .from(conversions)
        .where(
          and(
            eq(conversions.affiliateId, affiliate_id),
            eq(conversions.status, "approved"),
            gte(conversions.updatedAt, startDate),
            lte(conversions.updatedAt, endDate)
          )
        )
        .groupBy(sql`DATE(${conversions.updatedAt})`)
        .orderBy(sql`DATE(${conversions.updatedAt})`);
    } else if (grouping === "week") {
      result = await db
        .select({
          week: sql<number>`EXTRACT(WEEK FROM ${conversions.updatedAt})`,
          year: sql<number>`EXTRACT(YEAR FROM ${conversions.updatedAt})`,
          totalCommission: sql<string>`SUM(${conversions.commission})`,
        })
        .from(conversions)
        .where(
          and(
            eq(conversions.affiliateId, affiliate_id),
            eq(conversions.status, "approved"),
            gte(conversions.updatedAt, startDate),
            lte(conversions.updatedAt, endDate)
          )
        )
        .groupBy(
          sql`EXTRACT(WEEK FROM ${conversions.updatedAt}), EXTRACT(YEAR FROM ${conversions.updatedAt})`
        )
        .orderBy(
          sql`EXTRACT(YEAR FROM ${conversions.updatedAt}), EXTRACT(WEEK FROM ${conversions.updatedAt})`
        );
    } else if (grouping === "month") {
      result = await db
        .select({
          month: sql<number>`EXTRACT(MONTH FROM ${conversions.updatedAt})`,
          year: sql<number>`EXTRACT(YEAR FROM ${conversions.updatedAt})`,
          totalCommission: sql<string>`SUM(${conversions.commission})`,
        })
        .from(conversions)
        .where(
          and(
            eq(conversions.affiliateId, affiliate_id),
            eq(conversions.status, "approved"),
            gte(conversions.updatedAt, startDate),
            lte(conversions.updatedAt, endDate)
          )
        )
        .groupBy(
          sql`EXTRACT(MONTH FROM ${conversions.updatedAt}), EXTRACT(YEAR FROM ${conversions.updatedAt})`
        )
        .orderBy(
          sql`EXTRACT(YEAR FROM ${conversions.updatedAt}), EXTRACT(MONTH FROM ${conversions.updatedAt})`
        );
    }
    const chartData: any[] = [];

    if (grouping === "day") {
      const currentDate = moment(startDate);
      const endMoment = moment(endDate);

      while (currentDate.isSameOrBefore(endMoment, "day")) {
        const dateStr = currentDate.format("YYYY-MM-DD");
        const dataPoint = result.find((row) => row.date === dateStr);

        chartData.push({
          day: formatDateForGrouping(currentDate, grouping),
          amount: dataPoint ? parseFloat(dataPoint.totalCommission) || 0 : 0,
          date: dateStr,
          fullDate: currentDate.format("dddd, MMMM DD, YYYY"),
        });

        currentDate.add(1, "day");
      }
    } else if (grouping === "week") {
      const currentDate = moment(startDate).startOf("week");
      const endMoment = moment(endDate).endOf("week");

      while (currentDate.isSameOrBefore(endMoment, "week")) {
        const week = currentDate.week();
        const year = currentDate.year();
        const dataPoint = result.find(
          (row) => row.week === week && row.year === year
        );

        chartData.push({
          day: `Week ${week}`,
          amount: dataPoint ? parseFloat(dataPoint.totalCommission) || 0 : 0,
          date: currentDate.format("YYYY-MM-DD"),
          fullDate: `Week ${week}, ${year} (${currentDate.format(
            "MMM DD"
          )} - ${currentDate.clone().endOf("week").format("MMM DD")})`,
        });

        currentDate.add(1, "week");
      }
    } else if (grouping === "month") {
      const currentDate = moment(startDate).startOf("month");
      const endMoment = moment(endDate).endOf("month");

      while (currentDate.isSameOrBefore(endMoment, "month")) {
        const month = currentDate.month() + 1; // moment months are 0-indexed
        const year = currentDate.year();
        const dataPoint = result.find(
          (row) => row.month === month && row.year === year
        );

        chartData.push({
          day: formatDateForGrouping(currentDate, grouping),
          amount: dataPoint ? parseFloat(dataPoint.totalCommission) || 0 : 0,
          date: currentDate.format("YYYY-MM-DD"),
          fullDate: currentDate.format("MMMM YYYY"),
        });

        currentDate.add(1, "month");
      }
    }

    return {
      data: chartData,
      grouping: grouping,
      dateRange: {
        from: fromDate,
        to: toDate,
      },
    };
  } catch (error) {
    console.error("Error fetching commission data:", error);
    return {
      data: [],
      grouping: "day",
      dateRange: {
        from: fromDate,
        to: toDate,
      },
    };
  }
}

export const getEarningsDataForAffiliate = async (affiliateId: number) => {
  const result = await db
    .select({
      totalEarnings: sql<number>`COALESCE(SUM(CASE WHEN ${conversions.status} IN ('approved', 'paid') THEN ${conversions.commission} ELSE 0 END), 0)`,
      pendingEarning: sql<number>`COALESCE(SUM(CASE WHEN ${conversions.status} = 'pending' THEN ${conversions.commission} ELSE 0 END), 0)`,
    })
    .from(conversions)
    .where(eq(conversions.affiliateId, affiliateId));

  return {
    totalEarnings: (result[0]?.totalEarnings as number) || 0,
    pendingEarning: (result[0]?.pendingEarning as number) || 0,
  };
};

export const getAllAffiliateTransactions = async (
  affiliateId: number,
  rows_per_page: number = 10,
  page: number = 1,
  status?: "pending" | "approved" | "declined" | "paid",
  from?: string,
  to?: string,
  campaignId?: string
) => {
  try {
    const defaultTo = new Date();
    const defaultFrom = new Date();

    defaultFrom.setMonth(defaultFrom.getMonth() - 1);
    const fromDate = from ? new Date(from) : defaultFrom;
    const toDate = to ? new Date(to) : defaultTo;
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    let whereConditions = [
      eq(affiliateConversionsSummary.affiliateId, affiliateId),
      gte(affiliateConversionsSummary.conversionCreatedAt, fromDate),
      lte(affiliateConversionsSummary.conversionCreatedAt, toDate),
    ];

    if (status) {
      whereConditions.push(
        eq(affiliateConversionsSummary.conversionStatus, status)
      );
    }

    if (campaignId) {
      whereConditions.push(
        eq(affiliateConversionsSummary.campaignId, parseInt(campaignId))
      );
    }

    const offset = (page - 1) * rows_per_page;

    const countResult = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${affiliateConversionsSummary.clickCode})`,
      })
      .from(affiliateConversionsSummary)
      .where(and(...whereConditions));

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / rows_per_page);

    const result = await db
      .select()
      .from(affiliateConversionsSummary)
      .where(and(...whereConditions))
      .limit(rows_per_page)
      .offset(offset)
      .orderBy(desc(affiliateConversionsSummary.conversionCreatedAt));

    return {
      data: result,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        rowsPerPage: rows_per_page,
      },
      message: "Conversions retrieved successfully",
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

export const getAffiliateConversionsSummaryByTrackingCode = async (
  tracking_code: string
): Promise<{
  data: AffiliateConversionsSummaryType | null;
  message: string;
  status: "success" | "error";
}> => {
  try {
    const result = await db
      .select()
      .from(affiliateConversionsSummary)
      .where(eq(affiliateConversionsSummary.trackingCode, tracking_code))
      .limit(1);
    return {
      data: result[0] || null,
      message: "Conversion retrieved successfully",
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
