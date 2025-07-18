<?php

namespace App\Filament\Widgets;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Filament\Widgets\ChartWidget;
use Illuminate\Contracts\Support\Htmlable;

class CtrTrendChart extends ChartWidget
{
    protected static ?string $heading = 'Click/Transaction Trends';

    // Optional: Use this if you want more dynamic/custom heading handling
    public function getHeading(): string | Htmlable | null
    {
        return 'Click/Transaction Trends';
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getData(): array
    {
        // Generate last 7 days (Y-m-d) format
        $dates = collect(range(0, 6))->map(function ($days) {
            return Carbon::now()->subDays($days)->format('Y-m-d');
        })->reverse();

        // Fetch click counts from 'clicks' table
        $clicks = DB::table('clicks')
            ->selectRaw('DATE(click_time) as cdate, COUNT(*) as click_count')
            ->whereRaw('DATE(click_time) >= ?', [Carbon::now()->subDays(6)->format('Y-m-d')])
            ->groupBy('cdate')
            ->pluck('click_count', 'cdate');

        // Fetch sale counts from 'sales' table
        $sales = DB::table('sales')
            ->selectRaw('DATE(created_at) as sdate, COUNT(*) as sale_count')
            ->whereRaw('DATE(created_at) >= ?', [Carbon::now()->subDays(6)->format('Y-m-d')])
            ->groupBy('sdate')
            ->pluck('sale_count', 'sdate');

        // Prepare dataset arrays
        $clickData  = [];
        $saleData   = [];
        $ctrData    = [];

        foreach ($dates as $date) {
            $clickCount = $clicks[$date] ?? 0;
            $saleCount = $sales[$date] ?? 0;

            $ctr = $clickCount > 0 ? round(($saleCount / $clickCount) * 100, 2) : 0;

            $clickData[]    = $clickCount;
            $saleData[]     = $saleCount;
            $ctrData[]      = $ctr;
        }

        return [
            'datasets' => [
                [
                    'label'             => 'Clicks',
                    'data'              => array_values($clickData),
                    'borderColor'       => 'rgba(248, 209, 37, 0.9)',
                    'backgroundColor'   => 'rgba(248, 209, 37, 0.4)',
                    'tension'           => 0.3,
                ],
                [
                    'label'              => 'Sales',
                    'data'               => array_values($saleData),
                    'borderColor'        => 'rgba(54, 162, 235, 0.9)',
                    'backgroundColor'    => 'rgba(54, 162, 235, 0.4)',
                    'tension'            => 0.3,
                ],
                [
                    'label'             => 'CTR %',
                    'data'              => array_values($ctrData),
                    'borderColor'       => 'rgba(255, 99, 132, 0.9)',
                    'backgroundColor'   => 'rgba(255, 99, 132, 0.4)',
                    'tension'           => 0.3,
                ],
            ],
            'labels' => $dates->values()->toArray(),
        ];
    }

    protected function getOptions(): array
    {
        // Calculate totals inside the chart options
        $clicksTotal = DB::table('clicks')
            ->whereRaw('DATE(click_time) >= ?', [Carbon::now()->subDays(6)->format('Y-m-d')])
            ->count();

        $salesTotal = DB::table('sales')
            ->whereRaw('DATE(created_at) >= ?', [Carbon::now()->subDays(6)->format('Y-m-d')])
            ->count();

        $ctr = $clicksTotal > 0 ? round(($salesTotal / $clicksTotal) * 100, 2) : 0;

        return [
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'top',
                ],
                'title' => [
                    'display' => true,
                    'text' => "Total Clicks: $clicksTotal | Total Sales: $salesTotal | Avg CTR: $ctr%",
                    'font' => [
                        'size' => 14,
                    ],
                    'padding' => [
                        'top' => 10,
                        'bottom' => 10,
                    ],
                ],
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'title' => [
                        'display' => true,
                        'text' => 'Count / CTR %',
                    ],
                ],
            ],
        ];
    }
}
