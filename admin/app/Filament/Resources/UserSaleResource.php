<?php

namespace App\Filament\Resources;

use App\Filament\Exports\SaleExporter;
use App\Filament\Resources\UserSaleResource\Pages;
use App\Filament\Resources\UserSaleResource\RelationManagers;
use App\Models\UserSale;
use App\Models\AppUser;
use App\Models\Store;
use App\Models\AffiliateNetwork;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\HtmlString;
use App\Filament\Exports\UserSaleExporter;
use App\Filament\Imports\UserSaleImporter;
use Filament\Tables\Actions\ExportAction;
use Filament\Tables\Actions\ImportAction;
use Filament\Actions\Exports\Enums\ExportFormat;
use carbon\carbon;



class UserSaleResource extends Resource
{
    protected static ?string $model             = UserSale::class;
    protected static ?string $modelLabel        = "Cashback Transactions";
    protected static ?int $navigationSort       = 4;
    protected static ?string $navigationGroup   = "Sales & Cashback";
    protected static ?string $navigationIcon    = 'heroicon-o-circle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Cashback Transactions')
                    ->description('General cashback transaction fields')
                    ->schema([

                        Forms\Components\Select::make('user_id')
                            ->label('User')
                            ->disabledon('edit')
                            ->options(AppUser::pluck('email', 'id'))
                            ->preload()
                            ->searchable()
                            ->required(),

                        Forms\Components\TextInput::make('sales_id')
                            ->label('Sales ID')
                            ->required()
                            ->numeric(),

                        Forms\Components\Select::make('network_id')
                            ->label('Network')
                            ->options(AffiliateNetwork::pluck('name', 'id'))
                            ->preload()
                            ->searchable()
                            ->required(),

                        Forms\Components\TextInput::make('order_id')
                            ->label('Order ID')
                            ->maxLength(255),

                        Forms\Components\Select::make('store_id')
                            ->label('Store')
                            ->disabledon('edit')
                            ->options(Store::pluck('name', 'id'))
                            ->preload()
                            ->searchable()
                            ->required(),

                        Forms\Components\TextInput::make('click_id')
                            ->label('Click ID')
                            ->required()
                            ->disabled()
                            ->numeric(),

                        Forms\Components\TextInput::make('click_code')
                            ->label('Click Code')
                            ->maxLength(10),

                        Forms\Components\TextInput::make('order_amount')
                            ->label('Order Amount')
                            ->infotip("Same as network/merchant currency")
                            ->required()
                            ->numeric(),

                        Forms\Components\TextInput::make('currency')
                            ->label('Currency')
                            ->required()
                            ->maxLength(3),

                        Forms\Components\TextInput::make('admin_note')
                            ->label('Admin Note')
                            ->maxLength(500),

                    ])->columnSpan(1),


                Forms\Components\Section::make("Additional Information")
                    ->schema([

                        Forms\Components\DateTimePicker::make('transaction_time')
                            ->label('Transaction Time')
                            ->prefixicon("heroicon-o-calendar")
                            ->native(false)
                            ->required(),


                        Forms\Components\Radio::make('cashback_type')
                            ->label("Cashback Type")
                            ->options([
                                'cashback' => 'Cashback',
                                'reward' => 'Reward',
                            ])
                            ->inline()
                            ->inlinelabel(false)
                            ->default('cashback')
                            ->required(),

                        Forms\Components\TextInput::make('cashback')
                            ->required()
                            ->numeric(),

                        Forms\Components\Radio::make('status')
                            ->options([
                                'pending'   => 'Pending',
                                'confirmed' => 'Confirmed',
                                'declined'  => 'Declined',
                            ])
                            ->inline()
                            ->inlinelabel(false)
                            ->default('pending')
                            ->required(),

                        Forms\Components\Toggle::make('lock_amount')
                            ->label("Lock Amount")
                            ->default(false)
                            ->required(),

                        Forms\Components\Toggle::make('lock_status')
                            ->label("Lock Status")
                            ->default(false)
                            ->required(),

                        Forms\Components\DatePicker::make('expected_date')
                            ->label("Expected Date")
                            ->native(false)
                            ->prefixicon("heroicon-o-calendar"),

                        Forms\Components\Toggle::make('mail_sent')
                            ->label("Mail Sent")
                            ->default(false)
                            ->required(),

                        Forms\Components\TextInput::make('note'),

                    ])->columnSpan(1)

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->description(new htmlString('
                <ul class="list-disc pl-4 space-y-1 text-gray-600">
                    <li>When importing, if the <strong>Sales ID</strong> already exists, the record will be updated. If it doesn\'t exist, a new record will be created.</li>
                    <li>Ensure that the Sales ID in the import CSV already exists in the sales table.</li>
                </ul>
            '))    
            ->columns([

                Tables\Columns\TextColumn::make('user.email')
                    ->label('User')
                    ->limit(20)
                    ->tooltip(fn($state) => $state)
                    ->numeric()
                    ->searchable(),

                Tables\Columns\TextColumn::make('store.name')
                    ->numeric()
                    ->limit(20)
                    ->tooltip(fn($state) => $state)
                    ->label('Store')
                    ->searchable(),

                Tables\Columns\TextColumn::make('currency')
                    ->label('Currency')
                    ->searchable(),

                Tables\Columns\TextColumn::make('cashback')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\ToggleColumn::make('lock_status')
                    ->grow(false)
                    ->label(new HtmlString('<div style="width:100px; text-align:left; white-space:normal;">Lock&nbsp;<br>Cashback<br>Status</div>')),

                Tables\Columns\ToggleColumn::make('lock_amount')
                    ->grow(false)
                    ->label(new HtmlString('<div style="width:100px; text-align:left; white-space:normal;">Lock&nbsp;<br>Cashback<br>Amount</div>')),

                Tables\Columns\TextColumn::make('updated_at')
                    ->date()
                    ->tooltip(fn($state) => $state)
                    ->sortable()
                    ->label('Updated At')
                    ->grow(false)
                    ->toggleable(isToggledHiddenByDefault: false),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->formatstateUsing(fn(string $state): string => ucwords($state))
                    ->color(fn(string $state): string => match ($state) {
                        'pending'   => 'warning',
                        'confirmed' => 'success',
                        'declined'  => 'danger',
                    })
                    ->alignEnd()
                    ->grow(true),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

            ])
            ->filters([

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending'   => 'Pending',
                        'confirmed' => 'Confirmed',
                        'declined'  => 'Declined',
                    ])
                    ->selectablePlaceholder(false)
                    ->label('Filter by Status')
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('network_id')
                    ->relationship('network', 'Name')
                    ->label('Filter by Network')
                    ->selectablePlaceholder(false)
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
                    ->label('Filter by User')
                    ->selectablePlaceholder(false)
                    ->preload()
                    ->searchable(),

                Tables\Filters\TernaryFilter::make('lock_status')
                    ->placeholder("all")
                    ->label('Lock Cashback Status'),

                Tables\Filters\TernaryFilter::make('lock_amount')
                    ->placeholder("all")
                    ->label('Lock Cashback Amount'),

                Tables\Filters\Filter::make('transaction_time')
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("Transaction Date from")->columnSpan(1)->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("Transaction Date until")->columnSpan(1)->icon('heroicon-s-calendar'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('transaction_time', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('transaction_time', '<=', $data['until']));
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
                })

            ])->filtersFormColumns(2)
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),

                    Tables\Actions\BulkAction::make('cashback')
                        ->label('Cashback Amount')
                        ->icon('heroicon-s-currency-dollar')
                        ->modalWidth('lg')
                        ->form([
                            Forms\Components\TextInput::make('cashback')
                                ->required()
                                ->numeric()
                                ->label('Cashback Amount'),
                        ])
                        ->action(function (Collection $records, array $data) {
                            UserSale::whereIn('id', $records->pluck('id'))->update(['cashback' => $data['cashback']]);
                        })
                        ->deselectRecordsAfterCompletion(),


                    ...collect([
                        [
                            'name' => 'lock_status',
                            'label' => 'Lock Cashback Status',
                            'icon' => 'heroicon-o-check-circle',
                            'value' => 1,
                            'field' => 'lock_status',
                        ],
                        [
                            'name' => 'unlock_status',
                            'label' => 'UnLock Cashback Status',
                            'icon' => 'heroicon-o-no-symbol',
                            'value' => 0,
                            'field' => 'lock_status',
                        ],
                        [
                            'name' => 'lock_amount',
                            'label' => 'Lock Cashback Amount',
                            'icon' => 'heroicon-o-check-badge',
                            'value' => 1,
                            'field' => 'lock_amount',
                        ],
                        [
                            'name' => 'unlock_amount',
                            'label' => 'Unlock Cashback Amount',
                            'icon' => 'heroicon-o-x-circle',
                            'value' => 0,
                            'field' => 'lock_amount',
                        ],
                    ])->map(function ($action) {
                        return Tables\Actions\BulkAction::make($action['name'])
                            ->label($action['label'])
                            ->icon($action['icon'])
                            ->action(function (Collection $records) use ($action) {
                                UserSale::whereIn('id', $records->pluck('id'))->update([$action['field'] => $action['value']]);
                            })
                            ->deselectRecordsAfterCompletion();
                    })->toArray(),

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
                                'declined'  => 'Declined',
                            ])
                            ->required(),
                    ])
                    ->action(function (Collection $records, array $data) {
                        UserSale::whereIn('id', $records->pluck('id'))->update(['status' => $data['status']]);
                    })
                    ->deselectRecordsAfterCompletion()
                    ->button(),

            ])->headerActions([
                ExportAction::make()
                    ->exporter(UserSaleExporter::class)
                    ->button()
                    ->label("Export Csv")
                    ->color('warning')
                    ->formats([
                        ExportFormat::Csv,
                        // ExportFormat::Xlsx,
                    ]),

                ImportAction::make()
                    ->importer(UserSaleImporter::class)
                    ->button()
                    ->label("Import Csv")
                    ->color('gray'),

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
            'index' => Pages\ListUserSales::route('/'),
            'create' => Pages\CreateUserSale::route('/create'),
            'edit' => Pages\EditUserSale::route('/{record}/edit'),
        ];
    }
}
