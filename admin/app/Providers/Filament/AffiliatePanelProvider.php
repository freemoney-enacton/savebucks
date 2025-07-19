<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Filament\Navigation\NavigationItem;
use App\Filament\Affiliate\Resources\CampaignResource;

class AffiliatePanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('affiliate')
            ->login()
            // ->brandLogo(asset('savebucks.png'))
            // ->brandLogoHeight('3rem')
            ->path('affiliate')
            ->brandName('Savebucks Affiliate')
            ->colors([
                'primary' => Color::Indigo,
            ])
            ->navigationGroups([
                'Affiliate',
                'Campaigns',
                'Payout',
                'Logs & Reports',
                'Clicks & Conversions',
                'Settings',
            ])
            ->discoverResources(in: app_path('Filament/Affiliate/Resources'), for: 'App\\Filament\\Affiliate\\Resources')
            ->discoverPages(in: app_path('Filament/Affiliate/Pages'), for: 'App\\Filament\\Affiliate\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Affiliate/Widgets'), for: 'App\\Filament\\Affiliate\\Widgets')
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->sidebarCollapsibleOnDesktop()
            ->databaseNotifications()
            ->authMiddleware([
                Authenticate::class,
            ])
            ->navigationItems([
            NavigationItem::make('Campaigns')
                ->url( fn (): string => CampaignResource::getUrl('view', ['record' => 1]) , shouldOpenInNewTab: false)
                ->icon('heroicon-o-presentation-chart-line')
                ->group('Campaigns')
                // ->isActiveWhen(fn () => request()->routeIs('filament.resources.campaigns.view'))
                ->isActiveWhen(fn () => request()->routeIs('filament.affiliate.resources.campaigns.view'))
                ->sort(1),
            ]);
    }
}
