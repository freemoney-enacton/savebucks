// @ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Colors } from 'chart.js';
import { useTranslation } from 'react-i18next';
import { config } from '@/config';
import { useUtils } from '@/Hook/use-utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Colors);

export default function LineChart({ data, showTooltipValueAsCurrency = true, tooltipLabel }: any) {
  const { t } = useTranslation();
  const { getCurrencyString } = useUtils();
  const [computedTickColor, setComputedTickColor] = useState('#000000'); // Default fallback

  useEffect(() => {
    // Get the computed value of the CSS variable
    const color = getComputedStyle(document.documentElement).getPropertyValue('--body_text_secondary').trim();
    setComputedTickColor(color);
  }, []); // Empty dependency array means this runs once on mount
  return (
    <div className="max-h-[400px]">
      <Line
        className={'w-full'}
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                title: (context) => {
                  const label = context[0].label || '';
                  return label;
                },
                label: (context) => {
                  const label = tooltipLabel + ':';
                  const value = showTooltipValueAsCurrency ? getCurrencyString(context.parsed.y) : context.parsed.y;
                  return `${label} ${value}`;
                },
              },
            },
          },
          animation: { easing: 'linear' },
          tension: 0.4,
          pointRadius: 7, // Increase point radius to make dots larger
          pointHoverRadius: 8, // Larger radius on hover
          pointBorderColor: 'rgba(0, 0, 0, 0)', // Optionally set to transparent
          pointBorderWidth: 10,
          borderWidth: 4.5,
          responsive: true,
          maintainAspectRatio: false,
          backgroundColor: '#D9D9D9',
          borderColor: (context) => {
            const ctx = context.chart.ctx;
            const chartArea = context.chart.chartArea;
            if (!chartArea) {
              // This is important to check because sometimes the chart area might not be initialized yet
              return null;
            }
            const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
            gradient.addColorStop(0.0029, 'rgba(213, 71, 142, 1)'); // #D5478E at approx 0.29%
            gradient.addColorStop(0.4992, 'rgba(112, 8, 210, 1)'); // #7008D2 at approx 49.92%
            gradient.addColorStop(0.9954, 'rgba(67, 125, 219, 1)'); // #437DDB at approx 99.54%
            return gradient;
          },

          scales: {
            x: {
              ticks: {
                color: computedTickColor,
              },
              grid: {
                display: true,
              },
            },
            y: {
              ticks: {
                color: computedTickColor,
              },
              grid: {
                display: true,
              },
            },
          },
          responsive: true,
        }}
        data={data}
      />
    </div>
  );
}
