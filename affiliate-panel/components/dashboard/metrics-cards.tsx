import { Card, CardContent } from "@/components/ui/card";
import { getAffiliateLinksByAffiliateId } from "@/models/affiliate-link-model";
import { getAuthSession } from "@/models/auth-models";
import { getClicksByAffiliateId } from "@/models/clicks-model";
import { getConversionStatsForAffiliate } from "@/models/conversions-model";
import { LightbulbIcon, Link, DollarSign } from "lucide-react";
import { createTranslation } from "@/i18n/server";
import { getCurrencySymbol } from "@/utils/getCurrency";

export async function MetricsCards() {
  const { t } = await createTranslation();
  const user = await getAuthSession();
  const userAllClicks = (await getClicksByAffiliateId(user.user.id))?.data;
  const userAllLinks = (await getAffiliateLinksByAffiliateId(user.user.id))
    ?.data;
  const userAllEarnings = (await getConversionStatsForAffiliate(user.user.id))
    ?.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <MetricCard
        title={t("metrics.totalClicks")}
        value={userAllClicks?.totalClicks?.toLocaleString() || "0"}
        icon={<LightbulbIcon className="h-6 w-6 text-brand-500" />}
      />
      <MetricCard
        title={t("metrics.totalLinks")}
        value={userAllLinks?.countResult?.toLocaleString() || "0"}
        icon={<Link className="h-6 w-6 text-brand-500" />}
      />
      <MetricCard
        title={t("metrics.totalEarnings")}
        value={
          getCurrencySymbol() +
            userAllEarnings?.totalCommission?.toLocaleString() || "0"
        }
        icon={<DollarSign className="h-6 w-6 text-brand-500" />}
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardContent className="px-6 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="bg-brand-50 p-3 rounded-xl">{icon}</div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
