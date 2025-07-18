<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AffiliatePostbackLogResource\Pages;
use App\Filament\Resources\AffiliatePostbackLogResource\RelationManagers;
use App\Models\AffiliatePostbackLog;
use App\Models\AffiliateNetwork;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class AffiliatePostbackLogResource extends Resource
{
    protected static ?string $model             = AffiliatePostbackLog::class;
    protected static ?string $navigationGroup   = 'Affiliate Networks';
    protected static ?int $navigationSort       =  3;
    protected static ?string $navigationIcon    = 'heroicon-o-document-text';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Network Postback Log')
                    ->description('Basic network postback log details')
                    ->schema([

                        Forms\Components\Select::make('network_id')
                            ->label("Network Id")
                            ->required()
                            ->options(AffiliateNetwork::pluck('name', 'id'))
                            ->preload()
                            ->searchable(),

                        Forms\Components\TextInput::make('network_campaign_id')
                            ->required()
                            ->maxLength(255)
                            ->label("Network Campaign Id"),

                        Forms\Components\TextInput::make('transaction_id')
                            ->required()
                            ->maxLength(50)
                            ->label("Transaction Id"),

                        Forms\Components\TextInput::make('commission_id')
                            ->maxLength(50)
                            ->label("Commission Id"),

                        Forms\Components\TextInput::make('order_id')
                            ->maxLength(50)
                            ->label("Order Id"),

                        Forms\Components\TextInput::make('sale_date')
                            ->maxLength(50)
                            ->label("Sale Date"),

                        Forms\Components\TextInput::make('sale_amount')
                            ->numeric()
                            ->label("Sale Amount"),

                        Forms\Components\TextInput::make('base_commission')
                            ->numeric()
                            ->label("Base Commission"),

                        Forms\Components\TextInput::make('currency')
                            ->required()
                            ->maxLength(3)
                            ->default('USD')
                            ->label("Currency"),

                        Forms\Components\Radio::make('action_by')
                            ->options([
                                "network"   => "Network",
                                "Admin"     => "Admin"
                            ])
                            ->default("network")
                            ->inline()
                            ->inlineLabel(false)
                            ->required()
                            ->label("Action By"),

                    ])->columnSpan(1),

                Forms\Components\Section::make('Extra Information')
                    ->description('Extra network postback log details')
                    ->schema([

                        Forms\Components\TextInput::make('sale_id')
                            ->maxLength(255)
                            ->label("Sale Id"),

                        Forms\Components\TextInput::make('sale_status')
                            ->required()
                            ->maxLength(50)
                            ->default('pending')
                            ->label("Sale Status"),

                        Forms\Components\TextInput::make('aff_sub1')
                            ->maxLength(500)
                            ->label("Aff Sub 1"),

                        Forms\Components\TextInput::make('aff_sub2')
                            ->maxLength(500)
                            ->label("Aff Sub 2"),

                        Forms\Components\TextInput::make('aff_sub3')
                            ->maxLength(500)
                            ->label("Aff Sub 3"),

                        Forms\Components\TextInput::make('aff_sub4')
                            ->maxLength(500)
                            ->label("Aff Sub 4"),

                        Forms\Components\TextInput::make('aff_sub5')
                            ->maxLength(500)
                            ->label("Aff Sub 5"),

                        Forms\Components\TextInput::make('exception')
                            ->maxLength(500)
                            ->label("Exception"),

                        Forms\Components\TextInput::make('inputs')
                            ->label("Inputs"),                            

                    ])->columnSpan(1),

            ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('network.name')
                    ->label('Network')
                    ->searchable(),

                Tables\Columns\TextColumn::make('sale_date')
                    ->searchable()
                    ->label('Sale Date'),

                Tables\Columns\TextColumn::make('base_commission')
                    ->numeric()
                    ->sortable()
                    ->label('Base Commission'),

                Tables\Columns\TextColumn::make('currency')
                    ->searchable()
                    ->label('Currency'),

                Tables\Columns\TextColumn::make('aff_sub1')
                    ->searchable()
                    ->limit(20)
                    ->tooltip(fn($state) => $state)
                    ->label('Affiliate Sub 1'),

                Tables\Columns\TextColumn::make('sale_status')
                    ->searchable()
                    ->label('Sale Status'),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->label('Created At'),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: false)
                    ->label('Updated At'),
            ])
            ->filters([

                Tables\Filters\SelectFilter::make('network_id')
                    ->label('Network')
                    ->options(AffiliateNetwork::all()->pluck('name', 'id'))
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('action_by')
                    ->label('Action By')
                    ->options([                       
                        "network"   => "Network",
                        "Admin"     => "Admin"
                    ])
                    ->preload()
                    ->searchable(),

            ])
            ->actions([
                // Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
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
            'index' => Pages\ListAffiliatePostbackLogs::route('/'),
            'create' => Pages\CreateAffiliatePostbackLog::route('/create'),
            'edit' => Pages\EditAffiliatePostbackLog::route('/{record}/edit'),
        ];
    }
}
