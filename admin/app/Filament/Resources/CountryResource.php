<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CountryResource\Pages;
use App\Filament\Resources\CountryResource\RelationManagers;
use App\Jobs\GenerateSettingsConfig;
use App\Models\Country;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Components\Tab;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Http;

class CountryResource extends Resource
{
    protected static ?string $model = Country::class;

    protected static ?int $navigationSort = 6;
    protected static ?string $navigationGroup = "Settings";
    protected static ?string $navigationLabel = 'Countries';
    protected static ?string $navigationIcon = 'heroicon-o-globe-alt';
    protected static ?string $modelLabel = 'Country';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('code')
                    ->required()
                    ->maxLength(4),
                Forms\Components\TextInput::make('dial_code')
                    ->maxLength(255),
                Forms\Components\Toggle::make('is_enabled')
                    ->required(),
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
                Tables\Columns\ToggleColumn::make('is_enabled')
                    ->label('Enabled'),
                Tables\Columns\TextColumn::make('dial_code')
                    ->searchable(),
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
                Tables\Filters\TernaryFilter::make('is_enabled')->label('Enabled')->placeholder("All"),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->size("xl")->label("")->tooltip("Edit")
                    ->after(function () {
                        GenerateSettingsConfig::dispatch();
                        Http::get(config('app.api_url') . '/api/v1/cache/settings');
                    }),
                Tables\Actions\DeleteAction::make()->size("xl")->label("")->tooltip("Delete"),
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
            'index' => Pages\ManageCountries::route('/'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }
}
