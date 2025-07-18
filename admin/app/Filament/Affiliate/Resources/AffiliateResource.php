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
use App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers\AffiliateCampaignGoalsRelationManager;
use App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers\ClicksRelationManager;
use App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers\PostbacksRelationManager;
use App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers\ConversionsRelationManager;


class AffiliateResource extends Resource
{
    protected static ?string $model = Affiliate::class;
    protected static ?int $navigationSort = 1;
    protected static ?string $navigationGroup = "Affiliate";
    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $modelLabel = 'Affiliate';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Basic Information')
                    ->description('Enter Affiliate basic information.')
                    ->columns(2)
                    ->schema([

                    Forms\Components\TextInput::make('name')
                        ->required()
                        ->maxLength(255),

                    Forms\Components\TextInput::make('email')
                        ->email()
                        ->prefixIcon('heroicon-m-envelope')
                        ->required()
                        ->maxLength(255),

                    Forms\Components\TextInput::make('password_hash')
                        ->password()
                        ->label("Password")
                        ->rules([Password::min(8)->numbers()->symbols()])
                        ->hintIcon('heroicon-m-question-mark-circle', tooltip: __("The password must be 8+ characters with at least 1 number and 1 special character."))
                        ->revealable()
                        ->required()
                        ->visibleOn('create')
                        ->maxLength(255),                 

                    Forms\Components\TextInput::make('paypal_address')
                        ->label("PayPal Address")
                        ->maxLength(255),             

                    Forms\Components\TextInput::make('tax_id')
                        ->label("Tax ID")
                        ->maxLength(255),

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
                        ->default('pending'),


                    // Forms\Components\TextInput::make('bank_details')
                    //     ->label("Bank Details"),

                    JsonColumn::make('bank_details')
                        ->label('Bank Details')
                        ->hintIcon('heroicon-o-question-mark-circle')
                        ->hintIconTooltip('Additional affiliates bank details.')
                        ->extraFieldWrapperAttributes([
                            'class' => 'category-block',
                        ])
                        ->editorOnly(),

                    // Forms\Components\TextInput::make('address')
                    //     ->label("Address"),

                    JsonColumn::make('address')
                        ->label('Address')
                        ->hintIcon('heroicon-o-question-mark-circle')
                        ->hintIconTooltip('Additional affiliates address details.')
                        ->extraFieldWrapperAttributes([
                            'class' => 'category-block',
                        ])
                        ->editorOnly(),

                ]),
            ]);
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
            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip("View")->size("lg"),
                Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("lg"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            AffiliateLinksRelationManager::class,
            PayoutsRelationManager::class,
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
