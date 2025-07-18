<?php

namespace App\Filament\Affiliate\Resources\AffiliateResource\Pages;

use App\Filament\Affiliate\Resources\AffiliateResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewAffiliate extends ViewRecord
{
    protected static string $resource = AffiliateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {  
        if (isset($data['address']) && !empty($data['address'])) {
            
            $addressData = is_array($data['address']) ? $data['address'] : json_decode($data['address'], true);

            if (is_array($addressData)) {
                $data['address_1']  = $addressData['address_1'] ?? null;
                $data['address_2']  = $addressData['address_2'] ?? null;
                $data['country']    = $addressData['country']   ?? null;
                $data['state']      = $addressData['state']     ?? null;
                $data['city']       = $addressData['city']      ?? null;
                $data['pincode']    = $addressData['pincode']   ?? null;
            }

            unset($data['address']);
        }

        // bank_details decode
        if (isset($data['bank_details']) && !empty($data['bank_details'])) {
            
            $bankData = is_array($data['bank_details']) ? $data['bank_details'] : json_decode($data['bank_details'], true);
    
            if (is_array($bankData)) {
              
                $data['bank_name'] = $bankData['bank_name'] ?? null;
                $data['bank_account_holder_name'] = $bankData['bank_account_holder_name'] ?? null;
                $data['bank_account_no'] = $bankData['bank_account_no'] ?? null;
                $data['bank_ifsc_bic_code'] = $bankData['bank_ifsc_bic_code'] ?? null;
                $data['bank_account_type'] = $bankData['bank_account_type'] ?? null;
                $data['bank_swift_code'] = $bankData['bank_swift_code'] ?? null;
            }

            // unset($data['bank_details']);
        }

        return $data;

    }
}
