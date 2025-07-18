import { createTranslation } from "@/i18n/server";
import { updateAffiliatePaypalId } from "@/models/affiliates-model";
import { commonResponse } from "@/utils/response-format";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { t } = await createTranslation();
  try {
    const body = await request.json();

    const { id, paypalId } = body;

    const result = await updateAffiliatePaypalId(id, paypalId);

    if (result.status === "error") {
      return commonResponse({
        data: result.data,
        status: "error",
        message: t("payments.errorUpdatingPaypal"),
      });
    }

    return commonResponse({
      data: result.data?.id,
      status: "success",
      message: t("payments.paypalUpdated"),
    });
  } catch (error) {
    return commonResponse({
      data: error,
      status: "error",
      message: t("payments.invalidData"),
    });
  }
}
