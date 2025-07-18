import { createTranslation } from "@/i18n/server";
import {
  getAffiliateById,
  updateAffiliatePassword,
} from "@/models/affiliates-model";
import { commonResponse } from "@/utils/response-format";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { t } = await createTranslation();
  try {
    const body = await request.json();

    const { id, currentPassword, newPassword, confirmPassword } = body;

    const userPassword = (await getAffiliateById(Number(id)))?.data?.password;
    if (!userPassword)
      return commonResponse({
        data: null,
        status: "error",
        message: t("validation.invalidData"),
      });

    const isValid = await bcrypt.compare(currentPassword, userPassword);

    if (!isValid) {
      return commonResponse({
        data: null,
        status: "error",
        message: t("validation.invalidPassword"),
      });
    }

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
