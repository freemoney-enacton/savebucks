<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NetworkCouponResource\Pages;
use App\Filament\Resources\NetworkCouponResource\RelationManagers;
use App\Models\NetworkCoupon;
use App\Models\AffiliateNetwork;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use ValentinMorice\FilamentJsonColumn\JsonColumn;


class NetworkCouponResource extends Resource
{
    protected static ?string $model = NetworkCoupon::class;
    protected static ?int $navigationSort = 4;
    protected static ?string $navigationGroup = "Affiliate Networks";
    protected static ?string $navigationIcon = 'heroicon-o-gift';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Network Coupons')
                    ->description('Basic network coupon details')
                    ->schema([

                        Forms\Components\Select::make('network_id')
                            ->label("Network")
                            ->required()
                            ->options(AffiliateNetwork::pluck('name', 'id'))
                            ->preload()
                            ->searchable(),

                        Forms\Components\TextInput::make('network_campaign_id')
                            ->required()
                            ->numeric()
                            ->label("Network Campaign ID"),

                        Forms\Components\TextInput::make('network_coupon_id')
                            ->required()
                            ->maxLength(191)
                            ->label("Network Coupon ID"),

                        Forms\Components\TextInput::make('title')
                            ->columnSpanFull()
                            ->label("Title"),

                        Forms\Components\Textarea::make('description')
                            ->columnSpanFull()
                            ->label("Description"),

                        Forms\Components\TextInput::make('link_type')
                            ->maxLength(100)
                            ->label("Link Type"),

                        Forms\Components\TextInput::make('discount')
                            ->maxLength(100)
                            ->label("Discount"),

                        Forms\Components\TextInput::make('coupon_code')
                            ->maxLength(100)
                            ->label("Coupon Code"),

                        Forms\Components\TextInput::make('image')
                            ->maxlength(1500)
                            ->label("Image"),

                        Forms\Components\Textarea::make('categories')
                            ->columnSpanFull()
                            ->label("Categories"),

                        Forms\Components\Textarea::make('stats')
                            ->columnSpanFull()
                            ->label("Stats"),

                        Forms\Components\TextInput::make('found_batch_id')
                            ->numeric()
                            ->label("Found Batch ID"),

                        Forms\Components\Textarea::make('raw_categories')
                            ->columnSpanFull()
                            ->label("Raw Categories"),

                    ])->columnSpan(1),


                Forms\Components\Section::make('Additional Information')
                    ->description('Additional network coupon details')
                    ->schema([

                        Forms\Components\TextInput::make('affiliate_link')
                            ->maxLength(2500)
                            ->label("Affiliate Link"),

                        Forms\Components\TextInput::make('plain_link')
                            ->maxLength(2500)
                            ->label("Plain Link"),

                        Forms\Components\TextInput::make('tag')
                            ->maxLength(1000)
                            ->label("Tag"),

                        Forms\Components\Textarea::make('sys_tag')
                            ->columnSpanFull()
                            ->label("System Tag"),

                        Forms\Components\Toggle::make('exclusive')
                            ->required()
                            ->default(false)
                            ->label("Exclusive"),

                        Forms\Components\Toggle::make('initialize')
                            ->required()
                            ->default(false)
                            ->label("Initialize"),

                        JsonColumn::make('extra_information')
                            ->label('Extra Information')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->editorHeight(250)
                            ->editorOnly(),

                        Forms\Components\DateTimePicker::make('start_date')
                            ->native(false)
                            ->prefixicon("heroicon-o-calendar")
                            ->label("Start Date"),

                        Forms\Components\DateTimePicker::make('end_date')
                            ->native(false)
                            ->prefixicon("heroicon-o-calendar")
                            ->label("End Date"),

                        Forms\Components\DateTimePicker::make('deleted_at')
                            ->native(false)
                            ->prefixicon("heroicon-o-calendar")
                            ->label("Deleted At"),

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

                Tables\Columns\TextColumn::make('network_campaign_id')
                    ->label('Network Campaign ID')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('title')
                    ->label('Title')
                    ->limit(50)
                    ->searchable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label('Created At')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->label('Updated At')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: false),

            ])
            ->filters([

                Tables\Filters\SelectFilter::make('network_id')
                    ->label('Network')
                    ->options(AffiliateNetwork::all()->pluck('name', 'id'))
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
            'index' => Pages\ListNetworkCoupons::route('/'),
            'create' => Pages\CreateNetworkCoupon::route('/create'),
            'edit' => Pages\EditNetworkCoupon::route('/{record}/edit'),
            'view' => Pages\ViewUser::route('/{record}'),
        ];
    }
}
