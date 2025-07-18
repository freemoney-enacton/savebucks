"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Database, CreditCard, Clock, Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { PayoutRequest } from "./PayoutRequestDialoug";
import { useTranslation } from "@/i18n/client";
import { getCurrencySymbol } from "@/utils/getCurrency";

export default function EarningCards({ earningsData }: any) {
  const { t } = useTranslation();

  const cards = [
    {
      icon: Database,
      label: t("earnings.total"),
      amount: earningsData.totalEarnings,
      color: "blue",
      bgColor: "bg-blue-100",
    },
    {
      icon: CreditCard,
      label: t("earnings.paid"),
      amount: earningsData.paidEarnings,
      color: "cyan",
      bgColor: "bg-cyan-100",
    },
    {
      icon: Clock,
      label: t("earnings.pending"),
      amount: earningsData.pendingEarnings,
      color: "orange",
      bgColor: "bg-orange-100",
    },
    {
      icon: Wallet,
      label: t("earnings.available"),
      amount: earningsData.availableAmount,
      color: "green",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(({ icon: Icon, label, amount, color, bgColor }) => (
        <Card key={label} className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-start space-y-3">
              <div className={`p-3 ${bgColor} rounded-xl`}>
                <Icon className={`h-5 w-5 text-${color}-600`} />
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
                  <p className={`text-2xl font-bold text-gray-900`}>
                    {getCurrencySymbol() + Number(amount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
