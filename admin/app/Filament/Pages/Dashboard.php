<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Filament\Widgets;
use App\Filament\Widgets\ClickChart;
use App\Filament\Widgets\CtrTrendChart;
use App\Filament\Widgets\Earnings;
use App\Filament\Widgets\LatestTransactions;
use App\Filament\Widgets\StatsOverview;
use App\Filament\Widgets\TopOffers;
use App\Filament\Widgets\TopUsers;
use App\Filament\Widgets\RevenueChart;
use App\Filament\Widgets\TopMerchants;
use App\Filament\Widgets\TotalUsersChart;
// use App\Filament\Widgets\TransactionWithCtR;
use Filament\Facades\Filament;
use Filament\Pages\Dashboard as BasePage;

class Dashboard extends  BasePage
{

    // protected static string $view = 'filament.pages.dashboard';

    protected static ?string $navigationIcon = 'heroicon-o-chart-bar-square';
    protected static ?int $navigationSort = 1;

    public function getWidgets(): array
    {
        return [
            StatsOverview::class,
            TotalUsersChart::class,
            RevenueChart::class,
            ClickChart::class,
            CtrTrendChart::class,
            Earnings::class,
            // TransactionWithCtR::class,
            TopOffers::class,
            TopUsers::class,
            TopMerchants::class,
            LatestTransactions::class
        ];
    }
}
