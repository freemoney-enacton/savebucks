"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Form, Formik } from "formik";
import { postbackSchema } from "@/utils/validation";
import { Api } from "@/services/api-services";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/i18n/client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Textarea from "../ui/Textarea";

export default function ConfigurePostback({
  goals,
  campaigns,
  selectedCampaignId,
}: any) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useSession().data?.user;

  const initialValues = {
    postbackType: "",
    globalUrl: "",
    selectedGoal: "",
    goalUrl: "",
    methodType: undefined,
  };

  const handleCampaignChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("campaignId", value);
    } else {
      params.delete("campaignId");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      setSubmitting(true);
      const data = {
        affiliateId: user?.id,
        campaignId: selectedCampaignId,
        campaignGoalId:
          values.postbackType === "goal"
            ? goals?.find((g: any) => g.name === values.selectedGoal).id
            : null,
        postbackUrl:
          values.postbackType === "goal" ? values.goalUrl : values.globalUrl,
        methodType: values.methodType,
      };
      const response = await Api.post({ path: "/postback", body: data });
      if (response.status === "error") {
        toast({
          variant: "destructive",
          title: t("postback.toast.errorTitle"),
          description: response.message || t("postback.toast.errorMessage"),
        });
        return;
      }
      toast({
        title: t("postback.toast.successTitle"),
        description: t("postback.toast.successMessage"),
      });
      router.refresh();
      resetForm();
    } catch (error) {
      console.error("Error saving postback:", error);
      toast({
        variant: "destructive",
        title: t("postback.toast.errorTitle"),
        description: t("postback.toast.errorMessage"),
      });
    } finally {
      resetForm();
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-lg font-medium mb-6">{t("postback.title")}</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={postbackSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className="space-y-4 sm:space-y-6">
              {values.postbackType === "goal" && (
                <div className="mb-6">
                  <Label htmlFor="campaign" className="text-sm text-gray-600">
                    {t("campaign.selectCampaign")}
                  </Label>
                  <Select
                    value={String(selectedCampaignId)}
                    onValueChange={handleCampaignChange}
                  >
                    <SelectTrigger className="bg-white mt-1">
                      <SelectValue
                        placeholder={t("campaign.selectPlaceholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns.map((c: any) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="postbackType"
                    className="text-sm text-gray-600"
                  >
                    {t("postback.selectType")}
                  </Label>
                  <Select
                    value={values.postbackType}
                    onValueChange={(value) => {
                      setFieldValue("postbackType", value);
                      setFieldValue("globalUrl", "");
                      setFieldValue("selectedGoal", "");
                      setFieldValue("goalUrl", "");
                    }}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue
                        placeholder={t("postback.placeholderOption")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">
                        {t("postback.type.global")}
                      </SelectItem>
                      <SelectItem value="goal">
                        {t("postback.type.goal")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.postbackType && touched.postbackType && (
                    <p className="text-sm text-red-600">
                      {errors.postbackType}
                    </p>
                  )}
                </div>

                {values.postbackType === "global" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="globalUrl"
                      className="text-sm text-gray-600"
                    >
                      {t("postback.globalUrl.label")}
                    </Label>
                    <Input
                      id="globalUrl"
                      name="globalUrl"
                      value={values.globalUrl}
                      onChange={(e) =>
                        setFieldValue("globalUrl", e.target.value)
                      }
                      placeholder={t("postback.globalUrl.placeholder")}
                      className="bg-white"
                    />
                    {errors.globalUrl && touched.globalUrl && (
                      <p className="text-sm text-red-600">{errors.globalUrl}</p>
                    )}
                  </div>
                )}

                {values.postbackType === "goal" && (
                  <>
                    <div className="space-y-2">
                      <Label
                        htmlFor="selectedGoal"
                        className="text-sm text-gray-600"
                      >
                        {t("postback.goal.label")}
                      </Label>
                      {goals.length === 0 ? (
                        <p className="text-sm text-gray-600">
                          {t("postback.noCampaignGoals")}
                        </p>
                      ) : (
                        <Select
                          value={values.selectedGoal}
                          onValueChange={(value) => {
                            setFieldValue("selectedGoal", value);
                            setFieldValue("goalUrl", "");
                          }}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue
                              placeholder={t("postback.goal.placeholder")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {goals.map((goal: any) => (
                              <SelectItem
                                key={goal.id}
                                value={goal?.name || ""}
                              >
                                {goal?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {errors.selectedGoal && touched.selectedGoal && (
                        <p className="text-sm text-red-600">
                          {errors.selectedGoal}
                        </p>
                      )}
                    </div>

                    {values.selectedGoal && (
                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <Label
                          htmlFor="goalUrl"
                          className="text-sm text-gray-600"
                        >
                          {t("postback.goal.urlLabel")}
                        </Label>
                        <Textarea
                          id="goalUrl"
                          value={values.goalUrl}
                          onChange={(e) =>
                            setFieldValue("goalUrl", e.target.value)
                          }
                          placeholder={t("postback.goal.urlPlaceholder")}
                          className="bg-white"
                          cols={7}
                        />
                        {errors.goalUrl && touched.goalUrl && (
                          <p className="text-sm text-red-600">
                            {errors.goalUrl}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {values.postbackType !== "" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="methodType"
                      className="text-sm text-gray-600"
                    >
                      {t("postback.methodType.label")}
                    </Label>
                    <Select
                      value={values.methodType}
                      onValueChange={(value) =>
                        setFieldValue("methodType", value)
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue
                          placeholder={t("postback.methodType.placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">
                          {t("postback.methodType.get")}
                        </SelectItem>
                        <SelectItem value="POST">
                          {t("postback.methodType.post")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.methodType && touched.methodType && (
                      <p className="text-sm text-red-600">
                        {errors.methodType}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-500 hover:bg-brand-600"
                >
                  {isSubmitting
                    ? t("postback.button.saving")
                    : t("postback.button.save")}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
