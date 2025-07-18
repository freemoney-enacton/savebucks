"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n/client";
import { Api } from "@/services/api-services";
import { Config } from "@/utils/config";
import { AffiliateLinkSchema } from "@/utils/validation";
import { Formik } from "formik";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateAffiliateLink() {
  const { t } = useTranslation();
  const user = useSession().data?.user;
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const mainUrl = `${Config.env.app.app_url}/l`;

  const initialValues = {
    link: "",
    name: "",
    sub1: "",
    sub2: "",
    sub3: "",
  };

  const buildDestinationUrl = (mainUrl: any, values: any) => {
    const url = new URL(`${mainUrl}/${values.link}`);

    if (values.sub1) url.searchParams.set("subId1", values.sub1);
    if (values.sub2) url.searchParams.set("subId2", values.sub2);
    if (values.sub3) url.searchParams.set("subId3", values.sub3);

    return url.toString();
  };

  const onSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      setIsLoading(true);
      const data = {
        campaignId: 1,
        affiliateId: Number(user?.id || 1),
        name: values.name,
        slug: values.link,
        destinationUrl: buildDestinationUrl(mainUrl, values),
        sub1: values.sub1 || null,
        sub2: values.sub2 || null,
        sub3: values.sub3 || null,
        totalClicks: 0,
        totalEarnings: 0,
        status: "active",
      };
      const response = await Api.post({
        path: "/links/insert-link",
        body: data,
      });
      if (response.status === "error") {
        toast({
          title: t("error"),
          description: response.message || t("validation.unknownError"),
          variant: "destructive",
        });
        return;
      }
      toast({
        title: t("validation.linkCreated"),
        description: t("validation.linkCreatedDescription"),
      });
      resetForm();
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        className="bg-brand-500 hover:bg-brand-600 max-w-sm px-3 w-auto gap-2 m-0 max-sm:ml-auto"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        {t("affiliateLink.create")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("affiliateLink.dialogTitle")}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {t("affiliateLink.dialogDescription")}
            </p>
          </DialogHeader>

          <Formik
            initialValues={initialValues}
            validationSchema={AffiliateLinkSchema}
            onSubmit={onSubmit}
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="link">
                    {t("affiliateLink.urlLabel")}
                    <span className="text-red-500"> *</span>
                  </Label>
                  <div className="relative w-full">
                    <span
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none select-none"
                      style={{ userSelect: "none" }}
                    >
                      {mainUrl}/
                    </span>
                    <Input
                      id="link"
                      name="link"
                      type="text"
                      placeholder={t("affiliateLink.urlPlaceholder")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.link}
                      className="pl-[calc( (100%) / 3 )] pr-3"
                      style={{ paddingLeft: `${mainUrl.length - 5}ch` }}
                    />
                  </div>
                  {touched.link && errors.link && (
                    <p className="text-sm text-red-500">{errors.link}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    {t("affiliateLink.nameLabel")}
                    <span className="text-red-500"> *</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={t("affiliateLink.namePlaceholder")}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  {touched.name && errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub1">{t("affiliateLink.sub1Label")}</Label>
                  <Input
                    id="sub1"
                    name="sub1"
                    type="text"
                    placeholder={t("affiliateLink.sub1Placeholder")}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.sub1}
                  />
                  {touched.sub1 && errors.sub1 && (
                    <p className="text-sm text-red-500">{errors.sub1}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub2">{t("affiliateLink.sub2Label")}</Label>
                  <Input
                    id="sub2"
                    name="sub2"
                    type="text"
                    placeholder={t("affiliateLink.sub2Placeholder")}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.sub2}
                  />
                  {touched.sub2 && errors.sub2 && (
                    <p className="text-sm text-red-500">{errors.sub2}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub3">{t("affiliateLink.sub3Label")}</Label>
                  <Input
                    id="sub3"
                    name="sub3"
                    type="text"
                    placeholder={t("affiliateLink.sub3Placeholder")}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.sub3}
                  />
                  {touched.sub3 && errors.sub3 && (
                    <p className="text-sm text-red-500">{errors.sub3}</p>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="text-black"
                    disabled={isSubmitting || isLoading}
                  >
                    {t("affiliateLink.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand-500 text-white hover:bg-brand-700"
                    disabled={isSubmitting || isLoading}
                    isLoading={isLoading}
                  >
                    {isLoading
                      ? t("affiliateLink.creating")
                      : t("affiliateLink.save")}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
}
