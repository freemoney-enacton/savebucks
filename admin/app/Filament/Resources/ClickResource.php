<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ClickResource\Pages;
use App\Filament\Resources\ClickResource\RelationManagers;
use App\Models\AffiliateNetwork;
use App\Models\Click;
use App\Models\Store;
use App\Models\AppUser;
use App\Models\Network;
use Illuminate\Database\Eloquent\Model;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Illuminate\Database\Eloquent\Collection;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\HtmlString;
use carbon\carbon;

class ClickResource extends Resource
{
    protected static ?string $model             = Click::class;
    protected static ?string $modelLabel        = "Click Log";
    protected static ?string $navigationGroup   = "Sales & Cashback";
    protected static ?string $navigationLabel   = "Click Log";
    protected static ?int $navigationSort       = 2;
    protected static ?string $navigationIcon    = 'heroicon-o-cursor-arrow-ripple';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Click History')
                    ->description('General click history fields')
                    ->schema([

                        Forms\Components\TextInput::make('code')
                            ->required()
                            ->maxLength(10)
                            ->label('Code'),

                        Forms\Components\DateTimePicker::make('click_time')
                            ->required()
                            ->prefixicon("heroicon-o-calendar")
                            ->native(false)
                            ->label('Click Time'),

                        Forms\Components\Select::make('store_id')
                            ->required()
                            ->options(Store::pluck('name', 'id'))
                            ->searchable()
                            ->disabledon('edit')
                            ->preload()
                            ->label('Store'),

                        Forms\Components\Select::make('user_id')
                            ->options(AppUser::pluck('email', 'id'))
                            ->searchable()
                            ->disabledon('edit')
                            ->preload()
                            ->label('User'),

                        Forms\Components\TextInput::make('cashback_percent')
                            ->required()
                            ->numeric()
                            ->default(0.00)
                            ->maxValue(100.00)
                            ->label('Cashback Percent'),


                        Forms\Components\TextInput::make('referral_percent')
                            ->required()
                            ->numeric()
                            ->default(0.00)
                            ->maxValue(100.00)
                            ->label('Referral Percent'),

                        Forms\Components\TextInput::make('user_cashback_id')
                            ->numeric()
                            ->label('User Cashback ID'),

                        Forms\Components\TextInput::make('network_campaign_id')
                            ->maxLength(255)
                            ->label('Network Campaign ID'),

                        Forms\Components\Radio::make('cashback_type')
                            ->options([
                                "cashback" => 'Cashback',
                                "reward"   => 'Reward',
                            ])
                            ->default('cashback')
                            ->required()
                            ->inline()
                            ->inlineLabel(false)
                            ->label('Cashback Type'),

                        Forms\Components\Toggle::make('referral_enabled')
                            ->required()
                            ->default(false)
                            ->label('Referral Enabled'),

                        Forms\Components\Toggle::make('cashback_enabled')
                            ->required()
                            ->default(false)
                            ->label('Cashback Enabled'),

                        Forms\Components\Toggle::make('can_claim')
                            ->required()
                            ->default(false)
                            ->label('Can Claim'),


                    ])->columns(2)
                    ->columnSpan(2),

