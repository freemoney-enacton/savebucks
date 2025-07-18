<?php

namespace App\Filament\Resources\NetworkCouponResource\Pages;

use App\Filament\Resources\NetworkCouponResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditNetworkCoupon extends EditRecord
{
    protected static string $resource = NetworkCouponResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
