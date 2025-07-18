<?php

namespace App\Filament\Resources\PaymentTypeResource\Pages;

use App\Filament\Resources\PaymentTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListPaymentTypes extends ListRecords
{
    use ListRecords\Concerns\Translatable;
    protected static string $resource = PaymentTypeResource::class;
    protected ?string $subheading = 'List of Payment Types which will be used for user payments';
    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }
}
