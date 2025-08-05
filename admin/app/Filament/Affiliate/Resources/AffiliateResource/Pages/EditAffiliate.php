<?php

namespace App\Filament\Affiliate\Resources\AffiliateResource\Pages;

use App\Filament\Affiliate\Resources\AffiliateResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Hash;

class EditAffiliate extends EditRecord
{
    protected static string $resource = AffiliateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            // Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {   

         // Handle Address Data - Always create array even if empty
        $addressData = [
            'address_1' => $data['address_1'] ?? null,
            'address_2' => $data['address_2'] ?? null,
            'country'   => $data['country'] ?? null,
            'state'     => $data['state'] ?? null,
            'city'      => $data['city'] ?? null,
            'pincode'   => $data['pincode'] ?? null,
        ];
        
        // Only set address JSON if at least one field has a value
        if (array_filter($addressData)) {
            $data['address'] = json_encode($addressData);
        }
        
        // Always unset individual address fields
        unset($data['address_1'], $data['address_2'], $data['country'], $data['state'], $data['city'], $data['pincode']);

        // Handle Bank Details - Always create array even if empty
        $bankData = [
            'bank_name'                 => $data['bank_name'] ?? null,
            'bank_account_holder_name'  => $data['bank_account_holder_name'] ?? null,
            'bank_account_no'           => $data['bank_account_no'] ?? null,
            'bank_ifsc_bic_code'        => $data['bank_ifsc_bic_code'] ?? null,
            'bank_account_type'         => $data['bank_account_type'] ?? null,
            'bank_swift_code'           => $data['bank_swift_code'] ?? null,
        ];

        // Only set bank_details JSON if at least one field has a value
        if (array_filter($bankData)) {
            $data['bank_details'] = json_encode($bankData);
        }
        
        // Always unset individual bank fields
        unset(
            $data['bank_name'],
            $data['bank_account_holder_name'],
            $data['bank_account_no'],
            $data['bank_ifsc_bic_code'],
            $data['bank_account_type'],
            $data['bank_swift_code']
        );


        //Password Hash
        if (isset($data['password_hash']) && !empty($data['password_hash'])) {
            // Create the password hash
            $data['password_hash'] = Hash::make($data['password_hash']);
            
            // Replace the 'y' with 'a' at the start of the hash
            if (substr($data['password_hash'], 0, 4) === '$2y$') {
                $data['password_hash'] = substr_replace($data['password_hash'], 'a', 2, 1);
            }
        } else {
            unset($data['password_hash']);
        }

        // dump($data);

        return $data;
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {       
        // dump($data);

        //adress decode
        if (isset($data['address']) && !empty($data['address']) ) {
            
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
              
                $data['bank_name']                  = $bankData['bank_name'] ?? null;
                $data['bank_account_holder_name']   = $bankData['bank_account_holder_name'] ?? null;
                $data['bank_account_no']            = $bankData['bank_account_no'] ?? null;
                $data['bank_ifsc_bic_code']         = $bankData['bank_ifsc_bic_code'] ?? null;
                $data['bank_account_type']          = $bankData['bank_account_type'] ?? null;
                $data['bank_swift_code']            = $bankData['bank_swift_code'] ?? null;
            }

            // unset($data['bank_details']);
        }

        return $data;
    }
}
