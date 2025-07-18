<?php

namespace App\Filament\Affiliate\Resources;

use App\Filament\Affiliate\Resources\PayoutResource\Pages;
use App\Filament\Affiliate\Resources\PayoutResource\RelationManagers;
use App\Models\Affiliate\Payout;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use ValentinMorice\FilamentJsonColumn\JsonColumn;
use Filament\Navigation\NavigationItem;
use Illuminate\Database\Eloquent\Collection;
use App\Filament\Actions\AffPaypalPayoutAction;
use Filament\Notifications\Notification;
use App\Filament\Affiliate\Resources\AffiliateResource;
use App\Models\Affiliate\Affiliate;
use App\Filament\Affiliate\Resources\PayoutResource\RelationManagers\PaymentLogsRelationManager;

class PayoutResource extends Resource
{
    protected static ?string $model = Payout::class;
    protected static ?string $navigationGroup = 'Payout';
    protected static ?string $modelLabel    = 'Payout Request';
    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Group::make()->schema([

                    Forms\Components\Section::make('Affiliate Payout Details')
                        ->description("Basic Affiliate Payout Request Information")
                        ->columns(2)
                        ->schema([

                        Forms\Components\Select::make('affiliate_id')
                            ->relationship('affiliate', 'name')
                            ->preload()
                            ->searchable()
                            ->disabledon("edit")
                            ->label('Affiliate')
                            ->required(),
                        
                        Forms\Components\TextInput::make('transaction_id')
                            ->label('Payout ID')
                            ->required()
                            ->infotip("System generated transaction id for the payout")
                            ->maxLength(255),
                            
                        Forms\Components\TextInput::make('requested_amount')
                            ->label('Requested Amount')
                            ->numeric()
                            ->prefix(config('freemoney.currencies.default'))
                            // ->prefixIcon("heroicon-o-currency-dollar")
                            ->required(),
                        
                        Forms\Components\TextInput::make('payment_method')
                            ->label('Payment Method')
                            ->required()
                            ->maxLength(50),

                        Forms\Components\TextInput::make('payment_account')
                            ->label('Payment Account')
                            ->required()
                            ->maxLength(255),        
            
                        // Forms\Components\TextInput::make('payment_details')
                        //     ->label('Payment Details'),

                        JsonColumn::make('payment_details')
                            ->label('Payment Details')        
                            ->columnSpanFull()              
                            ->viewerOnly(),
                
                    ])->columnSpan(2),

                    Forms\Components\Section::make('Api Response')
                        ->description("Payment Api Response details")
                        ->columns(2)
                        ->schema([

                            JsonColumn::make('api_response')
                                ->label('API Response')        
                                ->columnSpanFull()              
                                ->viewerOnly(),

                            Forms\Components\TextInput::make('api_reference_id')
                                ->label('Api Reference ID')
                                ->maxLength(255),

                            Forms\Components\TextInput::make('api_status')
                                ->label('Api Status')
                                ->maxLength(255),

                    ])->columns(2)->columnSpan(2),
                
                ])->columnSpan(2),
                
                Forms\Components\Group::make()->schema([
                                
                    Forms\Components\Section::make('Manage Request')                 
                        ->schema([

                            Forms\Components\Radio::make('status')
                                ->options([
                                    'pending'    => 'Pending', 
                                    'processing' => 'Processing', 
                                    'paid'       => 'Paid', 
                                    'rejected'   => 'Rejected',
                                ])
                                ->required()
                                ->inline()
                                ->inlineLabel(false)
                                ->default('pending'),

                            Forms\Components\DateTimePicker::make('paid_at')
                                ->native(false)
                                ->prefixIcon('heroicon-m-calendar')
                                ->label('Paid At'),

                            Forms\Components\Textarea::make('admin_notes')
                                ->hintIconTooltip('Use this note to log additional details for the request. Viewable only by admin')
                                ->label('Admin Notes')
                                ->maxLength(500),

                    ])->columnSpan(1),

                ])->columnSpan(1),


              

            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('affiliate.name')
                    ->url(fn ($record): string => AffiliateResource::getUrl('edit', ['record' => $record->affiliate->id] ))
                    ->openUrlInNewTab()
                    ->searchable(),             

