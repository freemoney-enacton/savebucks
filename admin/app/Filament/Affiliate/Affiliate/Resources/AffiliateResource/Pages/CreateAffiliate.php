<?php

namespace App\Filament\Affiliate\Resources\AffiliateResource\Pages;

use App\Filament\Affiliate\Resources\AffiliateResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Hash;
use App\Mail\AffiliateWelcomeMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Filament\Notifications\Notification;
use Illuminate\Http\Request;

class CreateAffiliate extends CreateRecord
{
    protected static string $resource = AffiliateResource::class;

    public function mutateFormDataBeforeCreate(array $data): array
    {       

        //TODO: address_1 and address_2 save as json
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
                'bank_ifsc_bic_code'               => $data['bank_ifsc_bic_code'] ?? null,
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

        // Password handling
        $plain_password = $data['password_hash'] ?? null;

        if (isset($data['password_hash'])) {

            $data['password_hash'] = Hash::make($data['password_hash']);
            
            // Replace the 'y' with 'a' at the start of the hash
            if (substr($data['password_hash'], 0, 4) === '$2y$') {
                $data['password_hash'] = substr_replace($data['password_hash'], 'a', 2, 1);
            }
        } 

        $emailData = [
            'email'     => $data['email'],
            'name'      => $data['name'],
            'password'  => $plain_password, // Include plain password
            'type'      => 'welcome'
        ];

        try {
            Mail::to($data['email'])->send(new \App\Mail\AffiliateWelcomeMail($emailData));
        } catch (\Exception $e) {
            Log::error("Welcome email failed: {$e->getMessage()}");
        }

        return $data;
    }

}
