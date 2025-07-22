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

    public ?string $filter = 'current';

    protected function getFilters(): ?array
    {
        // Generate month options for the last 6 months
        $monthOptions = ['current' => 'Current Month'];

        for ($i = 1; $i <= 6; $i++) {
            $date = Carbon::now()->subMonths($i);
            $key = $date->format('Y-m');
            $value = $date->format('F Y');
            $monthOptions[$key] = $value;
        }

        return $monthOptions;
    }

    protected function getData(): array
    {
        // Determine date range based on filter
        if ($this->filter === 'current') {
            $startDate = Carbon::now()->startOfMonth();
            $endDate = Carbon::now()->endOfMonth();
        } else {
            $startDate = Carbon::createFromFormat('Y-m', $this->filter)->startOfMonth();
            $endDate = Carbon::createFromFormat('Y-m', $this->filter)->endOfMonth();
        }

        // Get the conversion counts for each day in the selected month
        $conversionCounts = Conversion::select(DB::raw('DATE(converted_at) as date'), DB::raw('COUNT(*) as count'))
            ->whereBetween('converted_at', [$startDate, $endDate])
            ->groupBy(DB::raw('DATE(converted_at)'))
            ->orderBy(DB::raw('DATE(converted_at)'), 'asc')
            ->get()
            ->keyBy('date');

        // Generate the labels and data arrays for each day of the month
        $labels = [];
        $data = [];

        $currentDate = $startDate->copy();
        while ($currentDate->lte($endDate)) {
            $dateStr = $currentDate->format('Y-m-d');
            $conversionCount = $conversionCounts->get($dateStr, null);

            $labels[] = $currentDate->format('M j');
            $data[] = $conversionCount ? $conversionCount->count : 0;

            $currentDate->addDay();
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

        // Get total conversions for selected month
        if ($this->filter === 'current') {
            $startDate = Carbon::now()->startOfMonth();
            $endDate = Carbon::now()->endOfMonth();
            $monthLabel = 'Current Month (' . Carbon::now()->format('F Y') . ')';
        } else {
            $startDate = Carbon::createFromFormat('Y-m', $this->filter)->startOfMonth();
            $endDate = Carbon::createFromFormat('Y-m', $this->filter)->endOfMonth();
            $monthLabel = Carbon::createFromFormat('Y-m', $this->filter)->format('F Y');
        }

        $totalConversions = Conversion::whereBetween('converted_at', [$startDate, $endDate])->count();

        return [
            'responsive' => true,
            'maintainAspectRatio' => false,
            'plugins' => [
                'legend' => [
                    'display' => false,
                ],
                'title' => [
                    'display' => true,
                    'text' => $monthLabel . " - Total Conversions: " . number_format($totalConversions),
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
