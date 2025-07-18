<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CouponResource\Pages;
use App\Enums\OfferStatus;
use App\Filament\Resources\CouponResource\RelationManagers;
use App\Models\Coupon;
use App\Models\Store;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\Section;
use App\Models\Category;
use App\Models\AffiliateNetwork;
use Filament\Resources\Concerns\Translatable;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Database\Eloquent\Collection;
use carbon\carbon;

class CouponResource extends Resource
{
    use Translatable;
    protected static ?string $model             = Coupon::class;
    protected static ?string $navigationIcon    = 'heroicon-o-gift-top';
    protected static ?string $navigationGroup   = "Stores & Offers";
    protected static ?int $navigationSort       =  3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Section::make('Coupon Details')
                    ->description("Add coupon's general details")
                    ->schema([

                        Forms\Components\Select::make('store_id')
                            ->label('Store')
                            ->options(Store::all()->pluck('name', 'id'))
                            ->preload()
                            ->searchable()
                            ->disabledon('edit')
                            ->required(),

                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->label('Title'),

                        Forms\Components\Textarea::make('description')
                            ->minLength(5)
                            ->columnSpanFull()
                            ->label('Description'),

                        Forms\Components\TextInput::make('code')
                            ->maxLength(50)
                            ->infotip('Enter coupon code without spaces e.g: 50OFF')
                            ->regex('/^[a-zA-Z0-9_]+$/')
                            ->label('Coupon Code'),

                        Forms\Components\Toggle::make('is_featured')
                            ->required()
                            ->default(0)
                            ->columnSpanFull()
                            ->label('Is Featured'),

                        Forms\Components\Radio::make('status')
                            ->required()
                            ->inline()
                            ->inlineLabel(false)
                            ->default('draft')
                            ->options([
                                'publish'   => 'Publish',
                                'draft'     => 'Draft',
                                'trash'     => 'Trash',
                            ])
                            ->label('Status'),

                    ])->columns(2)
                    ->columnSpan(2),

                Section::make('Aditional Details')
                    ->description('Store aditional details')
                    ->schema([

                        Forms\Components\TextInput::make('link')
                            ->maxLength(2500)
                            ->required()
                            ->label('Offer Link'),

                        Forms\Components\Toggle::make('is_affiliate_link')
                            ->required()
                            ->label('Is Affiliate Link'),

                        Forms\Components\Select::make('network_coupon_id')
                            ->options(AffiliateNetwork::all()->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->label('Network'),

                        Forms\Components\DatePicker::make('start_date')
                            ->native(false)
                            ->prefixIcon('heroicon-o-calendar')
                            ->label('Start Date')
                            ->date(),

                        Forms\Components\DatePicker::make('expiry_date')
                            ->native(false)
                            ->prefixIcon('heroicon-o-calendar')
                            ->label('Expiry Date')
                            ->date()
                            ->after('start_date'),


                    ])->columns(1)
                    ->columnSpan(1),

            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordUrl(null)
            ->columns([

                Tables\Columns\TextColumn::make('title')
                    ->limit(25)
                    ->tooltip(fn($state) => $state)
                    ->searchable(
                        query: function ($query, $search) {
                            try {
                                return $query->where(function ($query) use ($search) {
                                    $languages = config('app.languages', ['en']);

                                    if (is_string($search)) {
                                        foreach ($languages as $lang) {
                                            $query->orWhereRaw(
                                                "LOWER(JSON_EXTRACT(title, '$.\"{$lang}\"')) LIKE ?",
                                                ['%' . strtolower($search) . '%']
                                            );
                                        }
                                        $query->orWhere('title', 'LIKE', '%' . $search . '%');
                                    }
                                });
                            } catch (\Exception $e) {
                                return $query->where('title', 'LIKE', '%' . $search . '%');
                            }
                        }
                    ),

                Tables\Columns\TextColumn::make('store.name')
                    ->label('Store')
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->whereHas('store', fn($q) => $q->where('slug', 'like', "%{$search}%"));
                    }),

                Tables\Columns\ToggleColumn::make('is_featured')
                    ->label('Featured'),

                Tables\Columns\TextColumn::make('start_date')
                    ->date()
                    ->label('Start Date')
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->sortable(),

                Tables\Columns\TextColumn::make('expiry_date')
                    ->date()
                    ->label('Expiry Date')
                    ->sortable(),

                Tables\Columns\TextColumn::make('clicks')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('updated_at')
                    ->date()
                    ->sortable()
                    ->tooltip(fn($state) => $state)
                    ->label("Updated At")
                    ->toggleable(isToggledHiddenByDefault: false),
                
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->formatstateUsing(fn(string $state): string => ucwords($state))
                    ->color(fn(string $state): string => match ($state) {
                        'publish' => 'success',
                        'draft'   => 'warning',
                        'trash'   => 'danger',
                        default   => 'gray',
                    })
                    ->alignEnd(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

            ])
            ->filters([

                Tables\Filters\SelectFilter::make('store_id')
                    ->label('Store')
                    ->options(Store::all()->pluck('name', 'id'))
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('status')
                    ->options(OfferStatus::class),

                Tables\Filters\SelectFilter::make('network_coupon_id')
                    ->options(AffiliateNetwork::all()->pluck('name', 'id'))
                    ->searchable()
                    ->preload()
                    ->label('Network'),                  

                Tables\Filters\TernaryFilter::make('is_featured')
                    ->placeholder("All")
                    ->label('Featured'),

                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("Created from")->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("Created until")->icon('heroicon-s-calendar'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('created_at', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('created_at', '<=', $data['until']));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                
                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'Created from ' . Carbon::parse($data['from'])->toFormattedDateString();
                        }
                
                        if ($data['until'] ?? null) {
                            $indicators['until'] = 'Created until ' . Carbon::parse($data['until'])->toFormattedDateString();
                        }
                
                        return $indicators;
                }),

