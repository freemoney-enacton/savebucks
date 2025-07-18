<?php

namespace App\Filament\Affiliate\Resources\AffiliateResource\Pages;

use App\Filament\Affiliate\Resources\AffiliateResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Hash;

class CreateAffiliate extends CreateRecord
{
    protected static string $resource = AffiliateResource::class;

    public function mutateFormDataBeforeCreate(array $data): array
    {   
        dump($data);
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        dump($data);
        return $data;
    }
}
