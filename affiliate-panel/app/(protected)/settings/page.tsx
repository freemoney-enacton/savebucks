import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import ConfigurePostback from "@/components/settings/ConfigurePostback";
import PasswordChange from "@/components/settings/PasswordChange";
import PersonalInformation from "@/components/settings/PersonalInformation";
import PostbacksTable from "@/components/settings/PostbackTable";
import { Card, CardContent } from "@/components/ui/card";
import { createTranslation } from "@/i18n/server";
import { getAffiliateCampaignGoalsByCampaignId } from "@/models/affiliate-campaign-goal-model";
import { getAffiliatePostbacksByAffiliate } from "@/models/affiliate-postback-model";
import { getAffiliateByEmail } from "@/models/affiliates-model";
import { getAuthSession } from "@/models/auth-models";
import { getCampaignGoalsByCampaignId } from "@/models/campaign-goal-model";
import { getAllCampaigns } from "@/models/campaigns-model";
import { AppRoutes } from "@/utils/routes";
import { redirect } from "next/navigation";

export default async function SettingsPage({ searchParams }: any) {
  const user = await getAuthSession();
  const userStatus = user?.user?.status;

  if (userStatus === "pending") {
    return redirect(AppRoutes.auth.pending);
  }
  const { t } = await createTranslation();
  const { from, to, rows_per_page, page, campaignId } = searchParams;
  if (!user) {
    return redirect(AppRoutes.auth.signIn);
  }

  const affiliate = (await getAffiliateByEmail(user.user.email as string))?.data;

  const campaignData = (
    await getAllCampaigns({
      filters: { status: "active" },
      affiliateId: Number(user.user.id),
    })
  )?.data;
  const campaigns = campaignData ? campaignData.result : [];
  const selectedCampaignId = searchParams.campaignId
    ? parseInt(searchParams.campaignId)
    : campaigns[0]?.id || 0;

  const campaignGoals = (await getCampaignGoalsByCampaignId(selectedCampaignId))
    .data || [];

  const affiliateCampaignGoals =
    (await getAffiliateCampaignGoalsByCampaignId(selectedCampaignId, user.user.id))
      .data || [];

  const finalGoals = campaignGoals
    .filter((goal) => goal.status === "active")
    .map((goal) => {
      const affiliateGoal = affiliateCampaignGoals.find(
        (affiliate) => affiliate.campaignGoalId == goal.id
      );

      return {
        id: goal.id,
        name: goal.name,
        amount: affiliateGoal
          ? affiliateGoal.customCommissionRate
          : goal.commissionAmount,
        qualificationAmount:
          affiliateGoal && affiliateGoal.qualificationAmount !== null
            ? affiliateGoal.qualificationAmount
            : goal.qualificationAmount,
      };
    });

  const postbacks = (
    await getAffiliatePostbacksByAffiliate(affiliate?.id || 0, {
      from,
      to,
      rows_per_page,
      page,
      campaignId,
    })
  ).data;

  return (
    <DashboardLayout>
      <div className="mx-auto space-y-8">
        <h1 className="text-2xl font-semibold">{t("settings.title")}</h1>

        {/* Personal Information */}
        <PersonalInformation affiliateUser={affiliate} />

        {/* Change Password */}
        <PasswordChange affiliateUser={affiliate} />

        {/* Configure Postback */}
        <ConfigurePostback
          goals={finalGoals}
          campaigns={campaigns}
          selectedCampaignId={selectedCampaignId}
        />

        <PostbacksTable data={postbacks} campaignId={campaignId} />

        {/* Postback Documentation */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg font-medium mb-4">Postback Documentation</h2>
            <p className="text-sm text-gray-600 mb-4">
              To get a list of all surveys, please call the following URL:
            </p>
            <div className="bg-gray-50 p-3 rounded text-xs font-mono mb-6 break-all">
              https://your-api-endpoint.com/api/get-data?campaign_id=
              {`{campaign_id}`}
              &campaign_goal_id={`{campaign_goal_id}`}
              &affiliate_link_id={`{affiliate_link_id}`}
              &link_name={`{link_name}`}
              &goal_name={`{goal_name}`}
              &transaction_id={`{transaction_id}`}
              &click_code={`{click_code}`}
              &conversion_id={`{conversion_id}`}
              &subId1={`{subId1}`}
              &subId2={`{subId2}`}
              &subId3={`{subId3}`}
              &commission_value={`{commission_value}`}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b last:border-0">
                    <th className="text-left py-2 text-gray-600 font-medium">
                      Parameter
                    </th>
                    <th className="text-left py-2 text-gray-600 font-medium min-w-[200px]">
                      Description
                    </th>
                    <th className="text-left py-2 text-gray-600 font-medium">
                      Mandatory
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-600 space-y-2">
                  <tr className="border-b last:border-0">
                    <td className="py-3 px-3 font-mono">campaign_id</td>
                    <td className="py-3 px-3">
                      The ID for the specific campaign. You must submit this
                      with each request to identify the campaign.
                    </td>
                    <td className="py-3 px-3">Mandatory</td>
                  </tr>
                  <tr className="border-b last:border-0">
                    <td className="py-3 px-3 font-mono">campaign_goal_id</td>
                    <td className="py-3 px-3">
                      The ID for the specific campaign goal. This should match
                      the campaign&apos;s defined goal.
                    </td>
                    <td className="py-3 px-3">Optional</td>
                  </tr>
                  <tr className="border-b last:border-0">
                    <td className="py-3 px-3 font-mono">affiliate_link_id</td>
                    <td className="py-3 px-3">
                      The affiliate link ID for tracking the specific link
                      clicked by the user.
                    </td>
                    <td className="py-3 px-3">Mandatory</td>
                  </tr>
                  <tr className="border-b last:border-0">
                    <td className="py-3 px-3 font-mono">link_name</td>
                    <td className="py-3 px-3">
                      The name of the link associated with the campaign. This is
                      used to track the link’s performance.
                    </td>
                    <td className="py-3 px-3">Optional</td>
                  </tr>
                  <tr className="border-b last:border-0">
                    <td className="py-3 px-3 font-mono">goal_name</td>
                    <td className="py-3 px-3">
                      The name of the specific goal within the campaign. This is
                      used to track goal-specific performance.
                    </td>
                    <td className="py-3 px-3">Optional</td>
                  </tr>
                  <tr className="border-b last:border-0">
                    <td className="py-3 px-3 font-mono">transaction_id</td>
                    <td className="py-3 px-3">
                      The unique identifier for the transaction associated with
                      the campaign.
                    </td>
                    <td className="py-3 px-3">Mandatory</td>
                  </tr>
                  <tr className="border-b last:border-0">
                    <td className="py-3 px-3 font-mono">click_code</td>
                    <td className="py-3 px-3">
                      A unique identifier for each click. This is used to track
                      the user&apos;s click event.
                    </td>
                    <td className="py-3 px-3">Mandatory</td>
                  </tr>
                  <tr className="border-b last:border-0">
                    <td className="py-3 px-3 font-mono">conversion_id</td>
                    <td className="py-3 px-3">
                      A unique identifier for the conversion event, used for
                      conversion tracking.
                    </td>
                    <td className="py-3 px-3">Mandatory</td>
                  </tr>
                  <tr className="border-b last:border-0">
                    <td className="py-3 px-3 font-mono">subId1</td>
                    <td className="py-3 px-3">
                      An optional custom parameter for additional tracking
                      purposes.
                    </td>
                    <td className="py-3 px-3">Optional</td>
                  </tr>
                  <tr className="border-b last:border-0">
                    <td className="py-3 px-3 font-mono">subId2</td>
                    <td className="py-3 px-3">
                      An optional custom parameter for additional tracking
                      purposes.
                    </td>
                    <td className="py-3 px-3">Optional</td>
                  </tr>
                  <tr className="border-b last:border-0">
                    <td className="py-3 px-3 font-mono">subId3</td>
                    <td className="py-3 px-3">
                      An optional custom parameter for additional tracking
                      purposes.
                    </td>
                    <td className="py-3 px-3">Optional</td>
                  </tr>
                  <tr className="border-b last:border-0">
                    <td className="py-3 px-3 font-mono">commission_value</td>
                    <td className="py-3 px-3">
                      The commission value associated with the conversion.
                    </td>
                    <td className="py-3 px-3">Mandatory</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
