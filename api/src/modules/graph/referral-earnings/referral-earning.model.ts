import { sql } from "kysely";
import { db } from "../../../database/database";

// export const graphLast30Days = async (userId: any) => {
//   const today = new Date();
//   const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

//   const formatDate = (date: any) => {
//     return date.toLocaleDateString("en-US", { day: "numeric", month: "long" });
//   };
//   const formatNumericDate = (date: Date): string => {
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
//     const day = date.getDate().toString().padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };
//   const allDates = [];
//   for (let day = 0; day <= 30; day++) {
//     const date = new Date(thirtyDaysAgo);
//     date.setDate(date.getDate() + day);
//     allDates.push(formatDate(date));
//   }
//   const earningsByDate: any = allDates.map((date) => ({
//     date,
//     Available: 0,
//     Pending: 0,
//     Withdraw: 0,
//   }));

//   const confirmedEarningsResult = await db
//     .selectFrom("user_referral_earnings")
//     .select([
//       sql`DATE(user_referral_earnings.created_at)`.as("date"),
//       sql`SUM(CASE WHEN user_referral_earnings.status = 'confirmed' THEN user_referral_earnings.referral_amount ELSE 0 END)`.as(
//         "totalConfirmed"
//       ),
//     ])
//     .where("user_referral_earnings.user_id", "=", userId)
//     .where(
//       "user_referral_earnings.created_at",
//       ">=",
//       formatNumericDate(new Date(thirtyDaysAgo)) as any
//     )
//     .groupBy("date")
//     .execute();

  

//   confirmedEarningsResult.forEach(({ date, totalConfirmed }) => {
//     const formattedDate = (date as any).toLocaleDateString("en-US", {
//       day: "numeric",
//       month: "long",
//     });

//     const index = earningsByDate.findIndex(
//       (entry: any) => entry.date === formattedDate
//     );
//     if (index !== -1) {
//       earningsByDate[index].Available = totalConfirmed;
//     }
//   });

  

//   const combinedEarningsByDate = earningsByDate.map((entry: any) => ({
//     date: entry.date,
//     RecentEarnings: entry.Available,
//     pending: entry.Pending,
//     withdraw: entry.Withdraw,
//   }));

//   return combinedEarningsByDate;
// };
export const graphLast30Days = async (userId: any) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

  const formatDate = (date: any) => {
    return date.toLocaleDateString("en-US", { day: "numeric", month: "long" });
  };
  const formatNumericDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const allDates = [];
  for (let day = 1; day <= 30; day++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + day);
    allDates.push(formatDate(date));
  }
  const earningsByDate: any = allDates.map((date) => ({
    date,
    Available: 0,
    Pending: 0,
    Withdraw: 0,
  }));

  // Get earnings from user_referral_earnings table
  const confirmedEarningsResult = await db
    .selectFrom("user_referral_earnings")
    .select([
      sql`DATE(user_referral_earnings.created_at)`.as("date"),
      sql`SUM(CASE WHEN user_referral_earnings.status = 'confirmed' THEN user_referral_earnings.referral_amount ELSE 0 END)`.as(
        "totalConfirmed"
      ),
    ])
    .where("user_referral_earnings.user_id", "=", userId)
    .where(
      "user_referral_earnings.created_at",
      ">=",
      formatNumericDate(new Date(thirtyDaysAgo)) as any
    )
    .groupBy("date")
    .execute();

  // Get earnings from user_referrer_sales table
  const confirmedSalesResult = await db
    .selectFrom("user_referrer_sales")
    .select([
      sql`DATE(user_referrer_sales.created_at)`.as("date"),
      sql`SUM(CASE WHEN user_referrer_sales.status = 'confirmed' THEN user_referrer_sales.referral_amount ELSE 0 END)`.as(
        "totalConfirmed"
      ),
    ])
    .where("user_referrer_sales.user_id", "=", userId)
    .where(
      "user_referrer_sales.created_at",
      ">=",
      formatNumericDate(new Date(thirtyDaysAgo)) as any
    )
    .groupBy("date")
    .execute();

    
  // Update earnings data with values from user_referral_earnings
  confirmedEarningsResult.forEach(({ date, totalConfirmed }) => {
    const formattedDate = (date as any).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });

    const index = earningsByDate.findIndex(
      (entry: any) => entry.date === formattedDate
    );
    if (index !== -1) {
      earningsByDate[index].Available = parseFloat(String(totalConfirmed))
    }
  });

  // Update earnings data with values from user_referrer_sales
  confirmedSalesResult.forEach(({ date, totalConfirmed }) => {
    const formattedDate = (date as any).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });

    const index = earningsByDate.findIndex(
      (entry: any) => entry.date === formattedDate
    );
    if (index !== -1) {
      // Add to the existing value instead of replacing it
    const currentValue = parseFloat(String(earningsByDate[index].Available || 0))    
    const additionalValue = parseFloat(String(totalConfirmed || 0)); 
    earningsByDate[index].Available = currentValue + additionalValue;
    
    }
  });
    

  const combinedEarningsByDate = earningsByDate.map((entry: any) => ({
    date: entry.date,
    RecentEarnings: entry.Available.toFixed(2),
    pending: entry.Pending.toFixed(2),
    withdraw: entry.Withdraw,
  }));

  return combinedEarningsByDate;
};