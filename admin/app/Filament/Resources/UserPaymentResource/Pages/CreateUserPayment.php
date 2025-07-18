<?php

namespace App\Filament\Resources\UserPaymentResource\Pages;

use App\Filament\Resources\UserPaymentResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateUserPayment extends CreateRecord
{
    protected static string $resource = UserPaymentResource::class;
}
