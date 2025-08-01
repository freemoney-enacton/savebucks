"use client";

import { Formik } from "formik";
import { useTranslation } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    ...(type === "signup" && {
      name: "",
      promotionMethod: "",
      websiteLink: "",
      estimatedMonthlyLeads: "",
    }),
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
            <>
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

              <div className="space-y-2">
                <Label htmlFor="promotionMethod">
                  {t("auth.signUp.promotionMethod")}
                  <span className="text-red-500"> *</span>
                </Label>
                <Select
                  value={values.promotionMethod}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "promotionMethod", value } })
                  }
                >
                  <SelectTrigger id="promotionMethod">
                    <SelectValue
                      placeholder={t(
                        "auth.signUp.placeholder.promotionMethod"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social_media">
                      {t(
                        "auth.signUp.promotionMethodOptions.socialMedia"
                      )}
                    </SelectItem>
                    <SelectItem value="website">
                      {t("auth.signUp.promotionMethodOptions.website")}
                    </SelectItem>
                    <SelectItem value="youtube">
                      {t("auth.signUp.promotionMethodOptions.youtube")}
                    </SelectItem>
                    <SelectItem value="other">
                      {t("auth.signUp.promotionMethodOptions.other")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {touched.promotionMethod && errors.promotionMethod && (
                  <p className="text-sm text-red-500">
                    {errors.promotionMethod as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteLink">
                  {t("auth.signUp.websiteLink")}
                  <span className="text-red-500"> *</span>
                </Label>
                <Input
                  id="websiteLink"
                  name="websiteLink"
                  type="text"
                  placeholder={t("auth.signUp.placeholder.websiteLink")}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.websiteLink}
                />
                {touched.websiteLink && errors.websiteLink && (
                  <p className="text-sm text-red-500">{errors.websiteLink}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedMonthlyLeads">
                  {t("auth.signUp.estimatedMonthlyLeads")}
                  <span className="text-red-500"> *</span>
                </Label>
                <Select
                  value={values.estimatedMonthlyLeads}
                  onValueChange={(value) =>
                    handleChange({
                      target: { name: "estimatedMonthlyLeads", value },
                    })
                  }
                >
                  <SelectTrigger id="estimatedMonthlyLeads">
                    <SelectValue
                      placeholder={t(
                        "auth.signUp.placeholder.estimatedMonthlyLeads"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-100">
                      {t("auth.signUp.monthlyLeadsOptions.0-100")}
                    </SelectItem>
                    <SelectItem value="100-500">
                      {t("auth.signUp.monthlyLeadsOptions.100-500")}
                    </SelectItem>
                    <SelectItem value="500-1000">
                      {t("auth.signUp.monthlyLeadsOptions.500-1000")}
                    </SelectItem>
                    <SelectItem value="1000+">
                      {t("auth.signUp.monthlyLeadsOptions.1000+")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {touched.estimatedMonthlyLeads && errors.estimatedMonthlyLeads && (
                  <p className="text-sm text-red-500">
                    {errors.estimatedMonthlyLeads as string}
                  </p>
                )}
              </div>
            </>
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
            <div className="flex items-center justify-between gap-0.5">
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
