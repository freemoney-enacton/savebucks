import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import FilterComponent from "@/components/transactions/FilterComponent";
import { createTranslation } from "@/i18n/server";
import { getAuthSession } from "@/models/auth-models";
import { getAllAffiliateTransactions } from "@/models/conversions-model";
import { AppRoutes } from "@/utils/routes";
import { redirect } from "next/navigation";

export default async function TransactionsPage({ searchParams }: any) {
  const { from, to, status, rows_per_page, page } = searchParams;
  const user = await getAuthSession();
  const userStatus = user?.user?.status;

  if (userStatus === "pending") {
    return redirect(AppRoutes.auth.pending);
  }
  const { t } = await createTranslation();
  const transactions =
    (await getAllAffiliateTransactions(
      user.user.id,
      rows_per_page,
      page,
      status,
      from,
      to
    )) || [];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t("transactions.title")}</h1>
      </div>

      <FilterComponent />

      <TransactionsTable transactions={transactions} />
    </DashboardLayout>
  );
}
