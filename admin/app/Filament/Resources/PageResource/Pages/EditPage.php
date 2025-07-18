<?php

namespace App\Filament\Resources\PageResource\Pages;

use App\Filament\Resources\PageResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EditPage extends EditRecord
{
    use EditRecord\Concerns\Translatable;

    protected static string $resource = PageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            $this->getSaveFormAction()
                ->formId('form'),
            Actions\DeleteAction::make(),
            Actions\LocaleSwitcher::make(),
           
        ];
    }

    protected function afterSave(): void
    {
        try{
        $res = Http::get(config('app.api_url').'/api/v1/cache/pages');
        if (json_decode($res)->success == true) {
            Notification::make()
                ->success()
                ->title('Page Cache cleared successfully')
                ->send();
        }
        }
        catch(\Exception $e){
            \Log::Info($e);
        }
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
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

        // if (isset($data['blocks']) && !is_array($data['blocks'])) {
        //     $data['blocks'] = json_decode($data['blocks'], true) ?: [];
        // }
        // dd($data);

        return $data;
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
    //     info('funeditpage');
    //     info($data['blocks']);
    //     if (isset($data['blocks'])) {
    //         $blocks = [];
    //         if (is_array($data['blocks'])) {
    //             foreach ($data['blocks'] as $block) {
    //                 if (isset($block['data']['image']) &&  Str::isUrl($block['data']['image'])) {
    //                     $block['data']['image'] = pathinfo(parse_url($block['data']['image'], PHP_URL_PATH), PATHINFO_BASENAME);
    //                     $blocks[] = $block;
    //                 }
    //             }
    //             $data['blocks'] = $blocks;
    //         }
    //     }

    // if (isset($data['blocks']) && !is_array($data['blocks'])) {
    //     $data['blocks'] = json_decode($data['blocks'], true) ?: [];
    // }
        // dd($data);
        return $data;
    }
}