                Forms\Components\Section::make('Additional Information')
                    ->description('Click additional information')
                    ->schema([

                        Forms\Components\TextInput::make('confirm_duration')
                            ->maxLength(100)
                            ->label('Confirm Duration'),

                        Forms\Components\TextInput::make('original_link')
                            ->required()
                            ->maxLength(5000)
                            ->url()
                            ->label('Original Link'),

                        Forms\Components\TextInput::make('redirect_link')
                            ->required()
                            ->url()
                            ->maxLength(5000)
                            ->label('Redirect Link'),

                        Forms\Components\Select::make('network_id')
                            ->options(AffiliateNetwork::pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->label('Network'),

                        Forms\Components\TextInput::make('source_type')
                            ->required()
                            ->maxLength(50)
                            ->label('Source Type'),

                        Forms\Components\TextInput::make('source_id')
                            ->required()
                            ->numeric()
                            ->label('Source ID'),

                        Forms\Components\TextInput::make('ip_address')
                            ->required()
                            ->maxLength(255)
                            ->label('IP Address'),

                        Forms\Components\TextInput::make('http_referrer')
                            ->maxLength(1000)
                            ->label('HTTP Referrer'),

                        Forms\Components\TextInput::make('user_agent')
                            ->maxLength(2500)
                            ->label('User Agent'),

                        Forms\Components\TextInput::make('extra_info')
                            ->label('Extra Info'),

                    ])->columns(1)
                    ->columnSpan(1),

            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('id')
                    ->label("Click Id")
                    ->sortable(),

                Tables\Columns\TextColumn::make('code')
                    ->label("Click Code")
                    ->searchable(),

                Tables\Columns\TextColumn::make('click_time')
                    ->dateTime()
                    ->label("Click Time")
                    ->sortable(),

                Tables\Columns\TextColumn::make('store.name')
                    ->label("Store")
                    ->limit(20)
                    ->tooltip(fn($state) => $state)
                    ->searchable(),

                Tables\Columns\TextColumn::make('user.email')
                    ->searchable()
                    ->limit(20)
                    ->tooltip(fn($state) => $state)
                    ->label("User"),                  

                Tables\Columns\ToggleColumn::make('cashback_enabled')
                    ->label(new HtmlString('<div style="width:70px; text-align:left; white-space:normal;">Cashback<br>Enabled</div>')),

                Tables\Columns\TextColumn::make('cashback_percent')
                    ->numeric()
                    ->label(new HtmlString('<div style="width:65px; text-align:left; white-space:normal;">Cashback<br>Percent</div>'))
                    ->sortable(),

                Tables\Columns\TextColumn::make('cashback_type')
                    ->formatStateUsing(fn($state)=> ucfirst($state))
                    ->label(new HtmlString('<div style="width:70px; text-align:left; white-space:normal;">Cashback<br>Type</div>')),

            ])
            ->filters([

                Tables\Filters\TernaryFilter::make('cashback_enabled')
                    ->label('Cashback Enabled'),

                Tables\Filters\SelectFilter::make('store_id')
                    ->options(Store::pluck('name', 'id'))
                    ->searchable()
                    ->preload()
                    ->label('Filter by Store'),

                Tables\Filters\SelectFilter::make('network_id')
                    ->options(AffiliateNetwork::pluck('name', 'id'))
                    ->searchable()
                    ->preload()
                    ->label('Network'),               

                Tables\Filters\SelectFilter::make('user_id')
                    ->options(AppUser::pluck('email', 'id'))
                    ->searchable()
                    ->preload()
                    ->label('Filter by User'),

                Tables\Filters\Filter::make('click_time')
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("Click Date from")->columnSpan(1)->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("Click Date until")->columnSpan(1)->icon('heroicon-s-calendar'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('click_time', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('click_time', '<=', $data['until']));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                
                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'Click Date from ' . Carbon::parse($data['from'])->toFormattedDateString();
                        }
                
                        if ($data['until'] ?? null) {
                            $indicators['until'] = 'Click Date until ' . Carbon::parse($data['until'])->toFormattedDateString();
                        }
                
                        return $indicators;
                }),

                Tables\Filters\SelectFilter::make('cashback_type')
                ->options([
                    "cashback" => 'Cashback',
                    "reward"   => 'Reward',
                ])  
                ->searchable()
                ->preload()            
                ->label('Cashback Type'),
            ])->filtersFormColumns(2)
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),
                Tables\Actions\DeleteAction::make()->label("")->tooltip('Delete')->size("xl"),

            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),

                    // ...collect([
                    //     [
                    //         'name' => 'is_enabled',
                    //         'label' => 'Set As Enable',
                    //         'icon' => 'heroicon-o-check-badge',
                    //         'value' => 1,
                    //         'field' => 'cashback_enabled',
                    //     ],
                    //     [
                    //         'name' => 'is_disabled',
                    //         'label' => 'Set As Disable',
                    //         'icon' => 'heroicon-o-x-circle',
                    //         'value' => 0,
                    //         'field' => 'cashback_enabled',
                    //     ],
                    // ])->map(function ($action) {

                    //     return Tables\Actions\BulkAction::make($action['name'])
                    //         ->label($action['label'])
                    //         ->icon($action['icon'])
                    //         ->action(function (Collection $records) use ($action) {
                    //             Click::whereIn('id', $records->pluck('id'))->update([$action['field'] => $action['value']]);
                    //         })
                    //         ->deselectRecordsAfterCompletion();
                    // })->toArray(),

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
            'index' => Pages\ListClicks::route('/'),
            'create' => Pages\CreateClick::route('/create'),
            'edit' => Pages\EditClick::route('/{record}/edit'),
        ];
    }
}
