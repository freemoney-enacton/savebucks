import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import FilterComponent from "@/components/transactions/FilterComponent";
import ReportsTable from "@/components/dashboard/reports-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createTranslation } from "@/i18n/server";
import { getAuthSession } from "@/models/auth-models";
import { getAllCampaigns } from "@/models/campaigns-model";
import {
  getAffiliateDailyReport,
  getAffiliateMonthlyReport,
  getAffiliateAvailableMonths,
} from "@/models/conversions-model";
import { AppRoutes } from "@/utils/routes";
import { redirect } from "next/navigation";

export default async function ReportsPage({ searchParams }: any) {
  const { month, year, status, campaignId } = searchParams;
  const user = await getAuthSession();
  const userStatus = user?.user?.status;

  if (userStatus === "pending") {
    return redirect(AppRoutes.auth.pending);
  }

  const { t } = await createTranslation();
  const campaigns = (await getAllCampaigns({ affiliateId: Number(user.user.id) }))?.data?.result || [];
  const months = (await getAffiliateAvailableMonths(user.user.id))?.data || [];

  const dailyData = (
    await getAffiliateDailyReport(user.user.id, { status, campaignId, month, year })
  )?.data || [];
  const monthlyData = (
    await getAffiliateMonthlyReport(user.user.id, { status, campaignId, year })
  )?.data || [];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t("reports.title")}</h1>
      </div>
      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList>
          <TabsTrigger value="daily">{t("reports.daily")}</TabsTrigger>
          <TabsTrigger value="monthly">{t("reports.monthly")}</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          <FilterComponent campaigns={campaigns} showMonth months={months} />
          <ReportsTable data={dailyData} dateLabel={t("reports.table.date")} />
        </TabsContent>
        <TabsContent value="monthly">
          <FilterComponent campaigns={campaigns} showYear showDateRange={false} />
          <ReportsTable data={monthlyData} dateLabel={t("reports.table.month")} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
