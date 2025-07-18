<?php

namespace App\Filament\Affiliate\Resources\CampaignResource\Pages;

use App\Filament\Affiliate\Resources\CampaignResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewCampaign extends ViewRecord
{
    protected static string $resource = CampaignResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }

    public function getBreadcrumbs(): array
    {
        return [];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        if (isset($data['logo_url'])) {
            $data['logo_url'] = pathinfo(parse_url($data['logo_url'], PHP_URL_PATH), PATHINFO_BASENAME);
        }
        return $data;
    }
}
