<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DailyBonusLadderConfigurationResource\Pages;
use App\Filament\Resources\DailyBonusLadderConfigurationResource\RelationManagers;
use App\Models\DailyBonusLadderConfiguration;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class DailyBonusLadderConfigurationResource extends Resource
{
    protected static ?string $model = DailyBonusLadderConfiguration::class;

    protected static ?int $navigationSort = 4;
    protected static ?string $navigationGroup = "Rewards Settings";
    protected static ?string $navigationLabel = 'Daily Ladder';
    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';
    protected static ?string $modelLabel = 'Daily Ladder';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('step')
                    ->required()
                    ->numeric()
                    ->prefix("Step "),
                Forms\Components\Toggle::make('enabled')
                    ->required()
                    ->inline(false)
                    ->inlineLabel(false),
                Forms\Components\TextInput::make('amount')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('probability')
                    ->required()
                    ->numeric()
                    ->minValue(0)
                    ->maxValue(100)
                    ->suffix("%"),
                // Forms\Components\TextInput::make('icon')
                //     ->maxLength(255),
                // Forms\Components\TextInput::make('bg_color')
                //     ->maxLength(255),
                // Forms\Components\TextInput::make('active_color')
                //     ->maxLength(255),
                // Forms\Components\TextInput::make('title')
                //     ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('step')
                    ->numeric()
                    ->sortable()
                    ->prefix("Step"),

                Tables\Columns\TextColumn::make('amount')
                    ->numeric()
                    ->sortable()
                    ->formatStateUsing(fn($state) => formatCurrency($state)),

                Tables\Columns\TextColumn::make('probability')
                    ->numeric()
                    ->sortable()
                    ->formatStateUsing(fn($state) => formatPercent($state)),

                // Tables\Columns\TextColumn::make('icon')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('bg_color')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('active_color')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('title')
                //     ->searchable(),

                Tables\Columns\IconColumn::make('is_default_step')
                    ->label("Is Default Step")
                    ->state(fn(DailyBonusLadderConfiguration $record) => $record->step == config('freemoney.default.default_ladder_step'))
                    ->boolean(),               

                Tables\Columns\ToggleColumn::make('enabled'),

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
                    ->native(false),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
            ])
            ->bulkActions([]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    // public static function getPages(): array
    // {
    //     return [
    //         'index' => Pages\ListDailyBonusLadderConfigurations::route('/'),
    //         'create' => Pages\CreateDailyBonusLadderConfiguration::route('/create'),
    //         'edit' => Pages\EditDailyBonusLadderConfiguration::route('/{record}/edit'),
    //     ];
    // }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageDailyBonusLadderConfigurations::route('/'),
        ];
    }
}
