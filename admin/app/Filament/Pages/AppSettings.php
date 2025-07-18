<?php

namespace App\Filament\Pages;

use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use QCod\AppSettings\Setting\AppSettings as SettingAppSettings;

class AppSettings extends Page
{

    protected static string $view = 'filament.pages.app-settings';

    protected static ?int $navigationSort = 1;
    protected static ?string $navigationGroup = "Settings";
    protected static ?string $navigationLabel = 'Settings';
    protected static ?string $navigationIcon = 'heroicon-o-cog-8-tooth';
    protected static ?string $modelLabel = 'Settings';

    public $settingsUI;
    public $settingViewName;

    public function mount(SettingAppSettings $appSettings)
    {
        $this->settingsUI = $appSettings->loadConfig(config('app_settings', []));
        $this->settingViewName = config('app_settings.setting_page_view');
    }

    protected function getHeaderActions(): array
    {
        return [         
           Action::make('clear-web-cache')
            ->action(function () {
                try {

                    $url = config('app.api_url') . '/api/v1/cache/pages';
                    $response = Http::get($url);
                    // Log::info('Cache clear request', ['url' => $url, 'status' => $response->status()]);

                    if ($response->successful() && ($json = $response->json()) && $json['success'] ?? false) {
                        Notification::make()->success()->title('Cache cleared successfully')->send();

                    } else {
                        Log::error('Cache clear failed', [
                            'status' => $response->status(),
                            // 'body' => $response->body(),
                            'json_error' => json_last_error_msg(),
                        ]);

                        Notification::make()
                            ->danger()
                            ->title('Cache clear failed')
                            ->body($json['message'] ?? 'API error: ' . $response->status())
                            ->send();
                    }
                } catch (\Exception $e) {
                    
                    Log::error('Cache clear error', ['message' => $e->getMessage()]);
                    Notification::make()
                        ->danger()
                        ->title('Error')
                        ->body('Request failed: ' . $e->getMessage())
                        ->send();
                }
            }),

            Action::make('manage-languages')
                ->url(route('filament.admin.resources.languages.index')),

        ];
    }
}
