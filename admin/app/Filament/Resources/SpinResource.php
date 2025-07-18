<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SpinResource\Pages;
use App\Filament\Resources\SpinResource\RelationManagers;
use App\Models\Spin;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class SpinResource extends Resource
{
    protected static ?string $model = Spin::class;

    protected static ?int $navigationSort = 3;
    protected static ?string $navigationGroup = "Rewards Settings";
    protected static ?string $navigationLabel = 'Spins';
    protected static ?string $navigationIcon = 'heroicon-o-stop-circle';
    protected static ?string $modelLabel = 'Spins';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('spin_details')
                    ->heading("Spin Details")
                    ->columns(2)
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('code')
                            ->required()
                            ->maxLength(255)
                            ->disabledOn('edit'),
                        Forms\Components\Toggle::make('variable_rewards')
                            ->helperText("Enable this to give user random amount between specified max and min value. After enabling this, save the page and refresh for configuration updates.")
                            ->required()
                            ->columnSpanFull(),
                        Forms\Components\Toggle::make('enabled')
                            ->required(),
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('code')
                    ->searchable(),
                Tables\Columns\ToggleColumn::make('enabled'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\ToggleColumn::make('variable_rewards'),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('enabled')
                    ->placeholder("All")
                    ->native(false),

                Tables\Filters\TernaryFilter::make('variable_rewards')
                    ->label("Variable Rewards")
                    ->placeholder("All"),

                    
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
            ])
            ->bulkActions([]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\ConfigurationsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSpins::route('/'),
            'create' => Pages\CreateSpin::route('/create'),
            'edit' => Pages\EditSpin::route('/{record}/edit'),
        ];
    }
}
