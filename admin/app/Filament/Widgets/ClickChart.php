<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Contracts\Support\Htmlable;

class ClickChart extends ChartWidget
{
    protected static ?string $heading = 'Chart';

    public function getHeading(): string | Htmlable | null
    {
        return 'Click Trends';
    }

    protected function getData(): array
    {
        // Generate last 7 days dates
        $dates = collect(range(0, 6))->map(function ($days) {
            return Carbon::now()->subDays($days)->format('Y-m-d');
        })->reverse();

        // Fetch coupon clicks for the last 7 days
        $couponClicks = DB::table('clicks')
            ->select(DB::raw('DATE(click_time) as click_date'), DB::raw('COUNT(*) as click_count'))
            ->where('source_type', 'coupon')
            ->whereRaw('DATE(click_time) >= ?', [Carbon::now()->subDays(6)->format('Y-m-d')])
            ->groupBy('click_date')
            ->pluck('click_count', 'click_date');

        // Fetch store clicks for the last 7 days
        $storeClicks = DB::table('clicks')
            ->select(DB::raw('DATE(click_time) as click_date'), DB::raw('COUNT(*) as click_count'))
            ->where('source_type', 'store')
            ->whereRaw('DATE(click_time) >= ?', [Carbon::now()->subDays(6)->format('Y-m-d')])
            ->groupBy('click_date')
            ->pluck('click_count', 'click_date');

        // Prepare data with 0 for days without clicks
        $couponClickData = $dates->map(function ($date) use ($couponClicks) {
            return $couponClicks->get($date, 0);
        });

        $storeClickData = $dates->map(function ($date) use ($storeClicks) {
            return $storeClicks->get($date, 0);
        });

        return [
            'datasets' => [
                [
                    'label' => 'Coupon Clicks',
                    'data' => $couponClickData->values()->toArray(),
                    'backgroundColor' => 'rgba(248, 209, 37, 0.6)', // Red
                ],
                [
                    'label' => 'Store Clicks',
                    'data' => $storeClickData->values()->toArray(),
                    'backgroundColor' => 'rgba(54, 162, 235, 0.6)', // Blue
                ]
            ],
            'labels' => $dates->values()->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display' => true,
                ],
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'title' => [
                        'display' => true,
                        'text' => 'Number of Clicks'
                    ]
                ],
                'x' => [
                    // Remove the stacked option to show side-by-side bars
                ]
            ],
            // Optional: Add bar configuration for more control
            'bar' => [
                'categoryPercentage' => 0.8, // Adjust bar width
                'barPercentage' => 0.6, // Space between bars
            ]
        ];
    }
}