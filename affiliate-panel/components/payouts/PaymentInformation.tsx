"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useTranslation } from "@/i18n/client";
import { Api } from "@/services/api-services";
import { BankDetailsSchema, PayPalSchema } from "@/utils/validation";
import { Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PayoutRequest } from "./PayoutRequestDialoug";

export default function PaymentInformation({
  paymentInfo,
  amount,
  minAmount,
}: any) {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useSession().data?.user;
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [bankLoading, setBankLoading] = useState(false);
  const [currentPaymentInfo, setCurrentPaymentInfo] = useState(
    paymentInfo ?? {}
  );
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");

  useEffect(() => {
    setCurrentPaymentInfo(paymentInfo);
  }, [paymentInfo]);

  const paypalInitialValues = {
    paypalId: currentPaymentInfo?.paypalId || "",
  };

  const bankInitialValues = {
    bankName: currentPaymentInfo?.bankInfo?.bank_name || "",
    accountNumber: currentPaymentInfo?.bankInfo?.bank_account_no || "",
    ifscBicCode: currentPaymentInfo?.bankInfo?.bank_ifsc_bic_code || "",
    accountHolderName:
      currentPaymentInfo?.bankInfo?.bank_account_holder_name || "",
    accountType: currentPaymentInfo?.bankInfo?.bank_account_type || "",
    swiftCode: currentPaymentInfo?.bankInfo?.bank_swift_code || "",
  };

  const handlePaypalSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      setPaypalLoading(true);
      const data = {
        ...values,
        id: user?.id,
      };
      const response = await Api.post({ path: "/update-paypal", body: data });
      if (response.status === "error") {
        toast({
          variant: "destructive",
          title: t("error"),
          description: response.message || t("somethingWentWrong"),
        });
      } else {
        toast({
          title: t("success"),
          description: t("payouts.paypalUpdated"),
        });
      }
      router.refresh();
    } catch (error) {
      console.error("PayPal form submission error:", error);
    } finally {
      setPaypalLoading(false);
      setSubmitting(false);
    }
  };

  const handleBankDetailsSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      setBankLoading(true);
      const data = {
        bankDetails: { ...values },
        id: user?.id,
      };
      const response = await Api.post({
        path: "/update-bank-details",
        body: data,
      });
      if (response.status === "error") {
        toast({
          variant: "destructive",
          title: t("error"),
          description: response.message || t("somethingWentWrong"),
        });
      } else {
        toast({
          title: t("success"),
          description: t("payouts.bankDetailsUpdated"),
        });
      }
      // resetForm();
      router.refresh();
    } catch (error) {
      console.error("Bank details form submission error:", error);
    } finally {
      setBankLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* PayPal */}

      {/* <Card className="bg-white">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-medium text-gray-800">
            {t("payouts.paypalTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className=" p-4 sm:p-6">
          <Formik
            initialValues={paypalInitialValues}
            validationSchema={PayPalSchema}
            onSubmit={handlePaypalSubmit}
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="paypalId">
                    {t("payouts.paypalId")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex flex-col lg:flex-row space-x-3 mt-2">
                    <div className="flex-1">
                      <Input
                        id="paypalId"
                        name="paypalId"
                        type="text"
                        placeholder={t("payouts.paypalPlaceholder")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.paypalId}
                      />
                      {touched.paypalId && errors.paypalId && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.paypalId as any}
                        </p>
                      )}
                    </div>

                    <div className="flex items-end gap-2 justify-end mt-3 lg:mt-0">
                      <Button
                        type="submit"
                        className="bg-brand-600 hover:bg-brand-700 text-white px-6 min-w-[120px] h-full"
                        disabled={isSubmitting || paypalLoading}
                        isLoading={paypalLoading}
                      >
                        {t("payouts.paypalSave")}
                      </Button>
                      {paypalInitialValues.paypalId && (
                        <Button
                          className={`bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm max-w-md h-full ${
                            amount <= 0 ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => {
                            setOpen(true);
                            setType("paypal");
                          }}
                          disabled={amount <= 0}
                          type="button"
                        >
                          {t("earnings.withdraw")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card> */}

      <Card className="bg-white">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {t("payouts.bankTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Formik
            initialValues={bankInitialValues}
            validationSchema={BankDetailsSchema}
            onSubmit={handleBankDetailsSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="text-sm font-medium text-gray-700">
                      {t("payouts.bankName")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      type="text"
                      placeholder={t("payouts.bankNamePlaceholder")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.bankName}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {touched.bankName && errors.bankName && (
                      <p className="text-sm text-red-500">
                        {errors.bankName as any}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">
                      {t("payouts.accountHolderName")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="accountHolderName"
                      name="accountHolderName"
                      type="text"
                      placeholder={t("payouts.accountHolderNamePlaceholder")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.accountHolderName}
                    />
                    {touched.accountHolderName && errors.accountHolderName && (
                      <p className="text-sm text-red-500">
                        {errors.accountHolderName as any}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">
                      {t("payouts.accountNumber")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      type="text"
                      placeholder={t("payouts.accountNumberPlaceholder")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.accountNumber}
                    />
                    {touched.accountNumber && errors.accountNumber && (
                      <p className="text-sm text-red-500">
                        {errors.accountNumber as any}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ifscBicCode">
                      {t("payouts.ifsc")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ifscBicCode"
                      name="ifscBicCode"
                      type="text"
                      placeholder={t("payouts.ifscPlaceholder")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.ifscBicCode}
                      style={{ textTransform: "uppercase" }}
                    />
                    {touched.ifscBicCode && errors.ifscBicCode && (
                      <p className="text-sm text-red-500">
                        {errors.ifscBicCode as any}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountType">
                      {t("payouts.accountType")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={values.accountType}
                      onValueChange={(value) =>
                        setFieldValue("accountType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("payouts.accountTypePlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="savings">Savings Account</SelectItem>
                        <SelectItem value="current">Current Account</SelectItem>
                        <SelectItem value="checking">
                          Checking Account
                        </SelectItem>
                        <SelectItem value="business">
                          Business Account
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {touched.accountType && errors.accountType && (
                      <p className="text-sm text-red-500">
                        {errors.accountType as any}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="swiftCode">{t("payouts.swift")}</Label>
                    <Input
                      id="swiftCode"
                      name="swiftCode"
                      type="text"
                      placeholder={t("payouts.swiftPlaceholder")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.swiftCode}
                      style={{ textTransform: "uppercase" }}
                    />
                    {touched.swiftCode && errors.swiftCode && (
                      <p className="text-sm text-red-500">
                        {errors.swiftCode as any}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="submit"
                    className="text-white px-8 min-w-[140px] bg-brand-500 hover:bg-brand-600 rounded-lg"
                    disabled={isSubmitting || bankLoading}
                    isLoading={bankLoading}
                  >
                    {t("payouts.bankSave")}
                  </Button>
                  {bankInitialValues.accountNumber && (
                    <Button
                      className={`bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm max-w-md h-auto ${
                        amount <= 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => {
                        setOpen(true);
                        setType("bank");
                      }}
                      disabled={amount <= 0}
                      type="button"
                    >
                      {t("earnings.withdraw")}
                    </Button>
                  )}
                </div>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
      <PayoutRequest
        open={open}
        setOpen={setOpen}
        amount={amount}
        type={type}
        minAmount={minAmount}
      />
    </div>
  );
}
