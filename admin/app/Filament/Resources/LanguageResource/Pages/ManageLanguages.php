<?php

namespace App\Filament\Resources\LanguageResource\Pages;

use App\Filament\Resources\LanguageResource;
use App\Jobs\GenerateSettingsConfig;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageLanguages extends ManageRecords
{
    protected static string $resource = LanguageResource::class;

    protected static string $subtitle = 'Manage Languages All the enabled language will be available for translations in each module.';

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->before(function ($data) {
                    if (isset($data['flag'])) {
                        $filename = $data['flag'];
                        $data['flag'] =   \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
                    }

                    return $data;
                })
                ->after(function () {
                    GenerateSettingsConfig::dispatch();
                    \Http::get(config('app.api_url') . '/api/v1/cache/settings');
                }),

        ];
    }
}
