<?php

namespace App\Filament\Resources\BlockResource\Pages;

use App\Filament\Resources\BlockResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;

class EditBlock extends EditRecord
{
    protected static string $resource = BlockResource::class;
    use EditRecord\Concerns\Translatable;
    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }

    // protected function mutateFormDataBeforeSave(array $data): array
    // {
    //     if (isset($data['blocks'])) {
    //         $blocks = [];
    //         foreach ($data['blocks'] as $block) {
    //             $block['data']['image'] = Storage::disk('frontend')->url($block['data']['image']);
    //             $blocks[] = $block;
    //         }
    //     }
    //     $data['blocks'] = $blocks;
    //     return $data;
    // }

    // protected function mutateFormDataBeforeFill(array $data): array
    // {
    //     if (isset($data['blocks'])) {
    //         $blocks = [];
    //         foreach ($data['blocks'] as $block) {
    //             if (isset($block['data']['image'])) {
    //                 $block['data']['image'] = pathinfo(parse_url($block['data']['image'], PHP_URL_PATH), PATHINFO_BASENAME);
    //                 $blocks[] = $block;
    //             }
    //         }
    //         $data['blocks'] = $blocks;
    //     }
    //     return $data;
    // }
}
