"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "@/i18n/client";
import DateFilter from "../DateFilter";

interface EarningsData {
  day: string;
  amount: number;
  date: string;
  fullDate: string;
}

interface EarningsChartProps {
  earningsData: EarningsData[];
  grouping: "day" | "week" | "month";
  dateRange: {
    from: string;
    to: string;
  };
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{data.fullDate}</p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Amount: </span>$
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function EarningsChart({
  earningsData,
  grouping,
  dateRange,
}: EarningsChartProps) {
  const { t } = useTranslation();

  const maxValue = Math.max(...earningsData.map((item) => item.amount));
  const adjustedMaxValue = maxValue === 0 ? 100 : maxValue + maxValue * 0.1;
  const getOptimalTickCount = () => {
    if (earningsData.length <= 7) return 5;
    if (earningsData.length <= 14) return 6;
    if (earningsData.length <= 31) return 8;
    return 10;
  };

  const numberOfTicks = getOptimalTickCount();
  const tickInterval = adjustedMaxValue / (numberOfTicks - 1);
  const ticks = Array.from({ length: numberOfTicks }, (_, i) =>
    Math.round(i * tickInterval)
  );

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  const getLabelAngle = () => {
    if (earningsData.length > 20) return -45;
    if (earningsData.length > 10) return -30;
    return 0;
  };

  return (
    <Card className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader className="border-b border-gray-100 mb-3 flex flex-row justify-between">
        <div className="flex items-center">
          <CardTitle className="text-lg font-semibold text-gray-900">{t("earnings.chartTitle")}</CardTitle>
        </div>
        <DateFilter />
      </CardHeader>
      <CardContent className="mt-5 p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={earningsData}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: getLabelAngle() !== 0 ? 60 : 20,
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B50A7B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#B50A7B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.2}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  // angle: getLabelAngle(),
                  textAnchor: getLabelAngle() !== 0 ? "end" : "middle",
                }}
                height={getLabelAngle() !== 0 ? 80 : 40}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, adjustedMaxValue]}
                ticks={ticks}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#B50A7B"
                fillOpacity={1}
                fill="url(#colorValue)"
                strokeWidth={2}
                dot={{ fill: "#B50A7B", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#B50A7B", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}