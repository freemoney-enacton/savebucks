<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserClaimResource\Pages;
use App\Filament\Resources\UserClaimResource\RelationManagers;
use App\Models\AffiliateNetwork;
use App\Models\UserClaim;
use App\Models\AppUser;
use App\Models\Store;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\HtmlString;
use Illuminate\Database\Eloquent\Collection;
use carbon\carbon;

class UserClaimResource extends Resource
{
    protected static ?string $model = UserClaim::class;
    protected static ?string $modelLabel = "Missing CB Claims";
    protected static ?int $navigationSort = 1;
    protected static ?string $navigationGroup = "Manage Users";
    protected static ?string $navigationIcon = 'heroicon-o-receipt-percent';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Missing Cashback Claim')
                    ->description('Details of missing cashback claim')
                    ->schema([

                        Forms\Components\Select::make('user_id')
                            ->options(AppUser::pluck('email', 'id'))
                            ->label("User")
                            ->disabledon('edit')
                            ->preload()
                            ->searchable()
                            ->required(),

                        Forms\Components\TextInput::make('click_id')
                            ->required()
                            ->label("Click Id")
                            ->disabled(),

                        Forms\Components\Select::make('store_id')
                            ->options(Store::pluck('name', 'id'))
                            ->preload()
                            ->label("Store")
                            ->searchable()
                            ->disabledon('edit')
                            ->required(),

                        Forms\Components\Select::make('network_id')
                            ->label("Network")
                            ->options(AffiliateNetwork::pluck('name', 'id'))
                            ->preload()
                            ->searchable(),

                        Forms\Components\DateTimePicker::make('click_time')
                            ->label("Click Time")
                            ->native(false)
                            ->prefixicon("heroicon-o-calendar")
                            ->required(),

                        Forms\Components\Textarea::make('admin_note')
                            ->label('Admin Note')
                            ->maxLength(500),

                        Forms\Components\Radio::make('status')
                            ->options([
                                'open'      => 'Open',
                                'hold'      => 'Hold',
                                'answered'  => 'Answered',
                                'closed'    => 'Closed',
                            ])
                            ->default('open')
                            ->inlinelabel(true)
                            ->inline()
                            ->required(),

                        Forms\Components\TextInput::make('network_campaign_id')
                            ->label("Network Campaign ID")
                            ->maxLength(255),

                    ])->columns(1)->columnSpan(1),


                Forms\Components\Section::make('Aditional Details')
                    ->description('Aditional missing cashback claim')
                    ->schema([

                        Forms\Components\TextInput::make('click_code')
                            ->disabled()
                            ->maxLength(10),

                        Forms\Components\Radio::make('platform')
                            ->options([
                                'website'   => 'Website',
                                'mobile'    => 'Mobile',
                                'ios'       => 'IOS',
                                'android'   => 'Android',
                            ])
                            ->default('website')
                            ->inlinelabel(false)
                            ->inline()
                            ->required(),

                        Forms\Components\DatePicker::make('transaction_date')
                            ->prefixicon("heroicon-o-calendar")
                            ->native(false)
                            ->required(),

                        Forms\Components\TextInput::make('order_id')
                            ->required()
                            ->label("Order Id")
                            ->maxLength(255),

                        Forms\Components\TextInput::make('order_amount')
                            ->required()
                            ->label("Order Amount")
                            ->numeric(),

                        Forms\Components\TextInput::make('currency')
                            ->required()
                            ->maxLength(3),

                        Forms\Components\TextInput::make('receipt')
                            ->disabled()
                            ->maxLength(500),

                        Forms\Components\Textarea::make('user_message')
                            ->label("User Message")
                            ->maxLength(500),

                    ])->columns(1)->columnSpan(1),

            ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.email')
                    ->numeric()
                    ->searchable(),

                Tables\Columns\TextColumn::make('click_code')
                    ->numeric()
                    ->label("Click Code")
                    ->searchable(),

                Tables\Columns\TextColumn::make('store.name')
                    ->numeric()
                    ->label("Store")
                    ->searchable(),

                Tables\Columns\TextColumn::make('click_time')
                    ->dateTime()
                    ->label("Click Time")
                    ->sortable(),

                Tables\Columns\TextColumn::make('order_amount')
                    ->numeric()
                    ->label(new HtmlString('<div style="width:55px; text-align:left; white-space:normal;">Order<br>Amount</div>'))
                    // ->label("Order Amount")
                    ->sortable(),

                Tables\Columns\SelectColumn::make('status')
                    ->options([
                        'open'      => 'Open',
                        'hold'      => 'Hold',
                        'answered'  => 'Answered',
                        'closed'    => 'Closed',
                    ])
                    ->alignEnd()
                    ->selectablePlaceholder(false),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->label("Updated At")
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label("Created At")
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

            ])
            ->filters([

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'open'      => 'Open',
                        'hold'      => 'Hold',
                        'answered'  => 'Answered',
                        'closed'    => 'Closed',
                    ])
                    ->selectablePlaceholder(false)
                    ->label('Filter by Status')
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('store_id')
                    ->options(Store::pluck('name', 'id'))
                    ->label('Filter by Store')
                    ->selectablePlaceholder(false)
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('user_id')
                    ->options(AppUser::pluck('email', 'id'))
                    ->label("User")                    
                    ->preload()
                    ->searchable(),    
                    
                Tables\Filters\SelectFilter::make('network_id')
                    ->label("Network")
                    ->options(AffiliateNetwork::pluck('name', 'id'))
                    ->preload()
                    ->searchable(), 

                Tables\Filters\Filter::make('transaction_date')
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("Transaction Date from")->columnSpan(1)->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("Transaction Date until")->columnSpan(1)->icon('heroicon-s-calendar'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('transaction_date', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('transaction_date', '<=', $data['until']));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                
                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'Transaction Date from ' . Carbon::parse($data['from'])->toFormattedDateString();
                        }
                
                        if ($data['until'] ?? null) {
                            $indicators['until'] = 'Transaction Date until ' . Carbon::parse($data['until'])->toFormattedDateString();
                        }
                
                        return $indicators;
                }),

                Tables\Filters\Filter::make('click_time')
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("Click Time Period from")->columnSpan(1)->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("Click Time Period until")->columnSpan(1)->icon('heroicon-s-calendar'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('click_time', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('click_time', '<=', $data['until']));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                
                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'click Time Period from ' . Carbon::parse($data['from'])->toFormattedDateString();
                        }
                
                        if ($data['until'] ?? null) {
                            $indicators['until'] = 'click Time Period until ' . Carbon::parse($data['until'])->toFormattedDateString();
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
                ]),

                Tables\Actions\BulkAction::make('change_status')
                    ->label('Change Status')
                    ->modalWidth('lg')
                    ->form([
                        Forms\Components\Select::make('status')
                            ->label('Select Status')
                            ->options([
                                'open'      => 'Open',
                                'hold'      => 'Hold',
                                'answered'  => 'Answered',
                                'closed'    => 'Closed',
                            ])
                            ->required(),
                    ])
                    ->action(function (Collection $records, array $data) {
                        UserClaim::whereIn('id', $records->pluck('id'))->update(['status' => $data['status']]);
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
            'index' => Pages\ListUserClaims::route('/'),
            'create' => Pages\CreateUserClaim::route('/create'),
            'edit' => Pages\EditUserClaim::route('/{record}/edit'),
        ];
    }
}
