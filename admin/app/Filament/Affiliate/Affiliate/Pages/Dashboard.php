<?php

namespace App\Filament\Affiliate\Pages;

use App\Filament\Affiliate\Widgets\AffiliateStatsOverview;
use App\Filament\Affiliate\Widgets\ClicksTrendChart;
use Filament\Pages\Page;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    // protected static string $view = 'filament.affiliate.pages.dashboard';

    public function getWidgets(): array
    {
        return [
            AffiliateStatsOverview::class,
            ClicksTrendChart::class
        ];
    }


}
