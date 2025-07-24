"use client";

import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n/client";
import { Api } from "@/services/api-services";
import { AppRoutes } from "@/utils/routes";
import { ResetPasswordSchema } from "@/utils/validation";
import { Form, Formik } from "formik";
import { KeyRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordPage({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    setError("");
    try {
      if (values.newPassword !== values.confirmPassword) {
        toast({
          title: t("error"),
          description: t("password.toast.errorMismatch"),
          variant: "destructive",
        });
        return;
      }

      const data = {
        id,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      }

      const response = await Api.post({
        path: AppRoutes.auth.reset_password,
        body: data,
      });

      if (response.status === "success") {
        toast({
          title: t("success"),
          description: response.message,
        });
        setSuccess(true);
      } else {
        toast({
          variant: "destructive",
          title: t("error"),
          description: response.message,
        });
      }
    } catch (error) {
      setError("An error occurred while resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div>
          {/* <Link
            href={AppRoutes.dashboard}
            className="lg:hidden h-14 w-fit flex items-start mx-auto"
          >
            <Image
              src="/images/savebucks-logo.png"
              alt="Logo"
              height={100}
              width={100}
              className="max-h-12 w-auto"
            />
          </Link> */}

          <div className="flex-1 flex items-center justify-center">
            <Card className="border-0 shadow-none">
              <CardHeader className="!p-0">
                <div className="flex items-center justify-center mb-4">
                  <KeyRound className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle className="text-center">
                  {t("password.toast.successMessage")}
                </CardTitle>
              </CardHeader>
              <CardContent className="!p-0">
                <p className="text-center text-muted-foreground">
                  {t("password.change_success_description")}
                </p>
              </CardContent>
            </Card>
          </div>

          <Link
            href={AppRoutes.auth.signIn}
            className="text-sm hover:underline text-brand-500 font-semibold"
          >
            {t("auth.forgotPassword.backToSignIn")}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div>
        {/* <Link
          href={AppRoutes.dashboard}
          className="absolute top-6 left-1/2 transform -translate-x-1/2"
        >
          <Image
            src="/images/savebucks-logo.png"
            alt="Logo"
            height={100}
            width={100}
            className="max-h-12 w-auto"
          />
        </Link> */}

        <div className="flex-1 flex items-center justify-center">
          <Card className="border-0 shadow-none">
            <CardHeader className="!p-0">
              <div className="flex items-center justify-center mb-4">
                <KeyRound className="h-12 w-12 text-brand-500" />
              </div>
              <CardTitle className="text-center">
                {t("password.reset_password")}
              </CardTitle>
            </CardHeader>
            <CardContent className="!p-0">
              <p className="text-center text-muted-foreground mb-6">
                {t("password.reset_password_description")}
              </p>

              <Formik
                initialValues={{ newPassword: "", confirmPassword: "" }}
                validationSchema={ResetPasswordSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur }) => (
                  <Form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">
                        {t("password.fields.new")}
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={values.newPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={t("password.fields.placeholder.new")}
                        />
                      </div>
                      {errors.newPassword && touched.newPassword && (
                        <p className="text-sm text-red-500">
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        {t("password.fields.confirm")}
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={t("password.fields.placeholder.confirm")}
                        />
                      </div>
                      {errors.confirmPassword && touched.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 text-center">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                      isLoading={isLoading}
                    >
                      {isLoading ? "Resetting Password..." : "Reset Password"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </div>

        <Link
          href={AppRoutes.auth.signIn}
          className="text-sm hover:underline text-brand-500 font-semibold"
        >
          {t("auth.forgotPassword.backToSignIn")}
        </Link>
      </div>
    </AuthLayout>
  );
}
