<?php

namespace App\Filament\Resources\PageResource\Pages;

use App\Filament\Resources\PageResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class CreatePage extends CreateRecord
{
    protected static string $resource = PageResource::class;
    use CreateRecord\Concerns\Translatable;

    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make(),
        ];
    }

    protected function afterCreate(): void
    {
        $res = Http::get(config('app.api_url').'/api/v1/cache/pages');
        if (json_decode($res)->success == true) {
            Notification::make()
                ->success()
                ->title('Page Cache cleared successfully')
                ->send();
        }
    }

    // protected function mutateFormDataBeforeCreate(array $data): array
    // {
    //     if (isset($data['blocks'])) {
    //         $blocks = [];
    //         foreach ($data['blocks'] as $block) {
    //             if (isset($block['data']['image'])) {
    //                 $block['data']['image'] = Storage::disk('public')->url($block['data']['image']);
    //                 $blocks[] = $block;
    //             }
    //         }
    //     }
    //     $data['blocks'] = $blocks;
    //     return $data;
    // }
}
