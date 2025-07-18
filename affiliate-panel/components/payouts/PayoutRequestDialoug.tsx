"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Api } from "@/services/api-services";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/client";
import { useState } from "react";
import { getCurrencySymbol } from "@/utils/getCurrency";

export function PayoutRequest({ open, setOpen, amount, type, minAmount }: any) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const user = useSession().data?.user;
  const router = useRouter();

  const handleRequest = async (amount: number) => {
    setLoading(true);
    try {
      // if (amount < minAmount) {
      //   toast({
      //     variant: "destructive",
      //     title: t("error"),
      //     description: t("payouts.minAmountError")
      //       .replace("{amount}", minAmount)
      //       .replace("{currency}", getCurrencySymbol()),
      //   });
      //   return;
      // }

      const data = {
        id: user?.id,
        amount,
        type,
      };
      const response = await Api.post({ path: "/payout-request", body: data });
      if (response.status === "error") {
        toast({
          variant: "destructive",
          title: t("payouts.errorTitle"),
          description: response.message || t("payouts.errorMessage"),
        });
        return;
      }
      toast({
        title: t("payouts.successTitle"),
        description: t("payouts.successMessage"),
      });
      router.refresh();
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("payouts.errorTitle"),
        description: t("payouts.errorMessage"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("payouts.payout_title")}</DialogTitle>
        </DialogHeader>

        <div>
          <h3>{t("payouts.confirmation")}</h3>
          <h5>
            {t("payouts.amountText")
              .replace("{amount}", amount)
              .replace("{currency}", getCurrencySymbol())}
          </h5>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="text-black"
          >
            {t("payouts.cancel")}
          </Button>
          <Button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600"
            onClick={() => handleRequest(amount)}
            isLoading={loading}
            disabled={loading}
          >
            {t("payouts.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
