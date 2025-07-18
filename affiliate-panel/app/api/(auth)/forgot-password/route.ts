import { createTranslation } from "@/i18n/server";
import { getAffiliateByEmail } from "@/models/affiliates-model";
import { sendEmailToAffiliate } from "@/services/email-service";
import { Config } from "@/utils/config";
import { commonResponse } from "@/utils/response-format";
import { NextRequest } from "next/server";
import { generateVerificationToken } from "@/utils/generateVerificationToken";
import { db } from "@/db";
import { affiliates } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const { t } = await createTranslation();
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return commonResponse({
        data: null,
        status: "error",
        message: t("validation.emailRequired"),
      });
    }

    const affiliate = await getAffiliateByEmail(email);

    if (!affiliate.data) {
      return commonResponse({
        data: null,
        status: "error",
        message: t("validation.emailDoesNotExist"),
      });
    }
    const token = generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db
      .update(affiliates)
      .set({ token, tokenExpiry })
      .where(eq(affiliates.email, email));

    const verificationLink = `${Config.env.app.app_url}/reset-password/${token}?userId=${affiliate.data.id}`;

    const result = await sendEmailToAffiliate({
      type: "reset_password",
      user_email: email,
      verificationLink,
    });
    return commonResponse({
      data: "",
      status: "success",
      message: t("emailSent"),
    });
  } catch (error) {
    return commonResponse({
      data: error,
      status: "error",
      message: t("somethingWentWrong"),
    });
  }
}
