import { sql } from "kysely";
import { db } from "../../../database/database";

export const earningStats = async (userId: any) => {
  const confirmedEarningsResult = await db
    .selectFrom("user_offerwall_sales")
    .innerJoin(
      "user_bonus",
      "user_offerwall_sales.user_id",
      "user_bonus.user_id"
    )
    .select([
      sql`SUM(CASE WHEN user_offerwall_sales.status = 'confirmed' THEN user_offerwall_sales.amount ELSE 0 END + 
                CASE WHEN user_bonus.status = 'confirmed' THEN user_bonus.amount ELSE 0 END)`.as(
        "totalConfirmed"
      ),
    ])
    .where("user_offerwall_sales.user_id", "=", userId)
    .execute();
  const confirmedEarnings = confirmedEarningsResult[0]?.totalConfirmed || 0;

  const pendingEarningsResult = await db
    .selectFrom("user_offerwall_sales")
    .innerJoin(
      "user_bonus",
      "user_offerwall_sales.user_id",
      "user_bonus.user_id"
    )
    .select([
      sql`SUM(CASE WHEN user_offerwall_sales.status = 'pending' THEN user_offerwall_sales.amount ELSE 0 END + 
                CASE WHEN user_bonus.status = 'pending' THEN user_bonus.amount ELSE 0 END)`.as(
        "totalPending"
      ),
    ])
    .where("user_offerwall_sales.user_id", "=", userId)
    .execute();
  const pendingEarnings = pendingEarningsResult[0]?.totalPending || 0;

  const paymentsResult = await db
    .selectFrom("user_payments")
    .select([
      sql`SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END)`.as(
        "totalPaid"
      ),
      sql`SUM(CASE WHEN status IN ('processing', 'created') THEN amount ELSE 0 END)`.as(
        "inProgressPayments"
      ),
    ])
    .where("user_payments.user_id", "=", userId)
    .execute();
  const { totalPaid, inProgressPayments } = paymentsResult[0];

  const graphData = await graph(userId);

  return {
    Available: confirmedEarnings,
    Pending: pendingEarnings,
    Withdraw: totalPaid,
    totalEarnings:
      Number(totalPaid) +
      Number(confirmedEarnings) +
      Number(pendingEarnings) +
      Number(inProgressPayments),
    inProgressPayments,
    graphData,
  };
};

