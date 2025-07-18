import { db } from "@/db";
import { payouts } from "@/db/schema";
import { and, desc, eq, gte, lte, or, sql, sum } from "drizzle-orm";

export const getAllPayouts = async ({ filters }: any) => {
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
        eq(payouts.affiliateId, parseInt(filters.affiliateId))
      );
    }

    if (filters?.status) {
      whereConditions.push(eq(payouts.status, filters.status));
    }

    if (filters?.paymentMethod) {
      whereConditions.push(eq(payouts.paymentMethod, filters.paymentMethod));
    }

    const countResult = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(payouts)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / rows_per_page);

    const result = await db
      .select()
      .from(payouts)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(payouts.createdAt)
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

export const getPayoutById = async (id: number) => {
  try {
    const result = await db.select().from(payouts).where(eq(payouts.id, id));

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

export const getPayoutsByAffiliateId = async (
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

    const whereConditions = [
      eq(payouts.affiliateId, affiliateId),
      gte(payouts.createdAt, fromDate.toISOString()),
      lte(payouts.createdAt, toDate.toISOString()),
    ];

    const whereClause = and(...whereConditions);

    const countResult = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(payouts)
      .where(whereClause);

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / rows_per_page);

    const result = await db
      .select()
      .from(payouts)
      .where(whereClause)
      .orderBy(desc(payouts.createdAt))
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

export const getApprovedPayoutsByAffiliateId = async (affiliateId: number) => {
  try {
    const result = await db
      .select({ amount: payouts.requestedAmount })
      .from(payouts)
      .where(
        and(eq(payouts.affiliateId, affiliateId), eq(payouts.status, "paid"))
      )
      .orderBy(payouts.createdAt);

    const amount = result.reduce((sum, payout) => {
      return sum + parseFloat(payout.amount || "0");
    }, 0);

    return {
      data: amount,
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

export const getPayoutByTransactionId = async (transactionId: string) => {
  try {
    const result = await db
      .select()
      .from(payouts)
      .where(eq(payouts.transactionId, transactionId));

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

export const insertPayout = async (payoutData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const inserted = await tx.insert(payouts).values(payoutData).returning();
      return inserted[0];
    });

    return {
      data: result,
      message: "Payout created successfully",
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

export const updatePayout = async (id: number, updateData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(payouts)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(payouts.id, id))
        .returning();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Payout not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Payout updated successfully",
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

export const approvePayoutRequest = async (
  id: number,
  transactionId: string,
  apiResponse: any,
  paidAt: string
) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(payouts)
        .set({
          status: "paid",
          transactionId,
          apiResponse,
          paidAt,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(payouts.id, id))
        .returning();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Payout not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Payout approved successfully",
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

export const declinePayoutRequest = async (id: number, adminNotes: string) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(payouts)
        .set({
          status: "rejected",
          adminNotes,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(payouts.id, id))
        .returning();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Payout not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Payout declined successfully",
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

export const deletePayout = async (id: number) => {
  try {
    const result = await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(payouts)
        .where(eq(payouts.id, id))
        .returning();
      return deleted[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Payout not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Payout deleted successfully",
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

export const getInProcessPayoutsAmountByAffiliateId = async (
  affiliateId: number
) => {
  try {
    const result = await db
      .select({ amout: sum(payouts.requestedAmount) })
      .from(payouts)
      .where(
        and(
          eq(payouts.affiliateId, affiliateId),
          or(eq(payouts.status, "pending"), eq(payouts.status, "processing"))
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
