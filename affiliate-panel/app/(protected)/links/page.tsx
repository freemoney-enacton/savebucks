import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ActiveCampaign } from "@/components/dashboard/active-campaign";
import LinksTable from "@/components/links/LinksTable";
import { getAuthSession } from "@/models/auth-models";
import { getAffiliateLinksByAffiliateId } from "@/models/affiliate-link-model";
import { getAllCampaigns, getCampaignById } from "@/models/campaigns-model";
import { createTranslation } from "@/i18n/server";
import { AppRoutes } from "@/utils/routes";
import { redirect } from "next/navigation";

export default async function LinksPage({ searchParams }: any) {
  const { from, to, rows_per_page, page, campaignId } = searchParams;
  const { t } = await createTranslation();
  const user = await getAuthSession();
  const userStatus = user?.user?.status;

  if (userStatus === "pending") {
    return redirect(AppRoutes.auth.pending);
  }
  const campaignDetails = (
    await getAllCampaigns({ affiliateId: Number(user.user.id) })
  )?.data;
  const campaigns = campaignDetails ? campaignDetails?.result : null;
  const data =
    (
      await getAffiliateLinksByAffiliateId(user.user.id, {
        from,
        to,
        rows_per_page,
        page,
        campaignId,
      })
    )?.data || [];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t("links.title")}</h1>
      </div>

      <ActiveCampaign campaigns={campaigns || []} />

      <LinksTable data={data} campaignId={campaignId} />
    </DashboardLayout>
  );
}
