"use client";

import AuthForm from "@/components/AuthForm";
import AuthLayout from "@/components/layouts/AuthLayout";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n/client";
import { Api } from "@/services/api-services";
import { sendEmailToAffiliate } from "@/services/email-service";
import { AppRoutes } from "@/utils/routes";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (values: any) => {
    const result = await Api.post({
      path: "/forgot-password",
      body: values,
    });
    if (!result || result.status === "error") {
      toast({
        variant: "destructive",
        title: t("error"),
        description: result?.message || t("validation.invalidData"),
      });
      return;
    }
    toast({
      title: t("success"),
      description: t("emailSent"),
    });

    setTimeout(() => {
      router.push(AppRoutes.auth.signIn);
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {t("auth.forgotPassword.title")}
          </h1>
          <p className="text-gray-600 text-sm">
            {t("auth.forgotPassword.description")}
          </p>
        </div>

        <AuthForm type="forgot-password" onSubmit={handleSubmit} />

        <div className="text-center">
          <Link
            href="/signin"
            className="inline-flex items-center text-sm text-brand-500 hover:text-brand-600 font-medium hover:underline"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            {t("auth.forgotPassword.backToSignIn")}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
