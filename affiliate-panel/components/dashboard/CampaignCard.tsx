"use client";

import { getCurrencySymbol } from "@/utils/getCurrency";
import {
  ArrowUpRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CampaignWithGoals } from "./active-campaign";
import { useTranslation } from "@/i18n/client";

export function CampaignCard({ campaign }: { campaign: CampaignWithGoals }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="bg-brand-50 rounded-xl p-6 border border-brand-200">
      <div className="flex flex-wrap items-start gap-4 sm:gap-3">
        <div className="flex-1 min-w-[200px] flex flex-col xl:flex-row justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center xl:items-start gap-3">
              <div className="flex-shrink-0 h-10 sm:h-14 w-16 sm:w-24">
                <Image
                  src={campaign.logoUrl || "/images/savebucks-logo.png"}
                  width={100}
                  height={100}
                  alt="Campaign"
                  className="max-h-10 sm:max-h-14 w-auto"
                />
              </div>

              <div className="space-y-2 flex-1">
                <h4 className="text-lg font-semibold text-gray-900">
                  {campaign.name || t("campaign.fallbackTitle")}
                </h4>
                <p className="text-sm text-gray-500">
                  {campaign.description || t("campaign.fallbackDescription")}
                </p>
                <div>
                  <Link
                    href={
                      campaign.termsAndConditionsUrl || "/terms-and-condition"
                    }
                    target="_blank"
                  >
                    <span className="text-sm font-medium text-blue-500 hover:underline">
                      {t("campaign.termsAndConditions")}
                      <ArrowUpRight className="inline-block h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Campaign Details Collapsible Section */}
            <div className="mt-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {t("campaign.details")}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200">
                  <div
                    className="text-sm text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html:
                        campaign.description ||
                        t("campaign.fallbackDescription"),
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 w-full xl:max-w-[250px]">
            <h3 className="text-base font-semibold text-gray-900">
              {t("campaign.goals")}
            </h3>
            <div className="space-y-3 mt-2">
              {campaign.goals.map((goal, goalIndex) => (
                <div key={goalIndex} className="flex items-center gap-2">
                  <CheckCircle className="shrink-0 h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">{goal.name}</span>
                  <span className="text-sm font-semibold text-gray-900 ml-auto">
                    {getCurrencySymbol() +
                      t("campaign.earn").replace(
                        "{amount}",
                        String(goal.amount ?? 0)
                      )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
