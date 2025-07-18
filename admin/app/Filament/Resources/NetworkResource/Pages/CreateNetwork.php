<?php

namespace App\Filament\Resources\NetworkResource\Pages;

use App\Filament\Resources\NetworkResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateNetwork extends CreateRecord
{
    protected static string $resource = NetworkResource::class;
    use CreateRecord\Concerns\Translatable;

    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make(),
            // ...
        ];
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (isset($data['logo'])) {
            $filename = $data['logo'];
            $data['logo'] =  \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
        }

        if (isset($data['icon'])) {
            $filename = $data['icon'];
            $data['icon'] =  \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
        }
        return $data;
    }
}
