<?php

namespace App\Filament\Resources;

use App\Enums\RewardType;
use App\Filament\Resources\StreakConfigurationResource\Pages;
use App\Filament\Resources\StreakConfigurationResource\RelationManagers;
use App\Models\Spin;
use App\Models\StreakConfiguration;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class StreakConfigurationResource extends Resource
{
    protected static ?string $model = StreakConfiguration::class;

    protected static ?int $navigationSort = 5;
    protected static ?string $navigationGroup = "Rewards Settings";
    protected static ?string $navigationLabel = 'Streaks';
    protected static ?string $navigationIcon = 'heroicon-o-bars-arrow-up';
    protected static ?string $modelLabel = 'Streaks';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('day')
                    ->required()
                    ->numeric(),
                Forms\Components\Radio::make('reward_type')
                    ->options(RewardType::class)
                    ->required()
                    ->inline()
                    ->inlineLabel(false)
                    ->live(),
                Forms\Components\Select::make('spin_code')
                    ->options(Spin::get())
                    ->native(false)
                    ->searchable()
                    ->preload()
                    ->visible(fn(Get $get) => $get('reward_type') == RewardType::Spin->value),
                Forms\Components\TextInput::make('amount')
                    ->required()
                    ->numeric()
                    ->infotip("The amount user will recieve as bonus. If spin is selected, enter the upto amount to which user will earn bonus."),
                Forms\Components\Toggle::make('enabled')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('day')
                    ->numeric()
                    ->sortable()
                    ->prefix("Day "),
                Tables\Columns\TextColumn::make('amount')
                    ->numeric()
                    ->formatStateUsing(fn($state) => formatCurrency($state))
                    ->sortable(),
                Tables\Columns\TextColumn::make('reward_type')
                    ->badge(),
                // Tables\Columns\TextColumn::make('spin_code')
                //     ->searchable(),
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
                    ->placeholder("All"),

                Tables\Filters\SelectFilter::make('reward_type')
                    ->label("Reward Type")
                    ->options(RewardType::class),   

                Tables\Filters\SelectFilter::make('spin_code')
                    ->label("Spin Code")
                    ->options(Spin::get())       
                    ->searchable()
                    ->preload()
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

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageStreakConfigurations::route('/'),
        ];
    }
}
