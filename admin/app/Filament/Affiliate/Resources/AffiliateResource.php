<?php

namespace App\Filament\Affiliate\Resources;

use App\Filament\Affiliate\Resources\AffiliateResource\Pages;
use App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers;
use App\Models\Affiliate\Affiliate;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use ValentinMorice\FilamentJsonColumn\JsonColumn;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str;
use App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers\AffiliateLinksRelationManager;
use App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers\PayoutsRelationManager;
use App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers\AffiliateCampaignsRelationManager;
use App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers\AffiliateCampaignGoalsRelationManager;
use App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers\ClicksRelationManager;
use App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers\PostbacksRelationManager;
use App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers\ConversionsRelationManager;
use App\Models\Country;
use Filament\Tables\Actions\BulkAction;
use Illuminate\Database\Eloquent\Collection;


class AffiliateResource extends Resource
{
    protected static ?string $model = Affiliate::class;
    protected static ?int    $navigationSort = 1;
    protected static ?string $navigationGroup = "Affiliate";
    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $modelLabel = 'Affiliate';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Group::make()->schema([

                    Forms\Components\Section::make('Basic Information')
                        ->description('Enter Affiliate basic information.')
                        ->columns(2)
                        ->schema([

                            Forms\Components\TextInput::make('name')
                                ->required()
                                ->placeholder("Enter Name")
                                ->maxLength(255),

                            Forms\Components\TextInput::make('email')
                                ->email()
                                ->placeholder("Enter Email")
                                ->prefixIcon('heroicon-m-envelope')
                                ->required()
                                ->maxLength(255),

                            Forms\Components\TextInput::make('password_hash')
                                ->password()
                                ->label("Password")
                                ->rules([Password::min(8)->numbers()->symbols()])
                                ->hintIcon('heroicon-m-question-mark-circle', tooltip: __("The password must be 8+ characters with at least 1 number and 1 special character."))
                                ->revealable()
                                ->required(fn (string $operation): bool => $operation === 'create')
                                ->visibleOn('create')
                                ->maxLength(255),

                            Forms\Components\TextInput::make('paypal_address')
                                ->label("PayPal Address")
                                ->placeholder("Enter Paypal Account")
                                ->maxLength(255),

                            // Forms\Components\TextInput::make('tax_id')
                            //     ->label("Tax ID")
                            //     ->placeholder("Enter Tax Id")
                            //     ->maxLength(255),

                            Forms\Components\Radio::make('approval_status')
                                ->options([
                                    'pending'   => "Pending",
                                    'approved'  => "Approved",
                                    'rejected'  => "Rejected",
                                    'suspended' => "Suspended",
                                ])
                                ->inline()
                                ->inlineLabel(false)
                                ->label("Approval Status")
                                ->required()
                                ->columnSpanFull()
                                ->default('approved'),

                            Forms\Components\DatePicker::make('email_verified_at')
                                ->prefixicon("heroicon-o-calendar")
                                ->native(false)
                                ->label('Email Verified'),

                            Forms\Components\Toggle::make('is_email_verified')
                                ->inline(false)
                                ->label('Email Verified'),

                    ])->columnSpan(2),

                    Forms\Components\Section::make('Adress Details')
                        ->description('Enter Affiliate basic address details.')
                        ->columns(2)
                        ->schema([

                            Forms\Components\TextInput::make('address_1')
                                ->placeholder("Enter Your Address, e.g: B78, Street name")
                                ->label('Address Line-1')
                                ->columnSpan(2)
                                ->prefixIcon("heroicon-o-map-pin"),

                            Forms\Components\TextInput::make('address_2')
                                ->columnSpan(2)
                                ->placeholder("Enter Your Address, e.g: Nearby Area, City Name")
                                ->prefixIcon("heroicon-o-map-pin")
                                ->label('Address Line-2'),

                            Forms\Components\Select::make('country')
                                ->searchable()
                                ->preload()
                                ->options(Country::all()->pluck('name', 'code')->toArray())
                                ->label('Country')
                                ->placeholder("Select Country"),

                            Forms\Components\TextInput::make('state')
                                ->label('State')
                                ->maxLength(60)
                                ->placeholder("Enter State Name"),

                            Forms\Components\TextInput::make('city')
                                ->label('City')
                                ->maxLength(60)
                                ->placeholder("Enter City Name"),

                            Forms\Components\TextInput::make('pincode')
                                ->label('Pincode')
                                ->placeholder("Enter City Pincode"),

                    ])->columnSpan(2)->columns(2),

                ])->columnSpan(2)->columns(2),

