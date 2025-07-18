<?php

namespace App\Filament\Resources;

use App\Enums\LeaderboardFrequency;
use App\Filament\Resources\LeaderboardSettingResource\Pages;
use App\Filament\Resources\LeaderboardSettingResource\RelationManagers;
use App\Filament\Resources\LeaderboardSettingResource\RelationManagers\RunsRelationManager;
use App\Models\LeaderboardSetting;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\Concerns\Translatable;

class LeaderboardSettingResource extends Resource
{
    use Translatable;
    protected static ?string $model = LeaderboardSetting::class;

    protected static ?int $navigationSort = 1;
    protected static ?string $navigationGroup = "Leaderboards";
    protected static ?string $navigationLabel = 'Leaderboard';
    protected static ?string $navigationIcon = 'heroicon-o-trophy';
    protected static ?string $modelLabel = 'Leaderboard';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make("Leaderboard Detals")
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('code')
                            ->maxLength(255)
                            ->disabledOn('edit'),
                        Forms\Components\TextInput::make('prize')
                            ->required()
                            ->numeric(),
                        Forms\Components\TextInput::make('users')
                            ->required()
                            ->numeric()
                            ->default(0),
                        Forms\Components\Select::make('frequency')
                            ->options(LeaderboardFrequency::class)
                            ->required(),
                        // Forms\Components\Toggle::make('is_enabled')
                        //     ->inline(false)
                        //     ->inlineLabel(false),
                    ])
                    ->columns(2)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('frequency')
                    ->badge(),
                // Tables\Columns\ToggleColumn::make('is_enabled'),
                Tables\Columns\TextColumn::make('prize')
                    ->formatStateUsing(fn($state) => formatCurrency($state)),
                Tables\Columns\TextColumn::make('users')
                    ->formatStateUsing(fn($state) => formatNumber($state)),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('code')
                    ->searchable()
                    ->badge(),
            ])
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->size("xl")->tooltip("Edit"),
            ])
            ->bulkActions([]);
    }

    public static function getRelations(): array
    {
        return [
            RunsRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLeaderboardSettings::route('/'),
            'create' => Pages\CreateLeaderboardSetting::route('/create'),
            'edit' => Pages\EditLeaderboardSetting::route('/{record}/edit'),
        ];
    }
}
