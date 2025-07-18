<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EarningsByNetworkResource\Pages;
use App\Filament\Resources\EarningsByNetworkResource\RelationManagers;
use App\Models\EarningsByNetwork;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;


class EarningsByNetworkResource extends Resource
{
    protected static ?string $model             = EarningsByNetwork::class;
    protected static ?string $navigationLabel   = 'Earnings By Network';
    protected static ?string $navigationGroup   = 'Reports & Logs';
    protected static ?int $navigationSort       = 1;
    protected static ?string $navigationIcon    = 'heroicon-o-signal';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(150),
                Forms\Components\TextInput::make('affiliate_id')
                    ->maxLength(50),
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
                    ->label('ID')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('name')
                    ->searchable(),

                Tables\Columns\TextColumn::make('affiliate_id')
                    ->label('Affiliate Id')
                    ->searchable(),

                Tables\Columns\TextColumn::make('total_sales')
                    ->label('Total Sales')
                    ->alignCenter()
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('total_commission')
                    ->label("Total Commission")
                    ->alignCenter()
                    ->numeric()
                    ->sortable(),
            ])
            ->filters([])
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
            'index' => Pages\ListEarningsByNetworks::route('/'),
        ];
    }
}