                Tables\Filters\Filter::make('updated_at')
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("Updated from")->columnSpan(1)->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("Updated until")->columnSpan(1)->icon('heroicon-s-calendar'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('updated_at', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('updated_at', '<=', $data['until']));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                
                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'updated from ' . Carbon::parse($data['from'])->toFormattedDateString();
                        }
                
                        if ($data['until'] ?? null) {
                            $indicators['until'] = 'updated until ' . Carbon::parse($data['until'])->toFormattedDateString();
                        }
                
                        return $indicators;
                })

            ])->filtersFormColumns(2)
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),

                    ...collect([
                        [
                            'name' => 'is_featured',
                            'label' => 'Set As Featured',
                            'icon' => 'heroicon-o-check-badge',
                            'value' => 1,
                            'field' => 'is_featured',
                        ],
                        [
                            'name' => 'is_unfeatured',
                            'label' => 'Set As Unfeatured',
                            'icon' => 'heroicon-o-x-circle',
                            'value' => 0,
                            'field' => 'is_featured',
                        ],
                    ])->map(function ($action) {

                        return Tables\Actions\BulkAction::make($action['name'])
                            ->label($action['label'])
                            ->icon($action['icon'])
                            ->action(function (Collection $records) use ($action) {
                                Coupon::whereIn('id', $records->pluck('id'))->update([$action['field'] => $action['value']]);
                            })
                            ->deselectRecordsAfterCompletion();
                    })->toArray(),


                ])->label('Bulk Actions'),

                Tables\Actions\BulkAction::make('change_status')
                    ->label('Change Status')
                    ->modalWidth('lg')
                    ->form([
                        Forms\Components\Select::make('status')
                            ->label('Select Status')
                            ->options([
                                'publish'   => 'Publish',
                                'draft'     => 'Draft',
                                'trash'     => 'Trash',
                            ])
                            ->required(),
                    ])
                    ->action(function (Collection $records, array $data) {
                        Coupon::whereIn('id', $records->pluck('id'))->update(['status' => $data['status']]);
                    })
                    ->deselectRecordsAfterCompletion()
                    ->button(),
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
            'index' => Pages\ListCoupons::route('/'),
            'create' => Pages\CreateCoupon::route('/create'),
            'edit' => Pages\EditCoupon::route('/{record}/edit'),
        ];
    }
}
