<?php

namespace App\Filament\Resources\FrontUserResource\Pages;

use App\Filament\Resources\FrontUserResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Mail;

class CreateFrontUser extends CreateRecord
{
    protected static string $resource = FrontUserResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $user_pass = $data['password'];
        $data['password'] = bcrypt($user_pass);
        $data['email_verified_at'] = now();
        Mail::to($data['email'])->send(new \App\Mail\WelcomeUser($data));
        return $data;
    }
}
