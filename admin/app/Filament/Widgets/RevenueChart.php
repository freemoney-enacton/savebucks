<?php

namespace App\Filament\Widgets;

use App\Models\UserOfferSale;
use Filament\Widgets\ChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;
use Illuminate\Contracts\Support\Htmlable;

class RevenueChart extends ChartWidget
{
    // protected static ?string $heading = 'Daily Revenue Trend';

    public function getHeading(): string | Htmlable | null
    {
        return 'Daily Revenue Trend (in ' . config('freemoney.currencies.default') . ')';
    }


    protected function getData(): array
    {
        $data = Trend::model(UserOfferSale::class)
            ->between(
                start: now()->subMonths(1),
                end: now(),
            )
            ->perDay()
            ->sum('payout');

        return [
            'datasets' => [
                [
                    'label' => 'Total Revenue',
                    'data' => $data->map(fn (TrendValue $value) => $value->aggregate),
                    'borderColor' => 'rgb(102, 204, 102)',
                    'borderWidth' => 2
                ],
            ],
            'labels' => $data->map(fn (TrendValue $value) => $value->date),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