export const graph = async (userId: any) => {
  const getMonthName = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1];
  };

  const allMonths: any = [];
  for (let month = 12; month >= 1; month--) {
    allMonths.push(getMonthName(month));
  }

  const earningsByMonth: any = allMonths.map((month: any) => ({
    month,
    Available: 0,
    Pending: 0,
    Withdraw: 0,
  }));

  const confirmedEarningsResult = await db
    .selectFrom("user_offerwall_sales")
    .innerJoin(
      "user_bonus",
      "user_offerwall_sales.user_id",
      "user_bonus.user_id"
    )
    .select([
      sql`MONTHNAME(user_bonus.created_at)`.as("monthName"),
      sql`SUM(CASE WHEN user_offerwall_sales.status = 'confirmed' THEN user_offerwall_sales.amount ELSE 0 END + 
                CASE WHEN user_bonus.status = 'confirmed' THEN user_bonus.amount ELSE 0 END)`.as(
        "totalConfirmed"
      ),
    ])
    .where("user_offerwall_sales.user_id", "=", userId)
    .groupBy("monthName")
    .execute();

  const pendingEarningsResult = await db
    .selectFrom("user_offerwall_sales")
    .innerJoin(
      "user_bonus",
      "user_offerwall_sales.user_id",
      "user_bonus.user_id"
    )
    .select([
      sql`MONTHNAME(user_bonus.created_at)`.as("monthName"),
      sql`SUM(CASE WHEN user_offerwall_sales.status = 'pending' THEN user_offerwall_sales.amount ELSE 0 END + 
                CASE WHEN user_bonus.status = 'pending' THEN user_bonus.amount ELSE 0 END)`.as(
        "totalPending"
      ),
    ])
    .where("user_offerwall_sales.user_id", "=", userId)
    .groupBy("monthName")
    .execute();

  const paymentsResult = await db
    .selectFrom("user_payments")
    .select([
      sql`MONTHNAME(paid_at)`.as("monthName"),
      sql`SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END)`.as(
        "totalPaid"
      ),
    ])
    .where("user_payments.user_id", "=", userId)
    .groupBy("monthName")
    .execute();
  confirmedEarningsResult.forEach(({ monthName, totalConfirmed }) => {
    const index = earningsByMonth.findIndex(
      (element: any) => element.month === monthName
    );
    if (index !== -1) {
      earningsByMonth[index].Available = totalConfirmed;
    }
  });

  pendingEarningsResult.forEach(({ monthName, totalPending }) => {
    const index = earningsByMonth.findIndex(
      (element: any) => element.month === monthName
    );
    if (index !== -1) {
      earningsByMonth[index].Pending = totalPending;
    }
  });

  paymentsResult.forEach(({ monthName, totalPaid }) => {
    const index = earningsByMonth.findIndex(
      (element: any) => element.month === monthName
    );
    if (index !== -1) {
      earningsByMonth[index].Withdraw = totalPaid;
    }
  });

  earningsByMonth.sort(
    (a: any, b: any) => allMonths.indexOf(a.month) - allMonths.indexOf(b.month)
  );

  return earningsByMonth.map((entry: any) => ({
    month: entry.month,
    Available: entry.Available,
    Pending: entry.Pending,
    Withdraw: entry.Withdraw,
  }));
};

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
//     .selectFrom("user_offerwall_sales")
//     .select([
//       sql`DATE(user_offerwall_sales.created_at)`.as("date"),
//       sql`SUM(CASE WHEN user_offerwall_sales.status = 'confirmed' THEN user_offerwall_sales.amount ELSE 0 END)`.as(
//         "totalConfirmed"
//       ),
//     ])
//     .where("user_offerwall_sales.user_id", "=", userId)
//     .where(
//       "user_offerwall_sales.created_at",
//       ">=",
//       formatNumericDate(new Date(thirtyDaysAgo)) as any
//     )
//     .groupBy("date")
//     .execute();
//   const pendingEarningsResult = await db
//     .selectFrom(["user_offerwall_sales", "user_bonus"])
//     .select([
//       sql`DATE(user_offerwall_sales.created_at)`.as("offerwall_date"),
//       sql`DATE(user_bonus.created_at)`.as("bonus_date"),
//       sql`SUM(CASE WHEN user_offerwall_sales.status = 'pending' THEN user_offerwall_sales.amount ELSE 0 END + CASE WHEN user_bonus.status = 'pending' THEN user_bonus.amount ELSE 0 END)`.as(
//         "totalPending"
//       ),
//       "user_bonus.created_at",
//       "user_offerwall_sales.created_at",
//     ])
//     .where("user_offerwall_sales.user_id", "=", userId)
//     .where("user_bonus.user_id", "=", userId)
//     .where(
//       "user_offerwall_sales.created_at",
//       ">=",
//       formatNumericDate(new Date(thirtyDaysAgo)) as any
//     )
//     .where(
//       "user_bonus.created_at",
//       ">=",
//       formatNumericDate(new Date(thirtyDaysAgo)) as any
//     )
//     .groupBy(["user_bonus.created_at", "user_offerwall_sales.created_at"])
//     .execute();
//   const paymentsResult = await db
//     .selectFrom("user_payments")
//     .select([
//       sql`DATE(paid_at)`.as("date"),
//       sql`SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END)`.as(
//         "totalPaid"
//       ),
//     ])
//     .where("user_payments.user_id", "=", userId)
//     .where("paid_at", ">=", formatNumericDate(new Date(thirtyDaysAgo)) as any)
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

//   pendingEarningsResult.forEach(({ created_at, totalPending }) => {
//     const formattedDate = (created_at as any).toLocaleDateString("en-US", {
//       day: "numeric",
//       month: "long",
//     });

