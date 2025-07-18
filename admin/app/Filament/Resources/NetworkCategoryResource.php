<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NetworkCategoryResource\Pages;
use App\Filament\Resources\NetworkCategoryResource\RelationManagers;
use App\Models\NetworkCategory;
use App\Models\AffiliateNetwork;
use App\Models\StoreCategory;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class NetworkCategoryResource extends Resource
{
    protected static ?string $model             = NetworkCategory::class;
    protected static ?string $modelLabel        = "Campaign Category";
    protected static ?int $navigationSort       = 5;
    protected static ?string $navigationGroup   = "Affiliate Networks";
    protected static ?string $navigationIcon    = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Additional Information')
                    ->description('Additional network coupon details')
                    ->schema([

                        Forms\Components\Select::make('network')
                            ->label("Network")
                            ->options(AffiliateNetwork::pluck('name', 'namespace'))
                            ->preload()
                            ->required()
                            ->searchable(),

                        Forms\Components\TextInput::make('network_cat_id')
                            ->label("Network Category ID")
                            ->numeric(),

                        Forms\Components\TextInput::make('network_cat_name')
                            ->label("Network Category Name")
                            ->maxLength(500),

                        Forms\Components\Select::make('sys_cat')
                            ->options(StoreCategory::pluck('name', 'id'))
                            ->preload()
                            ->searchable()
                            ->label("System Merchant Category")
                            ->placeholder("Select system merchant category"),


                        Forms\Components\TextInput::make('parent_cat_id')
                            ->label("Parent Category ID")
                            ->numeric(),

                        Forms\Components\TextInput::make('parent_cat_name')
                            ->label("Parent Category Name")
                            ->maxLength(255),

                    ])->columns(2)

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('network')
                    ->searchable(),

                Tables\Columns\TextColumn::make('network_cat_id')
                    ->label('Network Category ID')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('network_cat_name')
                    ->searchable()
                    ->label('Network Category Name'),

                Tables\Columns\TextColumn::make('category.name')
                    ->label('System Merchant Category')
                    ->searchable(),

            ])
            ->filters([

                Tables\Filters\SelectFilter::make('network_id')
                    ->label('Network')
                    ->options(AffiliateNetwork::all()->pluck('name', 'id'))
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('sys_cat')
                    ->label('System Merchant Category')
                    ->options(StoreCategory::pluck('name', 'id'))
                    ->preload()
                    ->searchable(),

            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),
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
            'index'     => Pages\ListNetworkCategories::route('/'),
            'create'    => Pages\CreateNetworkCategory::route('/create'),
            'edit'      => Pages\EditNetworkCategory::route('/{record}/edit'),
        ];
    }
}
