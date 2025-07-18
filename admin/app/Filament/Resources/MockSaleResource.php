<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MockSaleResource\Pages;
use App\Filament\Resources\MockSaleResource\RelationManagers;
use App\Models\MockSale;
use App\Models\Currency;
use App\Models\AffiliateNetwork;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\HtmlString;
use Illuminate\Database\Eloquent\Collection;
use App\Filament\Imports\MockSaleImporter;
use Filament\Tables\Actions\ImportAction;

class MockSaleResource extends Resource
{
    protected static ?string $model             = MockSale::class;
    protected static ?string $modelLabel        = "Manual Sales Import";
    protected static ?string $navigationGroup   = "Sales & Cashback";
    protected static ?string $navigationLabel   = "Manual Sales Import";
    protected static ?int $navigationSort       = 1;
    protected static ?string $navigationIcon    = 'heroicon-o-arrow-down-on-square-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Manual Sale Import')
                    ->description('Fill the manual sales basic fields here')
                    ->schema([

                        Forms\Components\Select::make('network_id')
                            ->options(AffiliateNetwork::pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->label('Network'),

                        Forms\Components\TextInput::make('network_campaign_id')
                            ->required()
                            ->infotip("Optional")
                            ->numeric()
                            ->label('Network Campaign Id'),

                        Forms\Components\TextInput::make('transaction_id')
                            ->required()
                            ->infotip("Mandatory, this must be unique for each transaction")
                            ->maxLength(50)
                            ->label('Transaction Id'),

                        Forms\Components\TextInput::make('commission_id')
                            ->maxLength(50)
                            ->label('Commission Id'),

                        Forms\Components\TextInput::make('order_id')
                            ->maxLength(50)
                            ->label('Order Id'),

                        Forms\Components\DatePicker::make('sale_date')
                            ->native(false)
                            ->prefixicon("heroicon-o-calendar")
                            ->label('Sale Date'),

                        Forms\Components\TextInput::make('sale_amount')
                            ->numeric()
                            ->label('Sale Amount'),

                        Forms\Components\TextInput::make('base_commission')
                            ->numeric()
                            ->label('Base Commission'),

                        Forms\Components\Select::make('currency')
                            ->options(Currency::where("enabled", 1)->pluck('iso_code', 'iso_code'))
                            ->searchable()
                            ->default("USD")
                            ->preload()
                            ->label('Currency'),

                    ])->columns(1)->columnSpan(1),

                Forms\Components\Section::make('Additional Information')
                    ->description('Fill the manual sales  fields here')
                    ->schema([

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

                        Forms\Components\Radio::make('status')
                            ->options([
                                'pending'   => "Pending",
                                'confirmed' => "Confirmed",
                                'declined'  => "Declined"
                            ])
                            ->inline()
                            ->default("pending")
                            ->inlineLabel(false)
                            ->required()
                            ->label('Status'),


                    ])->columns(1)->columnSpan(1)

            ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->description(new
                htmlString('
                    <ul class="list-disc pl-4 space-y-1 text-gray-600">
                        <li>You can use module for bulk create/update the cashback transactions.</li>
                        <li>If any record matches with the network ID and transaction ID combination, it will update the existing record,<br> otherwise it will create a new record.</li>
                        <li>Every time before starting a new import, delete existing records.</li>
                        <li>Only transactions with <strong>PENDING</strong> status will be updated. A transaction once marked as <strong>DECLINED</strong> or <strong>CONFIRMED</strong><br> will not be updated by the network API or manual import.</li>
                    </ul>
                ')
            )
            ->columns([

                Tables\Columns\TextColumn::make('network.name')
                    ->searchable()
                    ->numeric()
                    ->label("Network"),

                Tables\Columns\TextColumn::make('transaction_id')
                    ->label("Transaction Id")
                    ->searchable(),

                Tables\Columns\TextColumn::make('sale_date')
                    ->label("Sale Date")
                    ->searchable(),

                Tables\Columns\TextColumn::make('base_commission')
                    ->label(new HtmlString('<div style="width:80px; text-align:left; white-space:normal;">Base<br>Commission</div>'))
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('currency')
                    ->searchable(),

                Tables\Columns\TextColumn::make('aff_sub1')
                    ->label("Aff Sub 1")
                    ->limit(20)
                    ->tooltip(fn($state) => $state)
                    ->searchable(),

                Tables\Columns\TextColumn::make('updated_at')
                    ->date()
                    ->tooltip(fn($state) => $state)
                    ->sortable()
                    ->label("Updated Date")
                    ->toggleable(isToggledHiddenByDefault: false),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->searchable()
                    ->color(fn(string $state): string => match ($state) {
                        'pending'   => "warning",
                        'confirmed' => "success",
                        'declined'  => "danger",
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

            ])
            ->filters([

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending'   => "Pending",
                        'confirmed' => "Confirmed",
                        'declined'  => "Declined"
                    ])
                    ->selectablePlaceholder(false)
                    ->label('Filter by Status')
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('network_id')
                    ->label('Network')
                    ->options(AffiliateNetwork::all()->pluck('name', 'id'))
                    ->preload()
                    ->searchable(),

            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
            ])
            ->headerActions([
                ImportAction::make()
                    ->importer(MockSaleImporter::class)
                    ->label("Import Sales CSV")
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
                                'pending'   => "Pending",
                                'confirmed' => "Confirmed",
                                'declined'  => "Declined"
                            ])
                            ->required(),
                    ])
                    ->action(function (Collection $records, array $data) {
                        MockSale::whereIn('id', $records->pluck('id'))->update(['status' => $data['status']]);
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

    public static function getRedirectUrl(): string
    {
        return static::getUrl('index');
    }


    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMockSales::route('/'),
            'create' => Pages\CreateMockSale::route('/create'),
            'view' => Pages\ViewMockSale::route('/{record}'),
            'edit' => Pages\EditMockSale::route('/{record}/edit'),
        ];
    }
}
