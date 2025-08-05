<?php

namespace App\Filament\Affiliate\Widgets;

use Leandrocfe\FilamentApexCharts\Widgets\ApexChartWidget;
use App\Models\Affiliate\Conversion;
use App\Models\Affiliate\ViewConversion;
use Carbon\Carbon;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Grid;

class ConversionTrendChart extends ApexChartWidget
{
    protected static ?string $chartId = 'conversionTrendChart';
    protected static ?string $heading = 'Conversions Trend Chart';
    protected int | string | array $columnSpan = 'half';
    protected static ?int $sort = 2;

    // Filter property
    public ?string $filter_status = null;

    protected function getFormSchema(): array
    {
        return [
            Grid::make(1)
                ->schema([

                    Select::make('filter_status')
                        ->label('Status')
                        ->preload()
                        ->searchable()
                        ->options([
                            '' => 'All Statuses',
                            'pending' => 'Pending',
                            'approved' => 'Approved',
                            'declined' => 'Declined',
                            'paid'      => 'Paid',
                            'untracked' => 'Untracked',
                        ])
                        ->default('')
                        ->live()
                        ->afterStateUpdated(function () {
                            $this->updateOptions();
                        }),

                    DatePicker::make('filter_start_date')
                        ->label('Start Date')
                        ->default(Carbon::now()->subDays(15)->format('Y-m-d'))
                        ->live()
                        ->native(false)
                        ->afterStateUpdated(function () {
                            $this->updateOptions();
                        }),

                    DatePicker::make('filter_end_date')
                        ->label('End Date')
                        ->native(false)
                        ->default(Carbon::now()->format('Y-m-d'))
                        ->live()
                        ->afterStateUpdated(function () {
                            $this->updateOptions();
                        }),
                ])
        ];
    }

    protected function getOptions(): array
    {
        $data = $this->getChartData();
        $summary = $this->getSummaryData();

        return [
            'chart' => [
                'type' => 'line',
                'height' => 350,
                'toolbar' => [
                    'show' => false, // Remove download options
                ],
            ],
            'series' => [
                [
                    'name' => 'Conversions Count',
                    'data' => $data['counts'],
                ],
                [
                    'name' => 'Commission (€)',
                    'data' => $data['commissions'],
                ],
            ],
            'xaxis' => [
                'categories' => $data['labels'],
                'labels' => [
                    'rotate' => -45,
                    'maxHeight' => 60,
                    'style' => [
                        'fontSize' => '11px',
                    ],
                ],
            ],
            'yaxis' => [
                [
                    'title' => [
                        'text' => 'Conversions Count',
                    ],
                ],
                [
                    'opposite' => true,
                    'title' => [
                        'text' => 'Commission (€)',
                    ],
                ],
            ],
            'colors' => ['#008FFB', '#00E396'],
            'stroke' => [
                'width' => 2,
            ],
            'markers' => [
                'size' => 4,
            ],
            'legend' => [
                'show' => true,
            ],
            'title' => [
                'text' => $this->getChartTitle($summary),
            ],
            'subtitle' => [
                'text' => $this->getSubtitle($summary),
            ],
        ];
    }

    private function getChartData(): array
    {
        // Get filter values
        $statusFilter = $this->filterFormData['filter_status'] ?? null;
        $startDate = $this->filterFormData['filter_start_date'] ?? Carbon::now()->subDays(15)->format('Y-m-d');
        $endDate = $this->filterFormData['filter_end_date'] ?? Carbon::now()->format('Y-m-d');

        $startDate = Carbon::parse($startDate);
        $endDate = Carbon::parse($endDate);

        // Calculate days to determine grouping
        $daysDiff = $startDate->diffInDays($endDate);

        if ($daysDiff > 60) {
            // Weekly grouping for more than 60 days
            return $this->getWeeklyData($startDate, $endDate, $statusFilter);
        } else {
            // Daily grouping for 60 days or less
            return $this->getDailyData($startDate, $endDate, $statusFilter);
        }
    }

