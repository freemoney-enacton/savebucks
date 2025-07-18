import { Config } from "@/utils/config";
import { commonResponse } from "@/utils/response-format";
import { createTranslation } from "@/i18n/server";

export async function sendEmailToAffiliate({
  type,
  userId,
  user_id,
  user_email,
  verificationLink,
  payout_id,
}: {
  type: "verify" | "payout_request" | "welcome" | "reset_password";
  userId?: string;
  user_id?: string;
  user_email?: string;
  verificationLink?: string;
  payout_id?: string;
}) {
  const { t } = await createTranslation();
  try {
    const queryParams = new URLSearchParams({ type });

    if (userId) queryParams.append("userId", userId);
    if (user_id) queryParams.append("user_id", user_id);
    if (verificationLink)
      queryParams.append("verificationLink", verificationLink);
    if (payout_id) queryParams.append("payout_id", payout_id);
    if (user_email) queryParams.append("user_email", user_email);

    const url = `${
      Config.env.app.admin_url
    }/send-mail-to-affiliate?${queryParams.toString()}`;

    const emailResponse = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!emailResponse.ok) {
      return commonResponse({
        data: emailResponse,
        status: "error",
        message: getErrorMessage(type, t),
      });
    }

    return commonResponse({
      data: emailResponse,
      status: "success",
      message: getSuccessMessage(type, t),
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return commonResponse({
      data: null,
      status: "error",
      message: getErrorMessage(type, t),
    });
  }
}

function getErrorMessage(
  type: "verify" | "payout_request" | "welcome" | "reset_password",
  t: any
) {
  const errorMessages = {
    verify: t
      ? t("auth.signUp.errorSendingVerificationEmail")
      : "Error sending verification email",
    payout_request: t
      ? t("auth.signUp.errorSendingPayoutEmail")
      : "Error sending payout email",
    welcome: t
      ? t("auth.signUp.errorSendingWelcomeEmail")
      : "Error sending welcome email",
    reset_password: t
      ? t("auth.signUp.errorSendingResetPasswordEmail")
      : "Error sending reset password email",
  };

  return errorMessages[type] || t("errorSendingEmail") || "Error sending email";
}

function getSuccessMessage(
  type: "verify" | "payout_request" | "welcome" | "reset_password",
  t: any
) {
  const successMessages = {
    verify: t
      ? t("auth.signUp.verificationEmailSent")
      : "Verification email sent successfully",
    payout_request: t
      ? t("payouts.emailSent")
      : "Payout email sent successfully",
    welcome: t
      ? t("auth.signUp.welcomeEmailSent")
      : "Welcome email sent successfully",
    reset_password: t
      ? t("auth.signUp.resetPasswordEmailSent")
      : "Reset password email sent successfully",
  };

  return (
    successMessages[type] || (t ? t("emailSent") : "Email sent successfully")
  );
}
