<?php

namespace App\Filament\Resources\AffiliateCouponCategoryResource\Pages;

use App\Filament\Resources\AffiliateCouponCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListAffiliateCouponCategories extends ListRecords
{
    protected static string $resource = AffiliateCouponCategoryResource::class;
    protected ?string $subheading = 'List of network coupon categories manage here';


    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
