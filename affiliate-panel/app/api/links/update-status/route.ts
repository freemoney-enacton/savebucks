import { createTranslation } from "@/i18n/server";
import { updateAffiliateLinkStatus } from "@/models/affiliate-link-model";
import { commonResponse } from "@/utils/response-format";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { t } = await createTranslation();
  try {
    const body = await request.json();

    const { id, status } = body;

    const result = await updateAffiliateLinkStatus(id, status);

    if (result.status === "error") {
      return commonResponse({
        data: result.data,
        status: "error",
        message: t("affiliateLink.errorUpdatingLink"),
      });
    }

    return commonResponse({
      data: result.data,
      status: "success",
      message: t("affiliateLink.linkStatusUpdated"),
    });
  } catch (error) {
    return commonResponse({
      data: error,
      status: "error",
      message: t("affiliateLink.invalidData"),
    });
  }
}
