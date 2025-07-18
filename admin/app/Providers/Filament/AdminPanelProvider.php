<?php

namespace App\Providers\Filament;

use App\Filament\Pages\Login;
use App\Filament\Pages\Settings\Settings;
use App\Filament\Resources\PaypalIcon;
use App\Models\Language;
use App\Models\Setting;
use Awcodes\Curator\CuratorPlugin;
use Awcodes\Curator\View\Components\Curation;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Pages\Auth\EditProfile;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\SpatieLaravelTranslatablePlugin;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Kenepa\TranslationManager\TranslationManagerPlugin;
use Illuminate\Support\HtmlString;
use SolutionForest\FilamentTranslateField\FilamentTranslateFieldPlugin;
use Filament\Navigation\NavigationGroup;
use Filament\Navigation\NavigationItem;
use pxlrbt\FilamentSpotlight\SpotlightPlugin;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        PaypalIcon::register();

        Cache::remember('defaultLocales', 15, function () {
            return Language::where('is_enabled', 1)->pluck('code')->toArray();
        });

        Cache::remember('default_currency', 15, function () {
            return Setting::where('name', 'default_currency')->first()->val;
        });

        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login(
                Login::class,
            )
            ->colors([
                'primary' => Color::Amber,
            ])
            ->globalSearch(false)
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->navigationGroups([
                'Tasks & Survey Management',
                'Stores & Offers',
                'Affiliate Networks',
                'CMS',
                'Sales & Cashback',
                'Manage Users',
                'Rewards Settings',
                'Settings',
                'Reports & Logs',
                'Leaderboards',
                'Super Admin Control',
            ])
            ->databaseNotifications()
            ->renderHook(
                'panels::user-menu.before',
                fn(): string => (new HtmlString('
                <div class="flex  flex-col">
                    <div class="flex justify-center items-center">
                        <a  title="frontend" target="_blank" href="' . config('app.web_url') . '"class="pointer font-semibold text-blue-500 border-b border-blue-500 owner-frontend-btn !important">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                            </svg>
                         </a>
                    </div>
                </div>')),

            )
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                // Widgets\AccountWidget::class,
                // Widgets\FilamentInfoWidget::class,
            ])
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
            ->viteTheme('resources/css/filament/admin/theme.css')
            ->plugins([
                SpotlightPlugin::make(),
                \BezhanSalleh\FilamentShield\FilamentShieldPlugin::make(),
                SpatieLaravelTranslatablePlugin::make()
                    ->defaultLocales(config('freemoney.languages.keys')),
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->spa()
            ->sidebarCollapsibleOnDesktop()
            ->navigationItems([
                // NavigationItem::make('Task Manager')
                //     ->url(url('/totem'), shouldOpenInNewTab: true)
                //     ->icon('heroicon-o-clock')
                //     ->group('Settings')
                //     ->sort(2),
            ]);
    }
}
