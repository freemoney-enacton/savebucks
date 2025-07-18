<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EarningByStoreResource\Pages;
use App\Filament\Resources\EarningByStoreResource\RelationManagers;
use App\Models\EarningByStore;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Actions\ExportAction;
use App\Filament\Exports\EarningByStoreExporter;
use Filament\Actions\Exports\Enums\ExportFormat;
use Filament\Resources\Concerns\Translatable;

class EarningByStoreResource extends Resource
{
    use Translatable;

    protected static ?string $model = EarningByStore::class;
    protected static ?string $navigationIcon = 'heroicon-o-building-storefront';
    protected static ?string $navigationLabel = 'Earnings By Stores';
    protected static ?string $navigationGroup = 'Reports & Logs';
    protected static ?int $navigationSort = 2;


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')                   
                    ->required(),
                Forms\Components\TextInput::make('homepage')
                    ->required()
                    ->maxLength(500),
                Forms\Components\TextInput::make('visits')
                    ->required()
                    ->numeric()
                    ->default(0),
                Forms\Components\TextInput::make('offers_count')
                    ->required()
                    ->numeric()
                    ->default(0),
                Forms\Components\TextInput::make('status')
                    ->required(),
                Forms\Components\TextInput::make('total_sales')
                    ->required()
                    ->numeric()
                    ->default(0.000),
                Forms\Components\TextInput::make('total_commission')
                    ->required()
                    ->numeric()
                    ->default(0.000),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('id')
                    ->label('Store ID')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('name')
                    ->limit(30)
                    ->tooltip(fn($state) => $state)
                    ->searchable(),

                Tables\Columns\TextColumn::make('homepage')
                    ->limit(22)
                    ->url(fn($state) => $state ?? "#")
                    ->openUrlInNewTab()
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->tooltip(fn($state) => $state)
                    ->searchable(),

                Tables\Columns\TextColumn::make('visits')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('offers_count')
                    ->label('Offers Count')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status'),

                Tables\Columns\TextColumn::make('total_sales')
                    ->label("Total Sales")
                    ->numeric()
                    ->alignCenter()
                    ->sortable(),

                Tables\Columns\TextColumn::make('total_commission')
                    ->label("Total Commission")
                    ->alignCenter()
                    ->numeric()
                    ->sortable(),
            ])
            ->filters([])
            ->actions([])
            ->bulkActions([]);
            // ->headerActions([
            //     ExportAction::make()
            //         ->exporter(EarningByStoreExporter::class)
            //         ->label("Export CSV")
            //         ->color('warning')
            //         ->formats([
            //             ExportFormat::Csv,
            //             // ExportFormat::Xlsx,
            //         ])
            // ]);
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
            'index' => Pages\ListEarningByStores::route('/'),
        ];
    }
}