//     const index = earningsByDate.findIndex(
//       (entry: any) => entry.date === formattedDate
//     );
//     if (index !== -1) {
//       earningsByDate[index].Pending = totalPending;
//     }
//   });

//   paymentsResult.forEach(({ date, totalPaid }) => {
//     const formattedDate = (date as any).toLocaleDateString("en-US", {
//       day: "numeric",
//       month: "long",
//     });

//     const index = earningsByDate.findIndex(
//       (entry: any) => entry.date === formattedDate
//     );
//     if (index !== -1) {
//       earningsByDate[index].Withdraw = totalPaid;
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
    CashbackConfirmed: 0,
    CashbackPending: 0,
  }));

  // Fetch confirmed earnings (original query)
  const confirmedEarningsResult = await db
    .selectFrom("user_offerwall_sales")
    .select([
      sql`DATE(user_offerwall_sales.created_at)`.as("date"),
      sql`SUM(CASE WHEN user_offerwall_sales.status = 'confirmed' THEN user_offerwall_sales.amount ELSE 0 END)`.as(
        "totalConfirmed"
      ),
    ])
    .where("user_offerwall_sales.user_id", "=", userId)
    .where(
      "user_offerwall_sales.created_at",
      ">=",
      formatNumericDate(new Date(thirtyDaysAgo)) as any
    )
    .groupBy("date")
    .execute();

  // Fetch confirmed cashback (new query)
  const confirmedCashbackResult = await db
    .selectFrom("user_sales")
    .select([
      sql`DATE(created_at)`.as("date"),
      sql`SUM(CASE WHEN status = 'confirmed' THEN cashback ELSE 0 END)`.as(
        "totalCashback"
      ),
    ])
    .where("user_id", "=", userId)
    .where(
      "created_at",
      ">=",
      formatNumericDate(new Date(thirtyDaysAgo)) as any
    )
    .groupBy("date")
    .execute();

  // Fetch pending earnings (original query with modification)
  const pendingEarningsResult = await db
    .selectFrom(["user_offerwall_sales", "user_bonus"])
    .select([
      sql`DATE(user_offerwall_sales.created_at)`.as("offerwall_date"),
      sql`DATE(user_bonus.created_at)`.as("bonus_date"),
      sql`SUM(CASE WHEN user_offerwall_sales.status = 'pending' THEN user_offerwall_sales.amount ELSE 0 END + CASE WHEN user_bonus.status = 'pending' THEN user_bonus.amount ELSE 0 END)`.as(
        "totalPending"
      ),
      "user_bonus.created_at",
      "user_offerwall_sales.created_at",
    ])
    .where("user_offerwall_sales.user_id", "=", userId)
    .where("user_bonus.user_id", "=", userId)
    .where(
      "user_offerwall_sales.created_at",
      ">=",
      formatNumericDate(new Date(thirtyDaysAgo)) as any
    )
    .where(
      "user_bonus.created_at",
      ">=",
      formatNumericDate(new Date(thirtyDaysAgo)) as any
    )
    .groupBy(["user_bonus.created_at", "user_offerwall_sales.created_at"])
    .execute();

  // Fetch pending cashback (new query)
  const pendingCashbackResult = await db
    .selectFrom("user_sales")
    .select([
      sql`DATE(created_at)`.as("date"),
      sql`SUM(CASE WHEN status = 'pending' THEN cashback ELSE 0 END)`.as(
        "totalPendingCashback"
      ),
    ])
    .where("user_id", "=", userId)
    .where(
      "created_at",
      ">=",
      formatNumericDate(new Date(thirtyDaysAgo)) as any
    )
    .groupBy("date")
    .execute();

  // Fetch payments (original query)
  const paymentsResult = await db
    .selectFrom("user_payments")
    .select([
      sql`DATE(paid_at)`.as("date"),
      sql`SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END)`.as(
        "totalPaid"
      ),
    ])
    .where("user_payments.user_id", "=", userId)
    .where("paid_at", ">=", formatNumericDate(new Date(thirtyDaysAgo)) as any)
    .groupBy("date")
    .execute();

  // Add confirmed earnings to results
  confirmedEarningsResult.forEach(({ date, totalConfirmed }) => {
    const formattedDate = (date as any).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });

    const index = earningsByDate.findIndex(
      (entry: any) => entry.date === formattedDate
    );
    if (index !== -1) {
      earningsByDate[index].Available = totalConfirmed ||0;
    }
  });

  // Add confirmed cashback to results
  confirmedCashbackResult.forEach(({ date, totalCashback }) => {
    const formattedDate = (date as any).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });

    const index = earningsByDate.findIndex(
      (entry: any) => entry.date === formattedDate
    );
    if (index !== -1) {
      earningsByDate[index].CashbackConfirmed = totalCashback||0;
    }
  });

  // Add pending earnings to results
  pendingEarningsResult.forEach(({ created_at, totalPending }) => {
    const formattedDate = (created_at as any).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });

    const index = earningsByDate.findIndex(
      (entry: any) => entry.date === formattedDate
    );
    if (index !== -1) {
      earningsByDate[index].Pending = totalPending||0;
    }
  });

  // Add pending cashback to results
  pendingCashbackResult.forEach(({ date, totalPendingCashback }) => {
    const formattedDate = (date as any).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });

    const index = earningsByDate.findIndex(
      (entry: any) => entry.date === formattedDate
    );
    if (index !== -1) {
      earningsByDate[index].CashbackPending = totalPendingCashback||0;
    }
  });

  // Add payments to results
  paymentsResult.forEach(({ date, totalPaid }) => {
    const formattedDate = (date as any).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });

    const index = earningsByDate.findIndex(
      (entry: any) => entry.date === formattedDate
    );
    if (index !== -1) {
      earningsByDate[index].Withdraw = totalPaid;
    }
  });

  // Combine all results
  // const combinedEarningsByDate = earningsByDate.map((entry: any) => ({
  //   console.log(entry.Available)
  //   date: entry.date,
  //   RecentEarnings: entry.Available + entry.CashbackConfirmed, // Combine confirmed earnings with cashback
  //   pending: entry.Pending + entry.CashbackPending, // Combine pending earnings with cashback
  //   withdraw: entry.Withdraw,
  // }));

  const combinedEarningsByDate = earningsByDate.map((entry: any) => ({
    
      date: entry.date,
      RecentEarnings: (Number(entry.Available) + Number(entry.CashbackConfirmed)).toFixed(2).toString(), // Combine confirmed earnings with cashback
      pending: (Number(entry.Pending) + Number(entry.CashbackPending)).toFixed(2).toString(), // Combine pending earnings with cashback
      withdraw: entry.Withdraw,
    
  }))

  return combinedEarningsByDate;
};

