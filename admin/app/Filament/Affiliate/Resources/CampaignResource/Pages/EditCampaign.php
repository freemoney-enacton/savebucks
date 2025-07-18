<?php

namespace App\Filament\Affiliate\Resources\CampaignResource\Pages;

use App\Filament\Affiliate\Resources\CampaignResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class EditCampaign extends EditRecord
{
    protected static string $resource = CampaignResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            // Actions\DeleteAction::make(),
        ];
    }

    public function getBreadcrumbs(): array
    {
        return [];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (isset($data['logo_url'])) {
            $data['logo_url'] = Storage::disk('frontend')->url($data['logo_url']);
        }    
        return $data;
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        if (isset($data['logo_url'])) {
            $data['logo_url'] = pathinfo(parse_url($data['logo_url'], PHP_URL_PATH), PATHINFO_BASENAME);
        }
        return $data;
    }
}
