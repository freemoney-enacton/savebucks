<?php

namespace App\Filament\Affiliate\Resources\CampaignResource\Pages;

use App\Filament\Affiliate\Resources\CampaignResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Storage;


class CreateCampaign extends CreateRecord
{
    protected static string $resource = CampaignResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (isset($data['logo_url'])) {
            $data['logo_url'] = Storage::disk('frontend')->url($data['logo_url']);
        }    
        return $data;
    }
}
