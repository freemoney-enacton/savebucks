import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MailWarning } from "lucide-react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { createTranslation } from "@/i18n/server";
import { getAffiliateStatus } from "@/models/affiliates-model";
import { getAuthSession } from "@/models/auth-models";
import { redirect } from "next/navigation";
import { AppRoutes } from "@/utils/routes";
import Image from "next/image";
import Link from "next/link";

export default async function PendingPage() {
  const session = await getAuthSession();
  const { t } = await createTranslation();
  const status = (await getAffiliateStatus(session.user.email as string)).data
    ?.status;
  const emailVerified = (await getAffiliateStatus(session.user.email as string))
    .data?.emailVerified;

  if (status === "approved" && emailVerified) {
    return redirect(AppRoutes.dashboard);
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {emailVerified === false ? (
          <div>
            <Card className="border-0 shadow-none">
              <CardHeader className="!p-0">
                <div className="flex items-center justify-center mb-4">
                  <MailWarning className="h-12 w-12 text-yellow-500" />
                </div>
                <CardTitle className="text-center text-xl">
                  {t("auth.pending.email_title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center !p-0">
                <p className="text-gray-600">
                  Thank you for signing up on Savebucks Affiliate Portal. Your account is in pending status. You will be able to access your account once the admin approves your account
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-0 shadow-none">
            <CardHeader className="!p-0">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-center text-xl">
                {t("auth.pending.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center !p-0">
              <p className="text-gray-600">
                {t("auth.pending.message")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthLayout>
  );
}
