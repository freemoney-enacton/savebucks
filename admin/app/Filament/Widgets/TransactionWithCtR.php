<?php

namespace App\Filament\Widgets;

use App\Models\UserOfferClick;
use App\Models\UserOfferSale;
use Filament\Widgets\ChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

class TransactionWithCtR extends ChartWidget
{
    protected static ?string $heading = 'Clicks vs Transactions';

    protected function getData(): array
    {
        // $clicks = UserOfferClick::count();
        // $sales = UserOfferSale::count();
        $clicks = Trend::model(UserOfferClick::class)
            ->between(
                start: now()->subMonths(6),
                end: now()->endOfMonth(),
            )
            ->perMonth()
            ->count();


        $sales = Trend::model(UserOfferSale::class)
            ->between(
                start: now()->startOfYear(),
                end: now()->endOfYear(),
            )
            ->perMonth()
            ->count();

        return [
            'datasets' => [
                [
                    'label' => 'Clicks',
                    'data' => $clicks->map(fn (TrendValue $value) => $value->aggregate),
                    'borderColor' => '#00D8FF',
                    'backgroundColor' => '#00D8FF',
                ],
                [
                    'label' => 'Sales',
                    'data' => $sales->map(fn (TrendValue $value) => $value->aggregate),
                    'borderColor' => '#FF6384',
                    'backgroundColor' => '#FF6384',
                ],
            ],
            'labels' => $clicks->map(fn (TrendValue $value) => $value->date),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
