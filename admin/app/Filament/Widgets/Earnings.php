<?php

namespace App\Filament\Widgets;

use App\Models\UserBonus;
use App\Models\UserOfferSale;
use App\Models\UserRefferralEarning;
use Filament\Widgets\ChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;
use Illuminate\Contracts\Support\Htmlable;

class Earnings extends ChartWidget
{
    protected int | string | array $columnSpan = 2;

    public function getHeading(): string | Htmlable | null
    {
        return 'Revenue Breakdown (in ' . config('freemoney.currencies.default') . ')';
    }

    protected function getData(): array
    {
        $revenue = Trend::model(UserOfferSale::class)
            ->between(
                start: now()->subDays(7),
                end: now(),
            )
            ->perDay()
            ->sum('payout');

        $taskEarning = Trend::model(UserOfferSale::class)
            ->between(
                start: now()->subDays(7),
                end: now(),
            )
            ->perDay()
            ->sum('amount');

        $referralEarning = Trend::model(UserRefferralEarning::class)
            ->between(
                start: now()->subDays(7),
                end: now(),
            )
            ->perDay()
            ->sum('referral_amount');

        $bonusEarning = Trend::model(UserBonus::class)
            ->between(
                start: now()->subDays(7),
                end: now(),
            )
            ->perDay()
            ->sum('amount');

        return [
            'datasets' => [
                [
                    'label' => 'Total Revenue',
                    'data' => $revenue->map(fn (TrendValue $value) => $value->aggregate),
                    'backgroundColor' => 'rgb(102, 204, 102)',
                    'borderWidth' => 0,
                ],
                [
                    'label' => 'User Task Earning',
                    'data' => $taskEarning->map(fn (TrendValue $value) => $value->aggregate),
                    'backgroundColor' => 'rgb(102, 153, 204)',
                    'borderWidth' => 0,
                ],
                [
                    'label' => 'User Referral Earning',
                    'data' => $referralEarning->map(fn (TrendValue $value) => $value->aggregate),
                    'backgroundColor' => 'rgb(204, 102, 102)',
                    'borderWidth' => 0,
                ],
                [
                    'label' => 'User Bonus Earning',
                    'data' => $bonusEarning->map(fn (TrendValue $value) => $value->aggregate),
                    'backgroundColor' =>  'rgb(153, 153, 153)',
                    'borderWidth' => 0,
                ],
            ],
            'labels' => $revenue->map(fn (TrendValue $value) => $value->date),
            'dataLabels' => true,
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
