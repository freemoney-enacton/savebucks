import { createTranslation } from "@/i18n/server";
import { getAllCampaigns } from "@/models/campaigns-model";
import { getAuthSession } from "@/models/auth-models";
import { commonResponse } from "@/utils/response-format";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { t } = await createTranslation();
  try {
    const session = await getAuthSession();
    const result = await getAllCampaigns({
      filters: { status: "active" },
      affiliateId: session?.user?.id ? Number(session.user.id) : undefined,
    });
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
