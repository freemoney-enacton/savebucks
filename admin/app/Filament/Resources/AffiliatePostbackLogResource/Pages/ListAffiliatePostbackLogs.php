<?php

namespace App\Filament\Resources\AffiliatePostbackLogResource\Pages;

use App\Filament\Resources\AffiliatePostbackLogResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListAffiliatePostbackLogs extends ListRecords
{
    protected static string $resource = AffiliatePostbackLogResource::class;
    protected ?string $subheading = 'List of Postback logs manage here,';

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
