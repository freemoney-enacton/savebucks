<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;

use App\Models\User;
use App\Models\Country;
use Filament\Actions\Action;
use Filament\Forms\Form;
use Filament\Forms;
use Filament\Forms\Get;
use Filament\Notifications\Notification;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AdminProfile extends Page
{
    protected static string $view = 'filament.pages.admin-profile';

    protected static ?int $navigationSort = 3;
    protected static ?string $navigationGroup = "Super Admin Control";
    protected static ?string $navigationLabel = 'Admin Profile';
    protected static ?string $navigationIcon = 'heroicon-o-user-circle';
    protected static ?string $modelLabel = 'Admin Profile';

    public ?array $basicData = [];
    public ?array $passwordData = [];
    public $user;

    public function getHeading(): string
    {
        return __('Admin Profile');
    }

    public function mount(): void
    {
        $this->user = auth()->user();

        $basicData = [
            'email' => $this->user->email,
            'name' => $this->user->name,
        ];

        $this->editBasicForm->fill($basicData);
    }

    protected function getForms(): array
    {
        return [
            'editBasicForm',
            'editPasswordForm',
        ];
    }

    public function editBasicForm(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label(__('Name'))
                    ->validationAttribute(__('Name'))
                    ->placeholder(__('Enter name'))
                    ->required()
                    ->maxLength(255)
                    ->rule('regex:/^[a-zA-Z0-9\s]+$/'),
                Forms\Components\TextInput::make('email')
                    ->label(__('Email Address'))
                    ->validationAttribute(__('Email Address'))
                    ->placeholder(__('Enter Email Address'))
                    ->email()
                    ->maxLength(500)
                    ->disabled()
                    ->readonly()

            ])
            ->statePath('basicData');
    }


    public function editPasswordForm(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('current_password')
                    ->label(__('Current Password'))
                    ->validationAttribute(__('Current Password'))
                    ->placeholder(__('Enter Current Password'))
                    ->password()
                    ->revealable()
                    ->required()
                    ->currentPassword(),
                Forms\Components\TextInput::make('password')
                    ->label(__('New Password'))
                    ->validationAttribute(__('New Password'))
                    ->placeholder(__('Enter New Password'))
                    ->password()
                    ->revealable()
                    ->required()
                    ->rules([Password::min(8)->numbers()->symbols()])
                    ->confirmed()
                    ->hintIcon('heroicon-m-question-mark-circle', tooltip: __("The password must be 8+ characters with at least 1 number and 1 special character.")),
                Forms\Components\TextInput::make('password_confirmation')
                    ->label(__('Confirm Password'))
                    ->validationAttribute(__('Confirm Password'))
                    ->placeholder(__('Enter confirm password'))
                    ->required()
                    ->password()
                    ->revealable()
            ])
            ->statePath('passwordData');
    }

    public function editBasicFormAction()
    {
        return [
            Action::make('basicFormSubmit')
                ->label(__('Save'))
                ->submit('editBasicFormSave')
                ->livewireTarget('editBasicForm'),
        ];
    }

    public function editPasswordFormAction()
    {
        return [
            Action::make('passwordFormSubmit')
                ->label(__('Save'))
                ->submit('editPasswordFormSave')
        ];
    }

    public function basicFormSave()
    {
        $data = $this->editBasicForm->getState();

        $this->user->update([
            'name' => $data['name'],
        ]);
        $this->sendSaveSuccessNotification();
    }

    public function passwordFormSave()
    {
        $data = $this->editPasswordForm->getState();

        $this->user->update([
            'password' => Hash::make($data['password']),
        ]);

        $this->sendSaveSuccessNotification(__('Password Updated'));
    }

    public function hasFullWidthFormActions()
    {
        return false;
    }

    public function sendSaveSuccessNotification($title = null, $body = null): void
    {
        Notification::make()
            ->title($title ?? __("Profile Updated Successfully"))
            ->success()
            ->send();
    }
}
