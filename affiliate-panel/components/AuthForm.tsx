"use client";

import { Formik } from "formik";
import { useTranslation } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  ForgotPasswordSchema,
  SignInSchema,
  SignUpSchema,
} from "@/utils/validation";
import { useState } from "react";

interface AuthFormProps {
  type: "signin" | "signup" | "forgot-password";
  onSubmit: (values: any) => void | Promise<void>;
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    ...(type === "signup" && { name: "" }),
    email: "",
    password: "",
    ...(type === "signin" && { remember: false }),
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={
        type === "signup"
          ? SignUpSchema
          : type === "signin"
          ? SignInSchema
          : ForgotPasswordSchema
      }
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setIsLoading(true);
          await onSubmit(values);
        } catch (error) {
          console.error("Form submission error:", error);
        } finally {
          setIsLoading(false);
          setSubmitting(false);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {type === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">
                {t("auth.signUp.name")}
                <span className="text-red-500"> *</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={t("auth.placeholder.name")}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />
              {touched.name && errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">
              {t(`auth.${type === "signin" ? "signIn" : "signUp"}.email`)}
              <span className="text-red-500"> *</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("auth.placeholder.email")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            {touched.email && errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {type !== "forgot-password" && (
            <div className="space-y-2">
              <Label htmlFor="password">
                {t(`auth.${type === "signin" ? "signIn" : "signUp"}.password`)}
                <span className="text-red-500"> *</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t("auth.placeholder.password")}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {touched.password && errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          )}
          {type === "signin" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  checked={values.remember}
                />
                <Label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600"
                >
                  {t("auth.signIn.rememberMe")}
                </Label>
              </div>

              <Link
                href="/forgot-password"
                className="text-sm text-brand-500 hover:underline hover:text-brand-600"
              >
                {t("auth.signIn.forgotPassword")}
              </Link>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-brand-500 text-white hover:bg-brand-600 rounded-lg"
            disabled={isSubmitting || isLoading}
            isLoading={isLoading}
          >
            {t(
              `auth.${
                type === "signin"
                  ? "signIn"
                  : type === "signup"
                  ? "signUp"
                  : "forgotPassword"
              }.submit`
            )}
          </Button>
        </form>
      )}
    </Formik>
  );
}