    private function getDailyData($startDate, $endDate, $statusFilter): array
    {
        $labels = [];
        $counts = [];
        $commissions = [];

        $currentDate = $startDate->copy();
        while ($currentDate <= $endDate) {
            $labels[] = $currentDate->format('M j');

            $query = ViewConversion::whereDate('converted_at', $currentDate->format('Y-m-d'));
            if ($statusFilter) {
                $query->where('conversion_status', $statusFilter);
            }

            $result = $query->selectRaw('COUNT(*) as count, COALESCE(SUM(commission), 0) as total_commission')->first();
            $counts[] = (int)($result->count ?? 0);
            $commissions[] = (float)($result->total_commission ?? 0);

            $currentDate->addDay();
        }

        return [
            'labels' => $labels,
            'counts' => $counts,
            'commissions' => $commissions,
        ];
    }

    private function getWeeklyData($startDate, $endDate, $statusFilter): array
    {
        $labels = [];
        $counts = [];
        $commissions = [];

        $currentDate = $startDate->copy()->startOfWeek();
        while ($currentDate <= $endDate) {
            $weekEnd = $currentDate->copy()->endOfWeek();
            if ($weekEnd > $endDate) {
                $weekEnd = $endDate->copy();
            }

            $labels[] = $currentDate->format('M j');

            $query = ViewConversion::whereBetween('converted_at', [
                $currentDate->format('Y-m-d 00:00:00'),
                $weekEnd->format('Y-m-d 23:59:59')
            ]);
            if ($statusFilter) {
                $query->where('conversion_status', $statusFilter);
            }

            $result = $query->selectRaw('COUNT(*) as count, COALESCE(SUM(commission), 0) as total_commission')->first();
            $counts[] = (int)($result->count ?? 0);
            $commissions[] = (float)($result->total_commission ?? 0);

            $currentDate->addWeek();
        }

        return [
            'labels' => $labels,
            'counts' => $counts,
            'commissions' => $commissions,
        ];
    }

    private function getSummaryData(): array
    {
        // Get filter values
        $statusFilter = $this->filterFormData['filter_status'] ?? null;
        $startDate = $this->filterFormData['filter_start_date'] ?? Carbon::now()->subDays(7)->format('Y-m-d');
        $endDate = $this->filterFormData['filter_end_date'] ?? Carbon::now()->format('Y-m-d');

        // Convert to Carbon objects
        $startDate = Carbon::parse($startDate);
        $endDate = Carbon::parse($endDate);

        $query = ViewConversion::whereBetween('converted_at', [
            $startDate->format('Y-m-d 00:00:00'),
            $endDate->format('Y-m-d 23:59:59')
        ]);

        // Apply status filter if set
        if ($statusFilter) {
            $query->where('conversion_status', $statusFilter);
        }

        $summary = $query->selectRaw('
            COUNT(*) as total_conversions,
            COALESCE(SUM(commission), 0) as total_commission
        ')->first();

        // Fallback to Conversion model if needed
        if ($summary->total_conversions == 0) {
            $query = Conversion::whereBetween('converted_at', [
                $startDate->format('Y-m-d 00:00:00'),
                $endDate->format('Y-m-d 23:59:59')
            ]);

            if ($statusFilter) {
                $query->where('status', $statusFilter);
            }

            $summary = $query->selectRaw('
                COUNT(*) as total_conversions,
                COALESCE(SUM(commission), 0) as total_commission
            ')->first();
        }

        return [
            'total_conversions' => (int)($summary->total_conversions ?? 0),
            'total_commission' => (float)($summary->total_commission ?? 0),
        ];
    }

    private function getChartTitle(array $summary): string
    {
        $statusFilter = $this->filterFormData['filter_status'] ?? null;
        $statusText = $statusFilter ? ucfirst($statusFilter) . ' ' : '';

        return "{$statusText}Conversions: {$summary['total_conversions']} | Total Earnings: €" . number_format($summary['total_commission'], 2);
    }

    private function getSubtitle(array $summary): string
    {
        $startDate = $this->filterFormData['filter_start_date'] ?? Carbon::now()->subDays(7)->format('Y-m-d');
        $endDate = $this->filterFormData['filter_end_date'] ?? Carbon::now()->format('Y-m-d');

        $startDate = Carbon::parse($startDate)->format('M j, Y');
        $endDate = Carbon::parse($endDate)->format('M j, Y');

        return "Period: {$startDate} - {$endDate} | Total Commission: €" . number_format($summary['total_commission'], 2);
    }
}
