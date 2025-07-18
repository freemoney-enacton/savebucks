<?php

namespace App\Filament\Resources\AffiliateCouponCategoryResource\Pages;

use App\Filament\Resources\AffiliateCouponCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditAffiliateCouponCategory extends EditRecord
{
    protected static string $resource = AffiliateCouponCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
