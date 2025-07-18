<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TierResource\Pages;
use App\Filament\Resources\TierResource\RelationManagers;
use App\Models\Tier;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\Concerns\Translatable;

class TierResource extends Resource
{
    use Translatable;

    protected static ?string $model = Tier::class;

    protected static ?int $navigationSort = 2;
    protected static ?string $navigationGroup = "Settings";
    protected static ?string $navigationLabel = 'Tiers';
    protected static ?string $navigationIcon = 'heroicon-o-circle-stack';
    protected static ?string $modelLabel = 'Tiers';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('tier')
                    ->required()
                    ->numeric()
                    ->minValue(1),

                Forms\Components\TextInput::make('label')
                    ->required(),

                Forms\Components\FileUpload::make('icon')
                    ->image()
                    ->required()
                    ->columnSpanFull()
                    ->disk('frontend'),

                Forms\Components\TextInput::make('affiliate_commission')
                    ->required()
                    ->numeric()
                    ->suffix('%'),

                Forms\Components\TextInput::make('required_affiliate_earnings')
                    ->required()
                    ->numeric(),

                // Forms\Components\TextInput::make('required_affiliate_earnings_last_30_days')
                //     ->numeric(),
                
                Forms\Components\Toggle::make('enabled')
                    ->required()
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('tier')
                    ->searchable(),
                Tables\Columns\ImageColumn::make('icon'),
                Tables\Columns\TextColumn::make('affiliate_commission')
                    ->formatStateUsing(fn($state) => formatPercent($state)),
                Tables\Columns\TextColumn::make('required_affiliate_earnings')
                    ->formatStateUsing(fn($state) => formatCurrency($state)),
                Tables\Columns\IconColumn::make('enabled')
                    ->boolean(),
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
                Tables\Filters\TernaryFilter::make('enabled'),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("xl"),
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
            'index' => Pages\ListTiers::route('/'),
            // 'create' => Pages\CreateTier::route('/create'),
            // 'edit' => Pages\EditTier::route('/{record}/edit'),
        ];
    }
}