                Tables\Columns\TextColumn::make('requested_amount')
                    ->label('Amount')
                    ->money(config('freemoney.currencies.default'))
                    ->searchable()
                    ->sortable(),               

                Tables\Columns\TextColumn::make('payment_method')
                    ->label("Payment Method")
                    ->searchable(),

                Tables\Columns\TextColumn::make('transaction_id')
                    ->label('Payout ID')
                    ->searchable(),

                Tables\Columns\TextColumn::make('paid_at')
                    ->label('Paid At')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => ucfirst($state))
                    ->color(fn($state) => match ($state) {                    
                       'pending'     => 'warning', 
                       'processing' => 'info', 
                       'paid'       => 'success', 
                       'rejected'  => 'danger',
                        default    => "gray",
                    })
                    ->searchable(),
            
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
                         'pending'    => 'Pending', 
                         'processing' => 'Processing', 
                         'paid'       => 'Paid', 
                         'rejected'   => 'Rejected',          
                    ])  
                    ->preload()
                    ->searchable()
                    ->label('Status'),

                Tables\Filters\SelectFilter::make('payment_method')
                    ->options(Payout::select("payment_method")->distinct()->pluck('payment_method', 'payment_method')->toArray())
                    ->preload()
                    ->searchable()
                    ->query(function (Builder $query, array $data): Builder {

                        if (isset($data['value']) && $data['value'] !== '') {
                            return $query->where('payment_method', $data['value']);
                        }                       
                        return $query;
                    })
                    ->label('Payment Method'),

                Tables\Filters\SelectFilter::make('affiliate_id')
                    ->relationship('affiliate', 'name')
                    ->preload()
                    ->searchable()
                    ->label('Affiliate'),
                    
            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip("View")->size("lg"),
                Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("lg"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([

                    Tables\Actions\DeleteBulkAction::make(),

                    Tables\Actions\BulkAction::make('process_paypal_payouts')
                        ->label('Process PayPal Payouts')
                        ->icon('fab-paypal')
                        ->visible(fn () => config('services.paypal.payout_enabled'))
                        ->action(function (Collection $records) {

                            // Check if PayPal is configured
                            if (empty(config('services.paypal.client_id')) || empty(config('services.paypal.client_secret'))) {
                                Notification::make()->warning()->title('PayPal is not configured')
                                    ->body('Please configure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.')
                                    ->send();
                                return;
                            }

                            $processed  = 0;
                            $failed     = 0;

                            foreach ($records as $record) {

                                if ($record->payment_method === 'paypal' && $record->status === 'pending') {
                                    try {
                                        AffPaypalPayoutAction::initiatePayoutRequest($record);
                                        $processed++;
                                        // \Log::info("Bulk Action => preformed");
                                    } catch (\Exception $e) {
                                        $failed++;
                                        \Log::error("Bulk Action ==> PayPal payout failed: " . $e->getMessage());
                                    }
                                }
                            }

                            Notification::make()
                                ->success()
                                ->title('Bulk process completed')
                                ->body("Processed: {$processed}, Failed: {$failed}")
                                ->send();
                    })
                    ->deselectRecordsAfterCompletion(),
                    ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            PaymentLogsRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index'     => Pages\ListPayouts::route('/'),
            'create'    => Pages\CreatePayout::route('/create'),
            'view'      => Pages\ViewPayout::route('/{record}'),
            'edit'      => Pages\EditPayout::route('/{record}/edit'),
        ];
    }


    public static function getNavigationItems(): array
    {
        $items = parent::getNavigationItems();

        if (config('services.paypal.payout_enabled')) {
            $items[] = NavigationItem::make('paypal-payouts')
                ->label('PayPal Payouts')
                ->icon('fab-paypal') // Using our custom PayPal icon
                ->badge(Payout::where('payment_method', 'paypal')->count())
                ->url(static::getUrl('index', ['tableFilters' => ['payment_method' => ['value' => 'paypal']]]))
                ->group('Payout')
                ->sort(6);
        }

       return $items;
    }

}
