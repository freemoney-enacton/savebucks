<?php

namespace App\Filament\Resources\NetworkCouponResource\Pages;

use App\Filament\Resources\NetworkCouponResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListNetworkCoupons extends ListRecords
{
    protected static string $resource = NetworkCouponResource::class;
    protected ?string $subheading = 'List of Network Coupons manage here,';


    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
