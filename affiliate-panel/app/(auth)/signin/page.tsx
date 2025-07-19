"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import AuthLayout from "@/components/layouts/AuthLayout";
import Link from "next/link";
import { useTranslation } from "@/i18n/client";
import { toast } from "@/hooks/use-toast";
import { AppRoutes } from "@/utils/routes";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (values: any) => {
    const result: any = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (result?.error) {
      toast({
        title: t("error"),
        description: t("validation.errorSigningIn"),
      });
    } else {
      toast({
        title: t("success"),
        description: t("validation.signInSuccess"),
      });
      setTimeout(() => {
        console.log("Redirecting to pending page...");
        window.location.href = AppRoutes.auth.pending;
        // router.push(AppRoutes.auth.pending);
      }, 1500);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {t("auth.signIn.title")}
          </h1>
          <p className="text-gray-600 text-sm">
            {t("auth.signIn.description")}
          </p>
        </div>

        <AuthForm type="signin" onSubmit={handleSubmit} />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t("auth.signIn.noAccount")}
            <Link
              href="/signup"
              className="ml-1 text-brand-500 hover:text-brand-600 font-medium hover:underline"
            >
              {t("auth.signIn.signUp")}
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
