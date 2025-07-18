<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CurrencyResource\Pages;
use App\Filament\Resources\CurrencyResource\RelationManagers;
use App\Jobs\GenerateSettingsConfig;
use App\Models\Currency;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\QueryBuilder\Constraints\BooleanConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\NumberConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\SelectConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;
use Filament\Tables\Table;
use Filament\Actions\StaticAction;


class CurrencyResource extends Resource
{
    protected static ?string $model = Currency::class;

    protected static ?int $navigationSort = 6;
    protected static ?string $navigationGroup = "Settings";
    protected static ?string $navigationLabel = 'Currencies';
    protected static ?string $navigationIcon = 'heroicon-o-banknotes';
    protected static ?string $modelLabel = 'Currency';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('iso_code')
                    ->label('ISO Code')
                    ->hintIcon('heroicon-o-information-circle')
                    ->hintIconTooltip('ISO 4217. e.g. USD, EUR, etc.')
                    ->extraFieldWrapperAttributes([
                        'class' => 'category-block',
                    ])
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('symbol')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('conversion_rate')
                    ->label('Conversion Rate')
                    ->required()
                    ->numeric()
                    ->hintIcon('heroicon-o-information-circle')
                    ->hintIconTooltip('Conversion rate in base currency. e.g. 1 USD = 0.93 EUR.')
                    ->extraFieldWrapperAttributes([
                        'class' => 'category-block',
                    ]),
                Forms\Components\Toggle::make('enabled')
                    ->default(1)
                    ->required(),
                Forms\Components\Radio::make('symbol_position')
                    ->label('Symbol Position')
                    ->default('prefix')
                    ->options([
                        'prefix' => 'Prefix',
                        'suffix' => 'Suffix',
                    ])
                    ->required()->inline(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('iso_code')
                    ->label('ISO Code')
                    ->searchable(),
                Tables\Columns\TextColumn::make('symbol')
                    ->searchable(),
                Tables\Columns\TextColumn::make('conversion_rate')
                    ->label('Conversion Rate'),
                Tables\Columns\ToggleColumn::make('enabled'),
                Tables\Columns\TextColumn::make('symbol_position')
                    ->label('Display As')
                    ->badge(),
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

                Tables\Filters\SelectFilter::make('symbol_position')
                    ->label('Symbol Position')
                    ->preload()
                    ->searchable()
                    ->options([
                        'prefix' => 'Prefix',
                        'suffix' => 'Suffix',
                    ])
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->label("")->tooltip("Edit")->size('xl')
                    ->extraModalFooterActions(fn (): array => [
                        Tables\Actions\Action::make('delete')->icon('heroicon-o-trash')->color('danger')
                            ->requiresConfirmation()
                            ->action(function (Currency $record) {
                                $record->delete();
                            })
                            ->cancelParentActions()

                    ])
                    ->after(function () {
                        GenerateSettingsConfig::dispatch();
                        \Http::get(config('app.api_url') . '/api/v1/cache/settings');
                    })
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageCurrencies::route('/'),
        ];
    }
}