                Forms\Components\Group::make()->schema([

                    Forms\Components\Section::make('Bank Information')
                        ->description('Enter basic bank information.')
                        ->columns(1)
                        ->schema([

                            Forms\Components\TextInput::make('bank_name')
                                ->placeholder("Enter Bank Name")
                                ->label('Bank Name')
                                ->validationMessages([
                                    'required_with' => 'Please provide all necessary bank details to complete the information.',
                                ])
                                ->requiredWith(['bank_account_holder_name', 'bank_account_no', 'bank_ifsc_bic_code', 'bank_account_type']),

                            Forms\Components\TextInput::make('bank_account_holder_name')
                                ->placeholder("Enter Account Holder's Name")
                                ->label('Account Holder Name')
                                ->validationMessages([
                                    'required_with' => 'Please provide all necessary bank details to complete the information.',
                                ])
                                ->requiredWith(['bank_name', 'bank_account_no', 'bank_ifsc_bic_code', 'bank_account_type']),

                            Forms\Components\TextInput::make('bank_account_no')
                                ->placeholder("Enter Bank Account Number")
                                ->label('Bank Account No')
                                ->validationMessages([
                                    'required_with' => 'Please provide all necessary bank details to complete the information.',
                                ])
                                ->requiredWith(['bank_name', 'bank_account_holder_name', 'bank_ifsc_bic_code', 'bank_account_type']),

                            Forms\Components\TextInput::make('bank_ifsc_bic_code')
                                ->placeholder("Enter Bank IFSC/BIC Code")
                                ->label('Bank IFSC/BIC Code')
                                ->validationMessages([
                                    'required_with' => 'Please provide all necessary bank details to complete the information.',
                                ])
                                ->requiredWith(['bank_name', 'bank_account_holder_name', 'bank_account_no', 'bank_account_type']),

                            Forms\Components\Select::make('bank_account_type')
                                ->placeholder("Select Bank Account Type")
                                ->options([
                                    'savings'    =>"Savings Account",
                                    'current'   => "Current Account",
                                    'checking'  => "Checking Account",
                                    'business'  => "Business Account",
                                ])
                                ->validationMessages([
                                    'required_with' => 'Please provide all necessary bank details to complete the information.',
                                ])
                                ->label('Account Type')
                                ->requiredWith(['bank_name', 'bank_account_holder_name', 'bank_account_no', 'bank_ifsc_bic_code']),

                            Forms\Components\TextInput::make('bank_swift_code')
                                ->placeholder("Enter Swift Code")
                                ->label('Swift Code(Optional)'),

                        ])->columnSpan(1),

                ])->columnSpan(1),

            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('name')
                    ->searchable(),

                Tables\Columns\TextColumn::make('email')
                    ->icon('heroicon-m-envelope')
                    ->iconcolor('primary')
                    ->searchable(),

                Tables\Columns\TextColumn::make('approval_status')
                    ->label("Approval Status")
                    ->badge()
                    ->formatStateUsing(fn($state) => Str::ucfirst($state))
                    ->color(fn($state) => match ($state) {
                        'pending'   => 'warning',
                        'approved'  => "success",
                        'rejected'  => "danger",
                        'suspended' => "gray",
                    })
                    ->searchable(),

                // Tables\Columns\TextColumn::make('paypal_address')
                //     ->label("PayPal Address")
                //     ->searchable(),

                // Tables\Columns\TextColumn::make('tax_id')
                //     ->label("Tax ID")
                //     ->searchable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label("Joined At")
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: false),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([

                Tables\Filters\SelectFilter::make('approval_status')
                    ->options([
                        'pending'   => "Pending",
                        'approved'  => "Approved",
                        'rejected'  => "Rejected",
                        'suspended' => "Suspended",
                    ])
                    ->preload()
                    ->searchable()
                    ->label('Status'),

                Tables\Filters\TernaryFilter::make('is_email_verified')
                    ->label("Email Verified Status")
                    ->placeholder("all"),

            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip("View")->size("lg"),
                Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("lg"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Tables\Actions\DeleteBulkAction::make(),
                ]),

                BulkAction::make('change_status')
                    ->label('Bulk Status Change')
                    ->icon('heroicon-o-check-circle')
                    ->modalWidth('lg')
                    ->form([
                        Forms\Components\Select::make('approval_status')
                        ->options([
                            'pending'   => "Pending",
                            'approved'  => "Approved",
                            'rejected'  => "Rejected",
                            'suspended' => "Suspended",
                        ]) 
                        ->preload()
                        ->searchable(),               
                    ])
                    ->action(function(Collection $records, array $data) {
                                               
                        Affiliate::whereIn('id', $records->pluck('id'))
                        ->update(['approval_status' => $data['approval_status']]);
                    })
                    ->deselectRecordsAfterCompletion()
                    ->button(),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            AffiliateLinksRelationManager::class,
            PayoutsRelationManager::class,
            AffiliateCampaignsRelationManager::class,
            AffiliateCampaignGoalsRelationManager::class,
            ClicksRelationManager::class,
            PostbacksRelationManager::class,
            ConversionsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAffiliates::route('/'),
            'create' => Pages\CreateAffiliate::route('/create'),
            'view' => Pages\ViewAffiliate::route('/{record}'),
            'edit' => Pages\EditAffiliate::route('/{record}/edit'),
        ];
    }
}
