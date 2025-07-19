import { ActiveCampaign } from "@/components/dashboard/active-campaign";
import { EarningsChart } from "@/components/dashboard/earnings-chart";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { createTranslation } from "@/i18n/server";
import { getAuthSession } from "@/models/auth-models";
import { getAllCampaigns, getCampaignById } from "@/models/campaigns-model";
import {
  getAllAffiliateTransactions,
  getCommissionDataByDateRange,
} from "@/models/conversions-model";
import { AppRoutes } from "@/utils/routes";
import { redirect } from "next/navigation";

export default async function DashboardPage({ searchParams }: any) {
  const { t } = await createTranslation();
  const { from, to } = searchParams;
  const user = await getAuthSession();
  const userStatus = user?.user?.status;

  if (userStatus === "pending") {
    return redirect(AppRoutes.auth.pending);
  }

  const campaignDetails = (await getAllCampaigns({}))?.data;
  const campaigns = campaignDetails ? campaignDetails?.result : null;

  const transactions =
    (await getAllAffiliateTransactions(user.user.id, 10)) || [];

  const commissionData = await getCommissionDataByDateRange(
    user.user.id,
    from,
    to
  );

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6">{t("dashboard.title")}</h1>
      <ActiveCampaign campaigns={campaigns || []} />
      <MetricsCards />
      <EarningsChart
        earningsData={commissionData.data}
        grouping={commissionData.grouping as "day" | "week" | "month"}
        dateRange={commissionData.dateRange}
      />
      <TransactionsTable transactions={transactions} />
    </DashboardLayout>
  );
}
