<?php

namespace App\Filament\Widgets;

use App\Models\FrontUser;
use Filament\Widgets\ChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;


class TotalUsersChart extends ChartWidget
{
    protected static ?string $heading = 'Daily Users Trends';

    protected function getData(): array
    {
        $data = Trend::model(FrontUser::class)
            ->between(
                start: now()->subMonths(2),
                end: now(),
            )
            ->perDay()
            ->count();

        return [
            'datasets' => [
                [
                    'label' => 'Users Count',
                    'data' => $data->map(fn (TrendValue $value) => $value->aggregate),
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
