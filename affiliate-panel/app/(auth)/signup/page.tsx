"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/client";
import AuthForm from "@/components/AuthForm";
import AuthLayout from "@/components/layouts/AuthLayout";
import Link from "next/link";
import { AppRoutes } from "@/utils/routes";
import { Api } from "@/services/api-services";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (values: any) => {
    try {
      const result = await Api.post({ path: "/sign-up", body: values });
      if (!result || result.status === "error") {
        toast({
          title: t("validation.errorCreatingUser"),
          description: result?.message || t("validation.invalidData"),
        });
        return;
      }
      toast({
        title: t("validation.userCreatedSuccessfully"),
        description: t("validation.checkEmailForVerification"),
      });

      await signIn("credentials", {
        email: values.email,
        password: values.password,
      });
      setTimeout(() => {
        window.location.href = AppRoutes.auth.pending;
      }, 1500);
    } catch (error) {
      console.error("Error during sign up:", error);
      toast({
        title: t("validation.errorCreatingUser"),
        description: t("validation.invalidData"),
      });
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {t("auth.signUp.title")}
          </h1>
          <p className="text-gray-600 text-sm">
            {t("auth.signUp.description")}
          </p>
        </div>

        <AuthForm type="signup" onSubmit={handleSubmit} />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t("auth.signUp.haveAccount")}
            <Link
              href="/signin"
              className="ml-1 text-brand-500 hover:text-brand-600 font-medium hover:underline"
            >
              {t("auth.signUp.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
