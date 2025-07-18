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

        // Handle Password
        $plain_password = $data['password_hash'] ?? null;

        if (isset($data['password_hash'])) {
            $data['password_hash'] = Hash::make($data['password_hash']);

            // Replace the 'y' with 'a' at the start of the hash
            if (substr($data['password_hash'], 0, 4) === '$2y$') {
                $data['password_hash'] = substr_replace($data['password_hash'], 'a', 2, 1);
            }
        }

        // Send Welcome Email
        if (isset($data['email']) && isset($data['name'])) {
            $emailData = [
                'email'     => $data['email'],
                'name'      => $data['name'],
                'password'  => $plain_password,
                'type'      => 'welcome'
            ];

            try {
                Mail::to($data['email'])->send(new \App\Mail\AffiliateWelcomeMail($emailData));
            } catch (\Exception $e) {
                Log::error("Welcome email failed: {$e->getMessage()}");
            }
        }

        return $data;
    }
}