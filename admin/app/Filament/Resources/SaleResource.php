<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SaleResource\Pages;
use App\Filament\Resources\SaleResource\RelationManagers;
use App\Models\AffiliateNetwork;
use App\Models\Sale;
use App\Models\Network;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\HtmlString;
use App\Filament\Exports\SaleExporter;
use App\Filament\Imports\SaleImporter;
use Filament\Tables\Actions\ExportAction;
use Filament\Tables\Actions\ImportAction;
use Filament\Actions\Exports\Enums\ExportFormat;
use carbon\carbon;

class SaleResource extends Resource
{
    protected static ?string $model             = Sale::class;
    protected static ?string $modelLabel        = "Sales Transactions";
    protected static ?int $navigationSort       = 3;
    protected static ?string $navigationGroup   = "Sales & Cashback";
    protected static ?string $navigationIcon    = 'heroicon-o-credit-card';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Network Sale Transactions')
                    ->description('General sales transaction fields')
                    ->schema([

                        Forms\Components\Select::make('network_id')
                            ->options(AffiliateNetwork::pluck('name', 'id'))
                            ->preload()
                            ->searchable()
                            ->required()
                            ->label('Network'),

                        Forms\Components\TextInput::make('network_campaign_id')
                            ->required()
                            ->maxLength(191)
                            ->label('Network Campaign ID'),

                        Forms\Components\TextInput::make('transaction_id')
                            ->infotip("Mandatory, this must be unique for each transaction")
                            ->required()
                            ->maxLength(50)
                            ->label('Transaction ID'),

                        Forms\Components\TextInput::make('commission_id')
                            ->maxLength(50)
                            ->label('Commission ID'),

                        Forms\Components\TextInput::make('order_id')
                            ->maxLength(50)
                            ->label('Order ID'),

                        Forms\Components\DateTimePicker::make('click_date')
                            ->infotip("Optional, if available from the network")
                            ->prefixicon("heroicon-o-calendar")
                            ->native(false)
                            ->label('Click Date'),

                        Forms\Components\DateTimePicker::make('sale_date')
                            ->prefixicon("heroicon-o-calendar")
                            ->native(false)
                            ->label('Sale Date'),

                        Forms\Components\TextInput::make('sale_amount')
                            ->numeric()
                            ->label('Sale Amount'),

                        Forms\Components\TextInput::make('base_commission')
                            ->infotip("Commission in merchant currency")
                            ->numeric()
                            ->label('Base Commission'),

                        Forms\Components\TextInput::make('commission_amount')
                            ->required()
                            ->infotip("Commission in the base currency")
                            ->numeric()
                            ->label('Commission Amount'),

                        Forms\Components\TextInput::make('currency')
                            ->required()
                            ->maxLength(3)
                            ->infotip("Order amount currency as per the network import")
                            ->default('USD')
                            ->label('Currency'),

                    ])->columns(2)
                    ->columnSpan(2),

