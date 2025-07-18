<?php

namespace App\Filament\Pages;

use AbanoubNassem\FilamentGRecaptchaField\Forms\Components\GRecaptcha;
use Filament\Pages\Page;

use \Filament\Pages\Auth\Login as BaseLoginPage;

class Login extends BaseLoginPage
{
    // protected function getForms(): array
    // {
    //     $formSchema = BaseLoginPage::getForms();
    //     $formSchema[] = [
    //         $this->getEmailFormComponent(),
    //         $this->getPasswordFormComponent(),
    //         $this->getRememberMeFormComponent(),
    //         GRecaptcha::make('g-recaptcha')
    //     ];

    //     return $formSchema;
    // }

    protected function getForms(): array
    {
        return [
            'form' => $this->form(
                $this->makeForm()
                    ->schema([
                        $this->getEmailFormComponent(),
                        $this->getPasswordFormComponent(),
                        $this->getRememberFormComponent(),
                        GRecaptcha::make('captcha'),
                    ])
                    ->statePath('data'),
            ),
        ];
    }
}