export const graphClicksLast30Days = async (userId: any) => {
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
  
  // Generate all dates for the past 30 days
  const allDates = [];
  for (let day = 1; day <= 30; day++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + day);
    allDates.push(formatDate(date));
  }
  
  // Initialize data structure with zero clicks for each date
  const clicksByDate: any = allDates.map((date) => ({
    date,
    totalClicks: 0,
  }));

  // Query to get click counts by date
  const clicksResult = await db
    .selectFrom("clicks")
    .select([
      sql`DATE(click_time)`.as("date"),
      sql`COUNT(id)`.as("clickCount"),
    ])
    .where("user_id", "=", userId)
    .where(
      "click_time",
      ">=",
      formatNumericDate(new Date(thirtyDaysAgo)) as any
    )
    .groupBy("date")
    .execute();

  // Populate the results
  clicksResult.forEach(({ date, clickCount }) => {
    const formattedDate = (date as any).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });

    const index = clicksByDate.findIndex(
      (entry: any) => entry.date === formattedDate
    );
    
    if (index !== -1) {
      clicksByDate[index].totalClicks = clickCount;
    }
  });

  // Format data for the graph
  const formattedClickData = clicksByDate.map((entry: any) => ({
    date: entry.date,
    clicks: entry.totalClicks,
  }));

  return formattedClickData;
};