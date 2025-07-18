<?php

namespace App\Filament\Resources;

use Filament\Forms;
use Filament\Tables;
use App\Models\Country;
use Filament\Forms\Form;
use Filament\Tables\Table;
use App\Models\PaymentType;
use Filament\Resources\Resource;
use Illuminate\Support\Facades\Config;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Filament\Resources\Concerns\Translatable;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Filament\Resources\PaymentTypeResource\Pages;
use App\Filament\Resources\PaymentTypeResource\RelationManagers;

class PaymentTypeResource extends Resource
{
    use Translatable;

    protected static ?string $model = PaymentType::class;

    protected static ?int $navigationSort = 3;
    protected static ?string $navigationGroup = "Settings";
    protected static ?string $navigationLabel = 'Payment Types';
    protected static ?string $navigationIcon = 'heroicon-o-credit-card';
    protected static ?string $modelLabel = 'Payment Types';

    public static int $paymentMethodInputCount = 0;

    public static function form(Form $form): Form
    {
        return $form
            ->columns(3)
            ->schema([
                Forms\Components\Section::make('Basic Details')
                    ->columns(3)
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\Textarea::make('description')
                            ->maxLength(255),

                        Forms\Components\TextInput::make('code')
                            ->required()
                            ->unique(PaymentType::class, 'code', fn (?PaymentType $record) => $record)
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('Code must be unique without spaces, its used for internal use')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->maxLength(255),

                        Forms\Components\TextInput::make('payment_group')
                            ->maxLength(255),

                        Forms\Components\Select::make('account_input_type')
                            ->label('Account Input Type')
                            ->required()
                            ->options([
                                'text' => 'Text',
                                'number' => 'Number',
                                'email' => 'Email',
                            ])->default('text'),

                        Forms\Components\TextInput::make('account_input_label')
                            ->label('Account Input Label')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('account_input_hint')
                            ->label('Account Input Hint')
                            ->nullable()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('minimum_amount')
                            ->label('Minimum Amount')
                            ->numeric()
                            ->default(0)
                            ->required()
                            ->minValue(0),

                        Forms\Components\Toggle::make('enabled')
                            ->label('Enabled')
                            ->default(0)
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('Is this payment type enabled')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->inline()
                            ->inlineLabel(false),

                        Forms\Components\FileUpload::make('image')
                            ->image()
                            ->required()
                            ->columnSpanFull()
                            ->disk('frontend'),

                        Forms\Components\FileUpload::make('card_image')
                            ->image()
                            ->columnSpanFull()
                            ->disk('frontend'),

                        Forms\Components\FileUpload::make('icon')
                            ->image()
                            ->columnSpanFull()
                            ->disk('frontend'),
                    ]),

                Forms\Components\Section::make('Fees')
                    ->columns(3)
                    ->schema([

                        Forms\Components\Toggle::make('transaction_fees_allowed')
                            ->label('Transaction Fees')
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('it will be deducted from transaction amount')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->live()
                            ->default(0),

                        Forms\Components\Select::make('transaction_fees_type')
                            ->required(fn (\Filament\Forms\Get $get): bool => $get('transaction_fees_allowed'))
                            ->default('fixed')
                            ->label('Transaction Fees Type')
                            ->options([
                                'fixed' => 'Fixed',
                                'percent' => 'Percent',
                            ])
                            ->visible(fn (\Filament\Forms\Get $get): bool => $get('transaction_fees_allowed')),

                        Forms\Components\TextInput::make('transaction_fees_amount')
                            ->required(fn (\Filament\Forms\Get $get): bool => $get('transaction_fees_allowed'))
                            ->label('Transaction Fees Amount')
                            ->visible(fn (\Filament\Forms\Get $get): bool => $get('transaction_fees_allowed')),
                    ]),

                Forms\Components\Section::make('Bonus')
                    ->columns(3)
                    ->schema([

                        Forms\Components\Toggle::make('transaction_bonus_allowed')
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('it will be added to transaction amount')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->label('Transaction Bonus')
                            ->default(0)->live(),

                        Forms\Components\Select::make('transaction_bonus_type')
                            ->label('Transaction Bonus Type')
                            ->required(fn (\Filament\Forms\Get $get): bool => $get('transaction_bonus_allowed'))
                            ->options([
                                'fixed' => 'Fixed',
                                'percent' => 'Percent',
                            ])->visible(fn (\Filament\Forms\Get $get): bool => $get('transaction_bonus_allowed')),

                        Forms\Components\TextInput::make('transaction_bonus_amount')
                            ->label('Transaction Bonus Amount')
                            ->required(fn (\Filament\Forms\Get $get): bool => $get('transaction_bonus_allowed'))
                            ->numeric()
                            ->visible(fn (\Filament\Forms\Get $get): bool => $get('transaction_bonus_allowed'))
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('Amount will be in ' . config('freemoney.currencies.default'))
                            ->default(null),

                    ]),

                Forms\Components\Section::make('Conversion Rate & Country Customization')
                    ->columns()
                    ->schema([
                        Forms\Components\Toggle::make('cashback_allowed')
                            ->label('Cashback Allowed')
                            ->default(0)
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->visible(false)
                            ->hintIconTooltip('Is cashback allowed for this payment type')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ]),

                        Forms\Components\Toggle::make('bonus_allowed')
                            ->label('Bonus Allowed')
                            ->default(0)
                            ->visible(false)
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('Is bonus allowed for this payment type')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ]),

                        Forms\Components\Toggle::make('conversion_enabled')
                            ->label('Conversion rate Enabled')
                            ->default(0)
                            ->live()
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('Is conversion rate enabled for this payment type')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ]),

                        Forms\Components\TextInput::make('conversion_rate')
                            ->label('Conversion Rate')
                            ->visible(fn (\Filament\Forms\Get $get): bool => $get('conversion_enabled'))
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('this will be multiplied with transaction amount')
                            ->required(fn (\Filament\Forms\Get $get): bool => $get('conversion_enabled')),

                        Forms\Components\Toggle::make('country_customizable')
                            ->default(0)
                            ->name('country_customizable')
                            ->label('Country Customizable')
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('Is this payment type country customizable')
                            ->extraFieldWrapperAttributes(['class' => 'category-block'])
                            ->columnSpanFull()
                            ->live(),

                        Forms\Components\Repeater::make('country_configuration')
                            ->name('country_configuration')
                            ->required(fn (Forms\Get $get): bool => $get('country_customizable'))
                            ->columns(1)
                            ->visible(fn (\Filament\Forms\Get $get): bool => $get('country_customizable'))
                            ->columnSpanFull()
                            ->defaultItems(2)
                            ->schema([
                                Forms\Components\Select::make('country_code')
                                    ->label('Country')
                                    ->options(Country::where('is_enabled', 1)->get()->pluck('name', 'code')->toArray())
                                    ->disableOptionsWhenSelectedInSiblingRepeaterItems()
                                    ->searchable()
                                    ->afterStateUpdated(function (string $operation, $state, Forms\Set $set) {
                                        $set('currency_code', \App\Models\Country::where('code', $state)->first()->currency);
                                    }),

                                    Forms\Components\Hidden::make('currency_code'),

                                    Forms\Components\Repeater::make('payout_amounts')
                                        ->label('Payout Amounts')
                                        ->columns(2)
                                        ->required()
                                        ->schema([
                                            Forms\Components\TextInput::make('payable_amount')
                                                ->label('Payable Amount')
                                                ->numeric()
                                                ->required()
                                                ->minValue(0),

                                            Forms\Components\TextInput::make('receivable_amount')
                                                ->label('Receivable Amount')
                                                ->numeric()
                                                ->required()
                                                ->minValue(0),
                                        ]),

                                    Forms\Components\Toggle::make('enabled')
                                        ->inline(false)
                                        ->inlineLabel(false)
                                        ->default(1),
                            ]),
                    ]),

                Forms\Components\Section::make('Payment method inputs')
                    ->schema([
                        Forms\Components\Repeater::make('payment_inputs')
                            // ->label('')
                            ->columns(3)
                            ->maxItems(3)
                            ->addActionLabel('Add payment method input')
                            ->itemLabel(function (): string {
                                $index = ++static::$paymentMethodInputCount;
                                return "Payment method $index";
                            })
                            ->schema([
                                Forms\Components\Radio::make('type')
                                    ->inline()
                                    ->inlineLabel(false)
                                    ->required()
                                    ->default('text')
                                    ->options([
                                        'text' => 'Text',
                                        'number' => 'Number',
                                        'select' => 'Select',
                                        'email' => 'Email',
                                    ]),
                                Forms\Components\TextInput::make('key')
                                    ->required(),
                                Forms\Components\TextInput::make('label'),
                                Forms\Components\TagsInput::make('options')
                                    // ->splitKeys([','])
                                    ->separator(','),
                                Forms\Components\TextInput::make('placeholder'),
                                Forms\Components\Toggle::make('required'),
                            ]),
                    ]),
            ]);
    }

    public static function canDeleteAny(): bool
    {
        return false;
    }

    public static function canDelete(Model $record): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                // Tables\Columns\TextColumn::make('code')
                //     ->searchable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('payment_group')
                    ->searchable(),
                // Tables\Columns\ImageColumn::make('image'),
                // Tables\Columns\TextColumn::make('account_input_type')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('account_input_label')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('account_input_hint')
                //     ->searchable(),
                Tables\Columns\TextColumn::make('minimum_amount')
                    ->label('Minimum Amount')
                    ->numeric()
                    ->money(config('freemoney.currencies.default'))
                    ->sortable(),
                // Tables\Columns\TextColumn::make('transaction_fees_amount')
                //     ->numeric()
                //     ->sortable(),
                // Tables\Columns\TextColumn::make('transaction_fees_type'),
                // Tables\Columns\TextColumn::make('transaction_bonus_amount')
                //     ->numeric()
                //     ->sortable(),
                // Tables\Columns\TextColumn::make('transaction_bonus_type'),
                Tables\Columns\ToggleColumn::make('enabled'),
                Tables\Columns\IconColumn::make('cashback_allowed')
                    ->label('Cashback Allowed')
                    ->boolean()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\IconColumn::make('bonus_allowed')
                    ->label('Bonus Allowed')
                    ->boolean()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('enabled')
                    ->placeholder("All"),

                Tables\Filters\TernaryFilter::make('transaction_bonus_allowed')
                    ->label("Transaction Bonus Allowed")
                    ->placeholder("All"),
                
                Tables\Filters\SelectFilter::make('transaction_bonus_type')                 
                    ->label('Transaction Bonus Type') 
                    ->preload()
                    ->searchable()                
                    ->options([
                        'fixed' => 'Fixed',
                        'percent' => 'Percent',
                    ]),

                Tables\Filters\TernaryFilter::make('transaction_fees_allowed')
                    ->label("Transaction Fees Allowed")
                    ->placeholder("All"),

                Tables\Filters\SelectFilter::make('transaction_fees_type')                 
                    ->label('Transaction Fees Type') 
                    ->preload()
                    ->searchable()                
                    ->options([
                        'fixed' => 'Fixed',
                        'percent' => 'Percent',
                    ]),

                    
                Tables\Filters\TernaryFilter::make('conversion_enabled')
                    ->label("Conversion Enabled")
                    ->placeholder("All"),

                Tables\Filters\TernaryFilter::make('country_customizable')
                    ->label("Country Customizable")
                    ->placeholder("All"),   

            ])->filtersFormColumns(2)
            ->actions([
                Tables\Actions\EditAction::make()->label('')->tooltip('Edit')->size('xl'),
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
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPaymentTypes::route('/'),
            'create' => Pages\CreatePaymentType::route('/create'),
            'edit' => Pages\EditPaymentType::route('/{record}/edit'),
        ];
    }
}
