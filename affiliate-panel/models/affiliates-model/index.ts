import { db } from "@/db";
import { affiliates } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

// export const getAllAffiliates = async ({ filters }: any) => {
//   try {
//     let rows_per_page = 10;
//     let page = 1;

//     if (filters?.rows_per_page) {
//       rows_per_page = parseInt(filters.rows_per_page);
//     }

//     if (filters?.page) {
//       page = parseInt(filters.page);
//     }

//     const offset = (page - 1) * rows_per_page;

//     const countResult = await db
//       .select({
//         count: sql<number>`count(*)`,
//       })
//       .from(affiliates);

//     const totalCount = countResult[0]?.count || 0;
//     const totalPages = Math.ceil(totalCount / rows_per_page);

//     const result = await db
//       .select()
//       .from(affiliates)
//       .orderBy(affiliates.createdAt)
//       .limit(rows_per_page)
//       .offset(offset);

//     return {
//       data: {
//         result,
//         pagination: {
//           totalCount,
//           totalPages,
//           currentPage: page,
//           rows_per_page,
//         },
//       },
//       message: "ok",
//       status: "success",
//     };
//   } catch (error: any) {
//     return {
//       data: null,
//       message: error.message || "An error occurred",
//       status: "error",
//     };
//   }
// };

export const insertAffiliate = async (affiliateData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(affiliates)
        .values(affiliateData)
        .execute();
      return inserted[0];
    });

    return {
      data: result,
      message: "Affiliate created successfully",
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

export const updateAffiliate = async (id: number, updateData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(affiliates)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(affiliates.id, id))
        .execute();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate updated successfully",
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
export const updateAffiliateProfile = async (id: number, updateData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(affiliates)
        .set({
          name: updateData.name,
          address: updateData.address,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(affiliates.id, id))
        .execute();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate updated successfully",
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

export const deleteAffiliate = async (id: number) => {
  try {
    const result = await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(affiliates)
        .where(eq(affiliates.id, id))
        .execute();
      return deleted[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate deleted successfully",
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

export const getAffiliateById = async (id: number) => {
  try {
    const result = await db
      .select()
      .from(affiliates)
      .where(eq(affiliates.id, id));

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
export const getAffiliateByEmail = async (email: string) => {
  try {
    const result = await db
      .select()
      .from(affiliates)
      .where(eq(affiliates.email, email));

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

export const getAffiliateStatus = async (email: string) => {
  try {
    const result = await db
      .select({
        status: affiliates.approvalStatus,
        emailVerified: affiliates.isEmailVerified,
      })
      .from(affiliates)
      .where(eq(affiliates.email, email));

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

export const updateAffiliatePassword = async (id: number, updateData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(affiliates)
        .set({
          password: updateData,
          updatedAt: new Date().toISOString(),
          token: null,
          tokenExpiry: null,
        })
        .where(eq(affiliates.id, id))
        .execute();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate password updated successfully",
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

export const updateAffiliatePaypalId = async (id: number, updateData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(affiliates)
        .set({ paypalAddress: updateData, updatedAt: new Date().toISOString() })
        .where(eq(affiliates.id, id))
        .execute();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate password updated successfully",
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

export const updateAffiliateBankDetails = async (
  id: number,
  updateData: any
) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(affiliates)
        .set({ bankDetails: updateData, updatedAt: new Date().toISOString() })
        .where(eq(affiliates.id, id))
        .execute();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate password updated successfully",
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

export const verifyAffiliateEmail = async (id: number) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(affiliates)
        .set({
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
          updatedAt: new Date().toISOString(),
          token: null,
          tokenExpiry: null,
        })
        .where(eq(affiliates.id, id))
        .execute();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate email verified successfully",
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
