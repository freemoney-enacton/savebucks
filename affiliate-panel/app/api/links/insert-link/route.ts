import { createTranslation } from "@/i18n/server";
import {
  getAffiliateLinkBySlug,
  insertAffiliateLink,
} from "@/models/affiliate-link-model";
import { commonResponse } from "@/utils/response-format";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { t } = await createTranslation();
  try {
    const body = await request.json();

    const existingAffiliateLink = (await getAffiliateLinkBySlug(body.slug))
      ?.data;

    if (existingAffiliateLink) {
      return commonResponse({
        data: "",
        status: "error",
        message: t("affiliateLink.linkAlreadyExists"),
      });
    }

    const data = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await insertAffiliateLink(data);

    if (result.status === "error") {
      return commonResponse({
        data: result.data,
        status: "error",
        message: t("affiliateLink.errorCreatingLink"),
      });
    }

    return commonResponse({
      data: result.data?.id,
      status: "success",
      message: t("affiliateLink.linkCreated"),
    });
  } catch (error) {
    return commonResponse({
      data: error,
      status: "error",
      message: t("affiliateLink.invalidData"),
    });
  }
}
