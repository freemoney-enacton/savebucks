"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import moment from "moment";
import { useTranslation } from "@/i18n/client";

const getDateFromParams = (param: string): Date | undefined => {
  const date = new Date(param);
  return isNaN(date.getTime()) ? undefined : date;
};

export default function DateFilter() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const searchParams = new URLSearchParams(params);

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const currentDate = new Date();
  const defaultFromDate = subDays(currentDate, 30);

  const fromDate = fromParam ? getDateFromParams(fromParam) : defaultFromDate;
  const toDate = toParam ? getDateFromParams(toParam) : currentDate;

  const [date, setDate] = useState<DateRange | undefined>({
    from: fromDate,
    to: toDate,
  });

  useEffect(() => {
    searchParams.set("from", moment(defaultFromDate).format("YYYY-MM-DD"));
    searchParams.set("to", moment(currentDate).format("YYYY-MM-DD"));
    router.push(`${pathname}?${searchParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-2">
      <div className={cn("grid gap-2")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "h-11 w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>{t("filters.placeholder")}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(e) => {
                setDate(e);
                searchParams.set("from", moment(e?.from).format("YYYY-MM-DD"));
                searchParams.set("to", moment(e?.to).format("YYYY-MM-DD"));
                router.push(`${pathname}?${searchParams.toString()}`);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
