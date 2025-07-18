import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTranslation } from "@/i18n/server";
import {
  getAffiliateById,
  verifyAffiliateEmail,
} from "@/models/affiliates-model";
import { getAuthSession } from "@/models/auth-models";
import { sendEmailToAffiliate } from "@/services/email-service";
import { AppRoutes } from "@/utils/routes";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function page({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { userId?: string };
}) {
  const { token } = params;
  const { userId } = searchParams;
  const { t } = await createTranslation();

  if (!userId || !token) {
    return redirect(AppRoutes.auth.signIn);
  }

  const affiliate = (await getAffiliateById(Number(userId)))?.data;

  if (!affiliate || affiliate.token !== token) {
    return redirect(AppRoutes.auth.signIn);
  }

  const verifyUserEmail = await verifyAffiliateEmail(Number(userId));

  if (verifyUserEmail.status === "error") {
    return redirect(AppRoutes.auth.signIn);
  }

  // const res = await sendEmailToAffiliate({
  //   type: "welcome",
  //   userId: userId,
  // });

  return (
    <>
      <AuthLayout>
        <div className="space-y-6">
          <div>
            <Card className="w-full shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle className="text-center text-xl">
                  {t("auth.verify_email.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  {t("auth.verify_email.description")}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link
              href={AppRoutes.auth.signIn}
              className="text-sm hover:underline text-brand-500 font-medium"
            >
              {t("auth.verify_email.backToSignIn")}
            </Link>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
