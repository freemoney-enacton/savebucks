"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useTranslation } from "@/i18n/client";

const getDateFromParams = (param: string): Date | undefined => {
  const date = new Date(param);
  return isNaN(date.getTime()) ? undefined : date;
};

export default function FilterComponent({
  campaigns = [],
  showMonth = false,
  showYear = false,
  months = [],
  showDateRange = true,
}: {
  campaigns?: any[];
  showMonth?: boolean;
  showYear?: boolean;
  months?: { month: number; year: number }[];
  showDateRange?: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const searchParams = new URLSearchParams(params);
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaignFilter, setCampaignFilter] = useState(
    searchParams.get("campaignId") || "all"
  );

  const [monthFilter, setMonthFilter] = useState(
    searchParams.get("month") && searchParams.get("year")
      ? `${searchParams.get("month")}-${searchParams.get("year")}`
      : "all"
  );
  const [yearFilter, setYearFilter] = useState(searchParams.get("year") || "all");

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
    if (showDateRange) {
      searchParams.set("from", moment(defaultFromDate).format("YYYY-MM-DD"));
      searchParams.set("to", moment(currentDate).format("YYYY-MM-DD"));
      router.push(`${pathname}?${searchParams.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all" && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters =
    statusFilter !== "all" ||
    campaignFilter !== "all" ||
    (showDateRange && date?.from && date?.to) ||
    (showMonth && monthFilter !== "all") ||
    (showYear && yearFilter !== "all");

  const clearFilters = () => {
    setStatusFilter("all");
    setCampaignFilter("all");
    setDate(undefined);
    setMonthFilter("all");
    setYearFilter("all");
    router.push(pathname);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t("filters.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 sm:space-y-6">
          <div
            className={cn(
              "grid gap-4",
              (() => {
                const cols =
                  2 + (showMonth ? 1 : 0) + (showYear ? 1 : 0) + (showDateRange ? 1 : 0);
                return `md:grid-cols-${Math.min(cols, 4)}`;
              })()
            )}
          >
            <div className="space-y-2">
              <Label>{t("filters.status.label")}</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  updateSearchParams("status", value);
                }}
              >
                <SelectTrigger className="w-[140px]s w-full">
                  <SelectValue placeholder={t("filters.status.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.status.all")}</SelectItem>
                  <SelectItem value="approved">
                    {t("filters.status.approved")}
                  </SelectItem>
                  <SelectItem value="pending">
                    {t("filters.status.pending")}
                  </SelectItem>
                  <SelectItem value="declined">
                    {t("filters.status.declined")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("filters.campaign.label")}</Label>
              <Select
                value={campaignFilter}
                onValueChange={(value) => {
                  setCampaignFilter(value);
                  updateSearchParams("campaignId", value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("filters.campaign.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("filters.campaign.all")}
                  </SelectItem>
                  {campaigns.map((c) => (
                    <SelectItem key={c.id} value={`${c.id}`}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showMonth && (
              <div className="space-y-2">
                <Label>{t("filters.month.label")}</Label>
                <Select
                  value={monthFilter}
                  onValueChange={(value) => {
                    setMonthFilter(value);
                    if (value === "all") {
                      updateSearchParams("month", "");
                      updateSearchParams("year", "");
                    } else {
                      const [m, y] = value.split("-");
                      updateSearchParams("month", m);
                      updateSearchParams("year", y);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("filters.month.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("filters.month.all")}
                    </SelectItem>
                    {months.map((m) => (
                      <SelectItem
                        key={`${m.month}-${m.year}`}
                        value={`${m.month}-${m.year}`}
                      >
                        {moment(`${m.year}-${String(m.month).padStart(2, "0")}-01`).format("MMMM - YYYY")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {showYear && (
              <div className="space-y-2">
                <Label>{t("filters.year.label")}</Label>
                <Select
                  value={yearFilter}
                  onValueChange={(value) => {
                    setYearFilter(value);
                    updateSearchParams("year", value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("filters.year.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("filters.year.all")}
                    </SelectItem>
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <SelectItem key={year} value={`${year}`}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}

            {showDateRange && (
              <div className="space-y-2">
                <Label>{t("filters.dateRange")}</Label>
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
                          searchParams.set(
                            "from",
                            moment(e?.from).format("YYYY-MM-DD")
                          );
                          searchParams.set(
                            "to",
                            moment(e?.to).format("YYYY-MM-DD")
                          );
                          router.push(`${pathname}?${searchParams.toString()}`);
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              className="ml-auto self-start md:self-end"
            >
              <X className="mr-2 h-4 w-4" />
              {t("filters.clear")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
