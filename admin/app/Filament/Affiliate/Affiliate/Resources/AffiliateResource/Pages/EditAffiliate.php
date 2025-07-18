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

        //Adress save as json
        if (isset($data['address_1']) || isset($data['address_2']) || isset($data['country']) || isset($data['state']) || isset($data['city']) || isset($data['pincode'])) {

            $addressData = [
                'address_1' => $data['address_1']   ?? null,
                'address_2' => $data['address_2']   ?? null,
                'country'   => $data['country']     ?? null,
                'state'     => $data['state']       ?? null,
                'city'      => $data['city']        ?? null,
                'pincode'   => $data['pincode']     ?? null,
            ];
           
            $data['address'] = json_encode($addressData);
            unset($data['address_1'], $data['address_2'], $data['country'], $data['state'], $data['city'], $data['pincode']);
        }

        //BANK DEtails : Save as Json
        if (isset($data['bank_name']) || isset($data['bank_account_holder_name']) || isset($data['bank_account_no']) || isset($data['bank_ifsc_bic_code']) || isset($data['bank_account_type'])) {
            
            $bankData = [
                'bank_name'                 => $data['bank_name'] ?? null,
                'bank_account_holder_name'  => $data['bank_account_holder_name'] ?? null,
                'bank_account_no'           => $data['bank_account_no'] ?? null,
                'bank_ifsc_bic_code'        => $data['bank_ifsc_bic_code'] ?? null,
                'bank_account_type'         => $data['bank_account_type'] ?? null,
                'bank_swift_code'           => $data['bank_swift_code'] ?? null,
            ];
            
            $data['bank_details'] = json_encode($bankData);
            
            unset(
                $data['bank_name'], 
                $data['bank_account_holder_name'], 
                $data['bank_account_no'], 
                $data['bank_ifsc_bic_code'], 
                $data['bank_account_type'], 
                $data['bank_swift_code']
            );
        }

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
