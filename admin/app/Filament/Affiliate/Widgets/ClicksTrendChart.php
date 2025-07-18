<?php

namespace App\Filament\Affiliate\Widgets;

use Filament\Widgets\ChartWidget;
use Carbon\Carbon;
use App\Models\Affiliate\Click;
use Illuminate\Support\Facades\DB;

class ClicksTrendChart extends ChartWidget
{
    protected static ?string $heading = 'Clicks Trend Chart';
    protected static ?string $maxHeight = '450px';
    protected static ?int $sort = 1;

    protected function getData(): array
    {       
        $clickCounts = [];
        $labels = [];


        $startDate = Carbon::now()->subDays(14)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

    $clickCounts = Click::select(DB::raw('DATE(clicked_at) as date'), DB::raw('COUNT(*) as count'))
                ->whereBetween('clicked_at', [$startDate, $endDate])
                ->groupBy(DB::raw('DATE(clicked_at)'))
                ->orderBy(DB::raw('DATE(clicked_at)'), 'desc')
                ->get()->keyBy('date'); ;

            $labels = [];
            $data = [];

            for ($i = 14; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');  // Format the date

            // Check if the date has data, otherwise set to 0
            $clickCount = $clickCounts->get($date, 0);

            $labels[] = Carbon::parse($date)->format('M j');
            $data[] = ($clickCount === 0) ? 0 : $clickCount->count;
        }

        return [
            'datasets' => [
                [
                    'label'             => 'Daily Clicks',
                    'data'              => $data,
                    'borderColor'       => '#3b82f6',
                    'backgroundColor'   => 'rgba(59, 130, 246, 0.1)',
                    'pointBackgroundColor' => '#3b82f6',
                    'pointBorderColor'  => '#ffffff',
                    'pointBorderWidth'  => 2,
                    'borderWidth'       => 3,
                    'tension'           => 0.4,
                    'fill'              => true,
                ]
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getOptions(): array
    {
        $maxValue = max($this->getCachedData()['datasets'][0]['data'] ?? [1]);
        $suggestedMax = max(10, ceil($maxValue * 1.2));
        $totalClicks = Click::count();

        return [
            'responsive' => true,
            'maintainAspectRatio' => false,
            'plugins' => [
                'legend' => [
                    'display' => false,
                ],
                'title' => [
                    'display' => true,
                    'text' => "Total Clicks: " . number_format($totalClicks),
                    'font' => [
                        'size' => 14,
                        'weight' => 'bold',
                    ],
                    'padding' => [
                        'top' => 10,
                        'bottom' => 10,
                    ],
                    'color' => '#374151',
                ],
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'suggestedMax' => $suggestedMax,
                    'ticks' => [
                        'stepSize' => 1,
                        'color' => '#6b7280',
                    ],
                    'grid' => [
                        'color' => 'rgba(156, 163, 175, 0.1)',
                        'borderColor' => 'rgba(156, 163, 175, 0.3)',
                    ],
                    'title' => [
                        'display' => true,
                        'text' => 'Daily Clicks',
                        'color' => '#374151',
                        'font' => [
                            'size' => 12,
                            'weight' => 'bold',
                        ],
                    ],
                ],
                'x' => [
                    'ticks' => [
                        'color' => '#6b7280',
                        'maxRotation' => 45,
                        'minRotation' => 30,
                    ],
                    'grid' => [
                        'display' => false,
                    ],
                    'title' => [
                        'display' => true,
                        'text' => 'Date',
                        'color' => '#374151',
                        'font' => [
                            'size' => 12,
                            'weight' => 'bold',
                        ],
                    ],
                ],
            ],
        ];
    }
}