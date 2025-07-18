"use client";

import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ChangePasswordSchema } from "@/utils/validation";
import { Form, Formik } from "formik";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Api } from "@/services/api-services";
import { useState } from "react";
import { useTranslation } from "@/i18n/client";

export default function PasswordChange({ affiliateUser }: any) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const userPassword = affiliateUser?.password || "";

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: any
  ) => {
    setSubmitting(true);
    setIsLoading(true);

    try {
      if (values.newPassword !== values.confirmPassword) {
        toast({
          title: t("password.toast.errorTitle"),
          description: t("password.toast.errorMismatch"),
          variant: "destructive",
        });
        return;
      }

      const data = {
        ...values,
        id: affiliateUser.id,
      };
      const response = await Api.post({ path: "/change-password", body: data });

      if (response.status === "success") {
        toast({
          title: t("password.toast.successTitle"),
          description: t("password.toast.successMessage"),
        });
      } else {
        toast({
          title: t("password.toast.errorTitle"),
          description:
            response.data?.message || t("password.toast.errorGeneric"),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: t("password.toast.errorTitle"),
        description: error || t("password.toast.errorGeneric"),
        variant: "destructive",
      });
    } finally {
      resetForm();
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-lg font-medium mb-6">{t("password.title")}</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize
          validationSchema={ChangePasswordSchema}
        >
          {({ values, handleChange, handleBlur, touched, errors }) => (
            <Form className="space-y-4 sm:space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-sm text-gray-600"
                  >
                    {t("password.fields.current")}
                  </Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder={t("password.fields.placeholder.current")}
                    className="bg-white pr-10"
                    value={values.currentPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.currentPassword && errors.currentPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-sm text-gray-600"
                  >
                    {t("password.fields.new")}
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder={t("password.fields.placeholder.new")}
                    className="bg-white pr-10"
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.newPassword && errors.newPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm text-gray-600"
                  >
                    {t("password.fields.confirm")}
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder={t("password.fields.placeholder.confirm")}
                    className="bg-white pr-10"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600"
                  isLoading={isLoading}
                >
                  {t("password.button")}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