                Forms\Components\Section::make('Additional Information')
                    ->description('Additional fields for sales information')
                    ->schema([

                        Forms\Components\DateTimePicker::make('sale_updated_time')
                            ->label('Sale Updated Time')
                            ->prefixicon("heroicon-o-calendar")
                            ->native(false),

                        Forms\Components\TextInput::make('aff_sub1')
                            ->maxLength(50)
                            ->label('Aff Sub1'),

                        Forms\Components\TextInput::make('aff_sub2')
                            ->maxLength(50)
                            ->label('Aff Sub2'),

                        Forms\Components\TextInput::make('aff_sub3')
                            ->maxLength(50)
                            ->label('Aff Sub3'),

                        Forms\Components\TextInput::make('aff_sub4')
                            ->maxLength(50)
                            ->label('Aff Sub4'),

                        Forms\Components\TextInput::make('aff_sub5')
                            ->maxLength(50)
                            ->label('Aff Sub5'),

                        Forms\Components\Textarea::make('extra_information')
                            ->columnSpanFull()
                            ->label('Extra Information'),

                        Forms\Components\TextInput::make('found_batch_id')
                            ->numeric()
                            ->label('Found Batch ID'),

                        Forms\Components\TextInput::make('sale_status')
                            ->required()
                            ->infotip("Network Sales Status")
                            ->maxLength(50)
                            ->label('Sale Status'),

                        Forms\Components\Radio::make('status')
                            ->options([
                                'pending'   => 'Pending',
                                'confirmed' => 'Confirmed',
                                'delayed'   => 'Delayed',
                                'declined'  => 'Declined',
                            ])
                            ->default('pending')
                            ->inline(true)
                            ->inlineLabel(false)
                            ->required()
                            ->label('Status'),

                    ])->columns(1)
                    ->columnSpan(1),

            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->description(new
                    htmlString('
                    <ul class="list-disc pl-4 space-y-1 text-gray-600">
                        <li>For Import, If a record with the combination of <strong>network ID</strong> and <strong>transaction ID</strong> exists,<br> it will be updated otherwise, a new record will be created.</li>
                    </ul>
                ')
            )
            ->columns([

                Tables\Columns\TextColumn::make('network.name')
                    ->label("Network")
                    ->searchable()
                    ->numeric(),

                Tables\Columns\TextColumn::make('network_campaign_id')
                    ->label(new HtmlString('<div style="width:120px; text-align:left;">Network<br>Campaign Id</div>'))
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('transaction_id')
                    ->label('Transaction Id')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('sale_date')
                    ->label('Sale Date')
                    ->date()
                    ->tooltip(fn($state) => $state)
                    ->sortable(),

                Tables\Columns\TextColumn::make('commission_amount')
                    ->label(new HtmlString('<div style="width:65px; text-align:left; white-space:normal;">Commission<br>Amount</div>'))
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('aff_sub1')
                    ->limit(10)
                    ->tooltip(fn($state) => $state)
                    ->searchable(),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->formatstateUsing(fn(string $state): string => ucwords($state))
                    ->color(fn(string $state): string => match ($state) {
                        'pending'   => 'warning',
                        'confirmed' => 'success',
                        'delayed'   => 'gray',
                        'declined'  => 'danger',
                    })
                    ->alignEnd(),

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

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending'   => 'Pending',
                        'confirmed' => 'Confirmed',
                        'delayed'   => 'Delayed',
                        'declined'  => 'Declined',
                    ])
                    ->selectablePlaceholder(false)
                    ->label('Filter by Status')
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('network_id')
                    ->options(AffiliateNetwork::pluck('name', 'id'))
                    ->label('Filter by Network')
                    ->selectablePlaceholder(false)
                    ->preload()
                    ->searchable(),


                Tables\Filters\Filter::make('created_at')                
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("Created From")->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("Created Until")->icon('heroicon-s-calendar'),
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

                Tables\Filters\Filter::make('sale_date')                
                ->form([
                    Forms\Components\DatePicker::make('from')->native(false)->label("Sale Date From")->icon('heroicon-s-calendar'),
                    Forms\Components\DatePicker::make('until')->native(false)->label("Sale Date Until")->icon('heroicon-s-calendar'),
                ])
                ->query(function ($query, array $data) {
                    return $query
                        ->when($data['from'], fn ($q) => $q->whereDate('sale_date', '>=', $data['from']))
                        ->when($data['until'], fn ($q) => $q->whereDate('sale_date', '<=', $data['until']));
                })
                ->indicateUsing(function (array $data): array {
                    $indicators = [];
            
                    if ($data['from'] ?? null) {
                        $indicators['from'] = 'Sale Date from ' . Carbon::parse($data['from'])->toFormattedDateString();
                    }
            
                    if ($data['until'] ?? null) {
                        $indicators['until'] = 'Sale Date until ' . Carbon::parse($data['until'])->toFormattedDateString();
                    }
            
                    return $indicators;
            }),
                


            ])->filtersFormColumns(2)
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),

                    Tables\Actions\BulkAction::make('change_commission_amount')
                        ->label('Commission Amount')
                        ->icon('heroicon-s-currency-dollar')
                        ->modalWidth('lg')
                        ->form([
                            Forms\Components\TextInput::make('commission_amount')
                                ->required()
                                ->numeric()
                                ->label('Commission Amount'),
                        ])
                        ->action(function (Collection $records, array $data) {
                            Sale::whereIn('id', $records->pluck('id'))->update(['commission_amount' => $data['commission_amount']]);
                        })
                        ->deselectRecordsAfterCompletion(),

                ]),

                Tables\Actions\BulkAction::make('change_status')
                    ->label('Change Status')
                    ->modalWidth('lg')
                    ->form([
                        Forms\Components\Select::make('status')
                            ->label('Select Status')
                            ->options([
                                'pending'   => 'Pending',
                                'confirmed' => 'Confirmed',
                                'delayed'   => 'Delayed',
                                'declined'  => 'Declined',
                            ])
                            ->required(),
                    ])
                    ->action(function (Collection $records, array $data) {
                        Sale::whereIn('id', $records->pluck('id'))->update(['status' => $data['status']]);
                    })
                    ->deselectRecordsAfterCompletion()
                    ->button(),

            ])->headerActions([
                ExportAction::make()
                    ->exporter(SaleExporter::class)
                    ->button()
                    ->label("Export Csv")
                    ->color('warning')
                    ->formats([
                        ExportFormat::Csv,
                        // ExportFormat::Xlsx,
                    ]),

                ImportAction::make()
                    ->importer(SaleImporter::class)
                    ->button()
                    ->label("Import Csv")
                    ->color('gray'),

            ]);;
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
            'index' => Pages\ListSales::route('/'),
            'create' => Pages\CreateSale::route('/create'),
            'edit' => Pages\EditSale::route('/{record}/edit'),
            'view' => Pages\ViewSale::route('/{record}'),
        ];
    }
}
