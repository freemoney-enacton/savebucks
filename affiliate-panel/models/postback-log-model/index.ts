import { db } from "@/db";
import { postbackLogs } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export const getAllPostbackLogs = async ({ filters }: any) => {
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
      whereConditions.push(eq(postbackLogs.status, filters.status));
    }

    if (filters?.transactionId) {
      whereConditions.push(
        eq(postbackLogs.transactionId, filters.transactionId)
      );
    }

    const countResult = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(postbackLogs)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / rows_per_page);

    const result = await db
      .select()
      .from(postbackLogs)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(sql`${postbackLogs.receivedAt} DESC`)
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

export const getPostbackLogById = async (id: number) => {
  try {
    const result = await db
      .select()
      .from(postbackLogs)
      .where(eq(postbackLogs.id, id));

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

export const getPostbackLogByTransactionId = async (transactionId: string) => {
  try {
    const result = await db
      .select()
      .from(postbackLogs)
      .where(eq(postbackLogs.transactionId, transactionId));

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

export const insertPostbackLog = async (postbackLogData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(postbackLogs)
        .values(postbackLogData)
        .returning();
      return inserted[0];
    });

    return {
      data: result,
      message: "Postback log created successfully",
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

export const updatePostbackLog = async (id: number, updateData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(postbackLogs)
        .set(updateData)
        .where(eq(postbackLogs.id, id))
        .returning();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Postback log not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Postback log updated successfully",
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

export const markPostbackLogAsProcessed = async (
  id: number,
  processedAt: string
) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(postbackLogs)
        .set({ processedAt })
        .where(eq(postbackLogs.id, id))
        .returning();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Postback log not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Postback log marked as processed successfully",
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

export const deletePostbackLog = async (id: number) => {
  try {
    const result = await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(postbackLogs)
        .where(eq(postbackLogs.id, id))
        .returning();
      return deleted[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Postback log not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Postback log deleted successfully",
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

export const getPendingPostbackLogs = async () => {
  try {
    const result = await db
      .select()
      .from(postbackLogs)
      .where(eq(postbackLogs.status, "pending"));

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

export const updatePostbackLogStatus = async (
  id: number,
  status: "success" | "failure",
  message?: any
) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(postbackLogs)
        .set({
          status,
          statusMessages: message,
          processedAt: new Date().toISOString(),
        })
        .where(eq(postbackLogs.id, id))
        .returning();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Postback log not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Postback log status updated successfully",
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
