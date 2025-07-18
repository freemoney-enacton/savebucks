<?php

namespace App\Filament\Affiliate\Widgets;

use Filament\Widgets\ChartWidget;
use Carbon\Carbon;
use App\Models\Affiliate\Conversion;
use Illuminate\Support\Facades\DB;

class ConversionTrendChart extends ChartWidget
{
    protected static ?string $heading   = 'Conversions Trend Chart';
    protected static ?string $maxHeight = '450px';
    protected static ?int $sort         = 2;

    protected function getData(): array
    {   
        $conversionCount = [];
        $labels = [];

        $startDate = Carbon::now()->subDays(14)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        // Get the conversion counts for the last 15 days
        $conversionCounts = Conversion::select(DB::raw('DATE(converted_at) as date'), DB::raw('COUNT(*) as count'))
            ->whereBetween('converted_at', [$startDate, $endDate])
            ->groupBy(DB::raw('DATE(converted_at)'))
            ->orderBy(DB::raw('DATE(converted_at)'), 'desc')
            ->get()
            ->keyBy('date');  // Key the collection by the date for quick lookup

        // Generate the labels and data arrays
        $labels = [];
        $data = [];

        for ($i = 14; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');  // Format the date

            // Check if the date has data, otherwise set to 0
            $conversionCount = $conversionCounts->get($date, 0);

            $labels[] = Carbon::parse($date)->format('M j');
            $data[] = ($conversionCount === 0) ? 0 : $conversionCount->count;
        }

        return [
            'datasets' => [
                [
                    'label'             => 'Daily Conversions',
                    'data'              => $data,                 
                    'backgroundColor'   => 'rgba(16, 185, 129, 0.1)',    
                    'borderColor'       => '#10b981',                     
                    'pointBackgroundColor' => '#10b981',                  
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
        $totalConversions = Conversion::count();

        return [
            'responsive' => true,
            'maintainAspectRatio' => false,
            'plugins' => [
                'legend' => [
                    'display' => false,
                ],
                'title' => [
                    'display' => true,
                    'text' => "Total Conversions: " . number_format($totalConversions),
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
                        'text' => 'Daily Conversions',
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