import { UAParser } from "ua-parser-js";
import { headers } from "next/headers";
import { generateClickCode } from "@/utils/generateClickCode";
import {
  getAffiliateLinkBySlug,
  updateAffiliateLinkStats,
} from "@/models/affiliate-link-model";
import { insertClick } from "@/models/clicks-model";
import { NewClick } from "@/db/schema";
import { redirect } from "next/navigation";
import AuthLayout from "@/components/layouts/AuthLayout";
import Link from "next/link";
import Image from "next/image";
import { AppRoutes } from "@/utils/routes";
import { createTranslation } from "@/i18n/server";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sub1?: string; sub2?: string; sub3?: string };
}) {
  const { t } = await createTranslation();
  const { slug } = params;
  const { sub1, sub2, sub3 } = searchParams;
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const parser = new UAParser(userAgent);
  const deviceType = parser.getDevice().type;
  const deviceInfo = parser.getResult();
  const clickCode = generateClickCode();
  const ipAddress =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    headersList.get("cf-connecting-ip") ||
    "Unknown";

  const affiliateLink = (await getAffiliateLinkBySlug(slug))?.data;
  if (!affiliateLink) {
    // console.log(ipAddress);
    return <p>Affiliate link not found for slug: {slug}</p>;
  }
  if (affiliateLink.status === "inactive") {
    return (
      <AuthLayout>
        <div className="flex flex-col items-start justify-center min-h-screen w-full p-4 space-y-5 overflow-clip">
          <Link
            href={AppRoutes.dashboard}
            className="lg:hidden h-14 w-fit flex items-start mx-auto"
          >
            <Image
              src={"/images/savebucks-logo.png"}
              alt="Logo"
              height={100}
              width={100}
              className="max-h-12 w-auto"
            />
          </Link>

          <h1 className="text-3xl font-medium">{t("linkNotActive")}</h1>
        </div>
      </AuthLayout>
    );
  }

  const data: NewClick = {
    campaignId: 1,
    affiliateId: affiliateLink.affiliateId,
    affiliateLinkId: affiliateLink.id,
    clickCode,
    userAgent,
    ipAddress,
    deviceType: deviceType || "desktop",
    sub1: sub1 || affiliateLink.sub1 || "",
    sub2: sub2 || affiliateLink.sub2 || "",
    sub3: sub3 || affiliateLink.sub3 || "",
    isConverted: false,
    clickedAt: new Date().toISOString(),
  };

  const result = await insertClick(data);
  const newClickCount = affiliateLink.totalClicks + 1;
  const updateClicks = await updateAffiliateLinkStats(
    affiliateLink.id,
    newClickCount
  );

  if (deviceType === "mobile" || deviceType === "tablet") {
    redirect(
      `https://savebucks.onelink.me/qwcj/influencerId?click_code=${clickCode}&source=affiliate`
    );
  } else {
    redirect(
      `https://my.savebucks.app/?click_code=${clickCode}&source=affiliate`
    );
  }

  return (
    <div>
      <p>Slug: {slug}</p>
      <p>Sub1: {sub1}</p>
      <p>Sub2: {sub2}</p>
      <p>Sub3: {sub3}</p>
      <p>Device Type: {deviceType}</p>
      <h3>Full Device Info (JSON)</h3>
      <pre>{JSON.stringify(deviceInfo, null, 2)}</pre>
      <h3>Click Code</h3>
      <p>{clickCode}</p>
    </div>
  );
}
