import { createTranslation } from "@/i18n/server";
import { updateAffiliatePassword } from "@/models/affiliates-model";
import { commonResponse } from "@/utils/response-format";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { t } = await createTranslation();
  try {
    const body = await request.json();

    const { id, newPassword, confirmPassword } = body;

    if (newPassword !== confirmPassword) {
      return commonResponse({
        data: null,
        status: "error",
        message: t("validation.passwordNotMatch"),
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const result = await updateAffiliatePassword(id, hashedPassword);

    if (result.status === "error") {
      return commonResponse({
        data: result.data,
        status: "error",
        message: t("validation.errorChangingPassword"),
      });
    }

    return commonResponse({
      data: result.data?.id,
      status: "success",
      message: t("passwordChanged"),
    });
  } catch (error) {
    return commonResponse({
      data: error,
      status: "error",
      message: t("validation.invalidData"),
    });
  }
}
