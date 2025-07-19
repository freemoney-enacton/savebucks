import { createTranslation } from "@/i18n/server";
import { getAllCampaigns } from "@/models/campaigns-model";
import { commonResponse } from "@/utils/response-format";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { t } = await createTranslation();
  try {
    const result = await getAllCampaigns({ filters: { status: "active" } });
    return commonResponse({
      data: result.data?.result || [],
      status: "success",
      message: "ok",
    });
  } catch (error) {
    return commonResponse({
      data: null,
      status: "error",
      message: t("somethingWentWrong"),
    });
  }
}
