"use client";

import React, { useState, useMemo } from "react";
import { Formik, Form } from "formik";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PersonalInformationSchema } from "@/utils/validation";
import { Api } from "@/services/api-services";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n/client";
import { Country, State, City } from "country-state-city";

export default function PersonalInformation({ affiliateUser }: any) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const countries = useMemo(() => {
    return Country.getAllCountries().map((country) => ({
      value: country.isoCode,
      label: country.name,
    }));
  }, []);

  const getStatesByCountry = (countryCode: string) => {
    if (!countryCode) return [];
    return State.getStatesOfCountry(countryCode).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
  };

  const getCitiesByCountryAndState = (
    countryCode: string,
    stateCode: string
  ) => {
    if (!countryCode || !stateCode) return [];
    return City.getCitiesOfState(countryCode, stateCode).map((city) => ({
      value: city.name,
      label: city.name,
    }));
  };

  const initialValues = {
    name: affiliateUser?.name || "",
    email: affiliateUser?.email || "",
    addressLine1: affiliateUser?.address?.address_1 || "",
    addressLine2: affiliateUser?.address?.address_2 || "",
    country: affiliateUser?.address?.country || "",
    state:
      State.getStatesOfCountry(affiliateUser?.address?.country).find(
        (state) => state.name === affiliateUser?.address?.state
      )?.isoCode || "",
    city: affiliateUser?.address?.city || "",
    pincode: affiliateUser?.address?.pincode || "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setIsLoading(true);
    try {
      const data = {
        ...values,
        state: State.getStateByCodeAndCountry(values.state, values.country)
          ?.name,
        id: affiliateUser.id,
      };
      const response = await Api.post({
        path: "/update-profile",
        body: data,
      });

      if (response.status === "success") {
        toast({
          title: t("profile.toast.successTitle"),
          description: t("profile.toast.successMessage"),
        });
      } else {
        toast({
          title: t("profile.toast.errorTitle"),
          description: response.message || t("profile.toast.errorMessage"),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: t("profile.toast.errorTitle"),
        description: error || t("profile.toast.errorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-lg font-medium mb-6">{t("profile.title")}</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize
          validationSchema={PersonalInformationSchema}
        >
          {({
            values,
            handleChange,
            handleBlur,
            touched,
            errors,
            setFieldValue,
          }: any) => {
            const availableStates = getStatesByCountry(values.country);

            const availableCities = getCitiesByCountryAndState(
              values.country,
              values.state
            );

            return (
              <Form className="space-y-4 sm:space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm text-gray-600">
                      {t("profile.fields.name")}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder={t("profile.fields.placeholder.name")}
                      value={values.name}
                      className="bg-white"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.name && errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.toString()}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-gray-600">
                      {t("profile.fields.email")}
                    </Label>
                    <Input
                      id="email"
                      className="bg-slate-100 hover:cursor-not-allowed"
                      disabled
                      value={values.email}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="addressLine1"
                      className="text-sm text-gray-600"
                    >
                      {t("profile.fields.addressLine1")}
                    </Label>
                    <Input
                      id="addressLine1"
                      name="addressLine1"
                      type="text"
                      placeholder={t("profile.fields.placeholder.addressLine1")}
                      value={values.addressLine1}
                      className="bg-white"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.addressLine1 && errors.addressLine1 && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.addressLine1.toString()}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="addressLine2"
                      className="text-sm text-gray-600"
                    >
                      {t("profile.fields.addressLine2")}
                    </Label>
                    <Input
                      id="addressLine2"
                      name="addressLine2"
                      type="text"
                      placeholder={t("profile.fields.placeholder.addressLine2")}
                      value={values.addressLine2}
                      className="bg-white"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.addressLine2 && errors.addressLine2 && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.addressLine2.toString()}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm text-gray-600">
                      {t("profile.fields.country")}
                    </Label>
                    <Select
                      value={values.country}
                      onValueChange={(value) => {
                        setFieldValue("country", value);
                        setFieldValue("state", "");
                        setFieldValue("city", "");
                      }}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue
                          placeholder={t("profile.fields.placeholder.country")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touched.country && errors.country && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.country.toString()}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm text-gray-600">
                      {t("profile.fields.state")}
                    </Label>
                    <Select
                      value={values.state}
                      onValueChange={(value) => {
                        setFieldValue("state", value);
                        setFieldValue("city", "");
                      }}
                      disabled={!values.country || availableStates.length === 0}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue
                          placeholder={t("profile.fields.placeholder.state")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStates.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touched.state && errors.state && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.state.toString()}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm text-gray-600">
                      {t("profile.fields.city")}
                    </Label>
                    <Select
                      value={values.city}
                      onValueChange={(value) => setFieldValue("city", value)}
                      disabled={!values.state || availableCities.length === 0}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue
                          placeholder={t("profile.fields.placeholder.city")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCities.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touched.city && errors.city && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.city.toString()}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-sm text-gray-600">
                      {t("profile.fields.pincode")}
                    </Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="number"
                      placeholder={t("profile.fields.placeholder.pincode")}
                      value={values.pincode}
                      className="bg-white"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                    {touched.pincode && errors.pincode && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.pincode.toString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button
                    className="bg-brand-500 hover:bg-brand-600"
                    isLoading={isLoading}
                    type="submit"
                  >
                    {t("profile.button")}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </CardContent>
    </Card>
  );
}
