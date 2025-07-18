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

class PayoutResource extends Resource
{
    protected static ?string $model = Payout::class;
    protected static ?string $navigationGroup = 'Payout';
    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Affiliate Payout Details')
                    ->description("Enter Affiliate Payout Information")
                    ->columns(2)
                    ->schema([

                    Forms\Components\Select::make('affiliate_id')
                        ->relationship('affiliate', 'name')
                        ->preload()
                        ->searchable()
                        ->label('Affiliate')
                        ->required(),
                        
                    Forms\Components\TextInput::make('requested_amount')
                        ->label('Requested Amount')
                        ->required()
                        ->numeric(),

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

                    Forms\Components\TextInput::make('payment_method')
                        ->label('Payment Method')
                        ->required()
                        ->maxLength(50),

                    Forms\Components\TextInput::make('payment_account')
                        ->label('Payment Account')
                        ->infotip("Paypal email or Payment account email for the payment method")
                        ->required()
                        ->maxLength(255),

                    Forms\Components\TextInput::make('payment_details')
                        ->label('Payment Details'),

                    Forms\Components\TextInput::make('admin_notes')
                        ->hintIconTooltip('Use this note to log additional details for the request. Viewable only by admin')
                        ->label('Admin Notes')
                        ->maxLength(500),

                    Forms\Components\TextInput::make('transaction_id')
                        ->label('Transaction ID')
                        ->maxLength(255),

                    JsonColumn::make('api_response')
                        ->label('API Response')
                        ->viewerOnly(),

                    Forms\Components\DateTimePicker::make('paid_at')
                        ->native(false)
                        ->prefixIcon('heroicon-m-calendar')
                        ->label('Paid At'),

                ]),

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('affiliate.name')
                    ->numeric()
                    ->searchable(),             

                Tables\Columns\TextColumn::make('requested_amount')
                    ->label('Amount')
                    ->numeric()
                    ->searchable()
                    ->sortable(),               

                Tables\Columns\TextColumn::make('payment_method')
                    ->searchable(),

                Tables\Columns\TextColumn::make('transaction_id')
                    ->label('Transaction ID')
                    ->searchable(),

                Tables\Columns\TextColumn::make('paid_at')
                    ->label('Paid At')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
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
            'index' => Pages\ListPayouts::route('/'),
            'create' => Pages\CreatePayout::route('/create'),
            'view' => Pages\ViewPayout::route('/{record}'),
            'edit' => Pages\EditPayout::route('/{record}/edit'),
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
