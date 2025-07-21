import { createTranslation } from "@/i18n/server";
import {
  getAffiliateByEmail,
  insertAffiliate,
} from "@/models/affiliates-model";
import {
  insertAffiliateCampaigns,
  getDefaultCampaigns,
} from "@/models/affiliate-campaign-model";
import { commonResponse } from "@/utils/response-format";
import { SignUpSchema } from "@/utils/validation";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { Config } from "@/utils/config";
import { sendEmailToAffiliate } from "@/services/email-service";
import { generateVerificationToken } from "@/utils/generateVerificationToken";

export async function POST(request: NextRequest) {
  const { t } = await createTranslation();
  try {
    const body = await request.json();

    await SignUpSchema.validate(body, {
      abortEarly: false,
      strict: true,
    });

    const { name, email, password } = body;

    const existingUser = await getAffiliateByEmail(email.toLowerCase());
    if (existingUser.data) {
      return commonResponse({
        data: null,
        status: "error",
        message: t("auth.signUp.emailAlreadyExists"),
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const token = generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      token,
      tokenExpiry,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

  const newAffiliate = await insertAffiliate(newUser);
  if (newAffiliate.status === "error") {
    return commonResponse({
      data: newAffiliate,
      status: "error",
      message: t("auth.signUp.errorCreatingUser"),
    });
  }

  const defaultCampaigns = await getDefaultCampaigns();
  if (defaultCampaigns.status === "success" && defaultCampaigns.data.length > 0) {
    const records = defaultCampaigns.data.map((c: any) => ({
      affiliateId: newAffiliate.data.id,
      campaignId: c.id,
      status: "approved",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await insertAffiliateCampaigns(records);
  }

    const verificationLink = `${Config.env.app.app_url}/verify-email/${token}?userId=${newAffiliate.data.id}`;

    try {
      const result = await sendEmailToAffiliate({
        type: "verify",
        userId: newAffiliate.data.id,
        verificationLink: verificationLink,
      });
    } catch (error) {
      return commonResponse({
        data: error,
        status: "error",
        message: t("auth.signUp.errorSendingVerificationEmail"),
      });
    }

    return commonResponse({
      data: newAffiliate.data,
      status: "success",
      message: t("auth.signUp.userCreatedSuccessfully"),
    });
  } catch (error) {
    return commonResponse({
      data: error,
      status: "error",
      message: t("auth.signUp.invalidData"),
    });
  }
}
