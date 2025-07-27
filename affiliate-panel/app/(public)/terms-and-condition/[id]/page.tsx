import AuthLayout from "@/components/layouts/AuthLayout";
import { createTranslation } from "@/i18n/server";
import { getCampaignById } from "@/models/campaigns-model";
import { AppRoutes } from "@/utils/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function page({
  params
}: {
  params: { id: string; };
}) {
  const { t } = await createTranslation();
  const campaignId = Number(params.id);
  const campaignDetails = (await getCampaignById(campaignId ?? 1))?.data;
  const termsAndConditions = campaignDetails?.termsAndConditions;

  return (
    <AuthLayout>
      <div className="flex flex-col items-start justify-center w-full p-4 space-y-5 overflow-clip">
        <Link
          href={AppRoutes.dashboard}
          className=" h-14 w-fit flex items-start mx-auto"
        >
          <Image
            src={campaignDetails?.logoUrl || "/images/savebucks-logo.png"}
            alt="Logo"
            height={100}
            width={100}
            className="max-h-12 w-auto"
          />
        </Link>

        <h1 className="text-3xl font-semibold">
          {t("campaign.termsAndConditions")}
        </h1>

        <div
          className="text-md text-gray-500 overflow-clip break-all"
          dangerouslySetInnerHTML={{
            __html: termsAndConditions || t("campaign.termsFallbackDescription"),
          }}
        ></div>
      </div>
    </AuthLayout>
  );
}
