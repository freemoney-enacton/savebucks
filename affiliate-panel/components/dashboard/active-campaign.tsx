import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createTranslation } from "@/i18n/server";
import { getAffiliateCampaignGoalsByCampaignId } from "@/models/affiliate-campaign-goal-model";
import { getAuthSession } from "@/models/auth-models";
import { getCampaignGoalsByCampaignId } from "@/models/campaign-goal-model";
import { CampaignCard } from "./CampaignCard";

export async function ActiveCampaign({
  campaigns,
}: {
  campaigns: any[];
}) {
  const { t } = await createTranslation();
  const user = await getAuthSession();

  // Process each campaign to get their goals
  const campaignWithGoals: any = [];

  if (campaigns) {
    for (const campaign of campaigns) {
      const campaignGoals =
        (await getCampaignGoalsByCampaignId(campaign.id || 1)).data || [];

      const affiliateCampaignGoals =
        (
          await getAffiliateCampaignGoalsByCampaignId(
            campaign.id,
            user.user.id
          )
        ).data || [];

      const finalGoals = campaignGoals
        .filter((goal) => goal.status === "active")
        .map((goal) => {
          const affiliateGoal = affiliateCampaignGoals.find(
            (affiliate) => affiliate.campaignGoalId == goal.id
          );

          return {
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

      campaignWithGoals.push({
        ...campaign,
        goals: finalGoals,
      });
    }
  }

  return (
    <Card className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader className="border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("campaign.activeCampaign")}
        </h2>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {campaignWithGoals.length > 0 ? (
          campaignWithGoals.map((campaign: any, index: any) => (
            <CampaignCard key={campaign.id || index} campaign={campaign} />
          ))
        ) : (
          <p className="text-center text-gray-500">
            {t("campaign.noActiveCampaigns")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

