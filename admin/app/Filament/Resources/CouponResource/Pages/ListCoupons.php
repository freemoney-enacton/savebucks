<?php

namespace App\Filament\Resources\CouponResource\Pages;

use App\Filament\Resources\CouponResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListCoupons extends ListRecords
{
    protected static string $resource = CouponResource::class;
    protected ?string $subheading = "List of Counpons to manage here";

    use ListRecords\Concerns\Translatable;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            null        => Tab::make('All'),
            'draft'     => Tab::make()->query(fn ($query) => $query->where('status', 'draft')),
            'publish'   => Tab::make()->query(fn ($query) => $query->where('status', 'publish')),
            'trash'     => Tab::make()->query(fn ($query) => $query->where('status', 'trash')),
        ];
    }
}
