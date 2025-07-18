<?php

namespace App\Filament\Resources;

use App\Enums\PaymentStatus;
use App\Filament\Actions\PaypalPayoutAction;
use App\Filament\Resources\GiftCardPayoutResource\Pages;
use App\Filament\Resources\GiftCardPayoutResource\RelationManagers;
use App\Filament\Actions\GiftCardPayoutAction;
use App\Models\GiftCardPayout;
use App\Models\FrontUser;
use App\Models\PaymentType;
use App\Models\UserPayment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Database\Eloquent\Collection;
use ValentinMorice\FilamentJsonColumn\JsonColumn;
use Filament\Navigation\NavigationItem;
use Filament\Notifications\Notification;
use Filament\Support\Enums\IconPosition;
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Forms\Components\Select;
use Illuminate\Support\HtmlString;

class GiftCardPayoutResource extends Resource
{
    protected static ?string $model = GiftCardPayout::class;
    protected static ?int $navigationSort = 8;
    protected static ?string $navigationGroup = "Manage Users";
    protected static ?string $navigationIcon = 'heroicon-o-gift';


    public static function form(Form $form): Form
    {
        return $form
            ->columns(3)
            ->schema([
                Forms\Components\Group::make()
                    ->columnSpan(2)
                    ->schema([
                        Forms\Components\Section::make('Request Details')
                            ->schema([
                                Forms\Components\TextInput::make('payment_id')
                                    ->required()
                                    ->numeric(),
                                Forms\Components\Select::make('user_id')
                                    ->relationship('user', 'name')
                                    ->required(),
                                Forms\Components\Select::make('payment_method_code')
                                    ->relationship('paymentMethod', 'name')
                                    ->columnSpanFull()                            
                                    ->getOptionLabelFromRecordUsing(fn(PaymentType $paymentType) => $paymentType->name)
                                    ->required(),
                                Forms\Components\TextInput::make('account')
                                    ->columnSpanFull()
                                    ->required()
                                    ->maxLength(255),
                                JsonColumn::make('payment_input')->label('Additional Info')
                                    ->viewerOnly()
                                    ->columnSpanFull(),
                                Forms\Components\TextInput::make('amount')
                                    ->required()
                                    ->minValue(0)
                                    ->numeric(),
                                Forms\Components\TextInput::make('payable_amount')
                                    ->required()
                                    ->minValue(0)
                                    ->numeric(),
                            ])->columns(2)->disabledOn('edit'),
                        Forms\Components\Section::make('Api Information')
                            ->schema([
                                Forms\Components\TextInput::make('api_reference_id')
                                    ->maxLength(255)
                                    ->default(null),
                                Forms\Components\TextInput::make('api_status')
                                    ->maxLength(255)
                                    ->default(null),
                                JsonColumn::make('api_response')
                                    ->viewerOnly()
                                    ->columnSpanFull(),
                            ])->columns(2)->disabledOn('edit'),
                    ]),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Manage Request')
                            ->schema([
                                Forms\Components\DateTimePicker::make('paid_at'),
                                Forms\Components\Radio::make('status')
                                    ->options(PaymentStatus::class)->default('created')
                                    ->required()
                                    ->inline()
                                    ->inlineLabel(false)
                                    ->columnSpanFull(),
                                Forms\Components\Textarea::make('note')
                                    ->label('User Note')
                                    ->hintIcon('heroicon-o-question-mark-circle')
                                    ->hintIconTooltip('Add a note to provide additional details to the user about this request.')
                                    ->maxLength(255)
                                    ->default(null),
                                Forms\Components\Textarea::make('admin_note')
                                    ->label('Internal Note')
                                    ->hintIcon('heroicon-o-question-mark-circle')
                                    ->hintIconTooltip('Use this note to log additional details for the request. Viewable only by admin')
                                    ->maxLength(255)
                                    ->default(null),
                            ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            // ->modifyQueryUsing(function (Builder $query) {
            //     // return $query->where('payment_method_code', 'gv');
            //     return $query;
            // })
            ->columns([

                Tables\Columns\TextColumn::make('user.name')
                    ->description(fn($record) => $record->user->email)
                    ->sortable()
                    ->searchable()
                    ->limit(15)
                    ->tooltip(fn($record) => $record->user->name . '(' . $record->user->email . ')')
                    ->url(fn($record): string => FrontUserResource::getUrl('edit', ['record' => $record->user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab()
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->whereHas('user', fn($q) => $q->where('users.name', 'like', "%{$search}%")->orWhere('users.email', 'like', "%{$search}%"));
                    }),

                Tables\Columns\TextColumn::make('payment_id')
                    ->label("Payment Id")
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('paymentMethod.name')
                    ->label("Payment Method")
                    ->description(fn($record) => $record->paymentMethod?->payment_group)
                    ->searchable()
                    ->url(fn($record): string => PaymentTypeResource::getUrl('edit', ['record' => $record->paymentMethod?->id ?? '#']))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab(),

                Tables\Columns\TextColumn::make('account')
                    ->limit(25)
                    ->tooltip(fn($state)=>$state)
                    ->searchable(),

                Tables\Columns\TextColumn::make('amount')
                    ->formatStateUsing(fn($state) => formatCurrency($state)),

                Tables\Columns\SelectColumn::make('status')
                    ->label(new HtmlString('<div style="width:120px; text-align:left;">Status</div>'))
                    ->options([
                        'created'       =>  'Created',
                        'processing'    =>  'Processing',
                        'completed'     =>  'Completed',
                        'declined'      =>  'Declined',
                    ])
                    ->selectablePlaceholder(false),

                Tables\Columns\TextColumn::make('paid_at')
                    ->label("Paid At")
                    ->formatStateUsing(fn($state) => $state ?? 'N/A')
                    ->dateTime()
                    ->sortable(),

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

                Tables\Filters\SelectFilter::make('user_id')
                    ->label("Users")
                    ->options(FrontUser::get())
                    ->searchable()
                    ->preload(),

                Tables\Filters\SelectFilter::make('payment_method_code')
                    ->label("Payment Method")
                    ->options(PaymentType::pluck('name', 'code'))
                    ->searchable()
                    ->preload(),
                    
                Tables\Filters\SelectFilter::make('status')
                    ->label("Status")
                    ->options(PaymentStatus::class),
            ])
            ->filtersFormColumns(2)
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
                
                Tables\Actions\BulkAction::make('process_paypal_payouts')
                    ->label('Process PayPal Payouts')
                    ->icon('fab-paypal')
                    ->visible(fn() => config('services.paypal.payout_enabled'))
                    ->action(function (Collection $records) {
                        $processed = 0;
                        $failed = 0;

                        foreach ($records as $record) {
                            if ($record->payment_method_code === 'paypal' && $record->status === 'created') {
                                try {
                                    PaypalPayoutAction::initiatePayoutRequest($record);
                                    $processed++;
                                } catch (\Exception $e) {
                                    $failed++;
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

                Tables\Actions\BulkAction::make('process_tango_payouts')
                    ->label('Process Tango Gift Card Payouts')
                    ->icon('heroicon-o-gift')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Process Tango Gift Card Payouts')
                    ->modalDescription('Are you sure you want to process the selected Tango gift card payout requests? This action cannot be undone.')
                    ->modalSubmitActionLabel('Yes, Process Payouts')
                    ->action(function (Collection $records) {
                        $processed  = 0;
                        $failed     = 0;
                        $skipped    = 0;

                        foreach ($records as $record) {
                            // Only process gift card payouts with 'created' status
                            if ($record->payment_method_code === 'giftcard' && $record->status === PaymentStatus::Created) {
                                try {
                                    GiftCardPayoutAction::initiatePayoutRequest($record);
                                    $processed++;
                                } catch (\Exception $e) {
                                    $failed++;
                                    // Log the error for debugging
                                    \Log::error('Bulk Tango payout failed for record ' . $record->id, [
                                        'error' => $e->getMessage(),
                                        'record_id' => $record->id,
                                        'payment_id' => $record->payment_id
                                    ]);
                                }
                            } else {
                                $skipped++;
                            }
                        }

                        // Send notification with results
                        $notificationType = $failed > 0 ? 'warning' : 'success';
                        $title = $failed > 0 ? 'Tango bulk process completed with errors' : 'Tango bulk process completed successfully';
                        
                        $body = "Processed: {$processed}";
                        if ($failed > 0) {
                            $body .= ", Failed: {$failed}";
                        }
                        if ($skipped > 0) {
                            $body .= ", Skipped: {$skipped} (wrong payment method or status)";
                        }

                        Notification::make()
                            ->{$notificationType}()
                            ->title($title)
                            ->body($body)
                            ->persistent($failed > 0) // Keep notification visible if there were failures
                            ->send();
                    })
                    ->deselectRecordsAfterCompletion(),

                BulkAction::make('change_status')
                    ->label('Bulk Status Change')
                    ->icon('heroicon-o-check-circle')
                    ->modalWidth('lg')
                    ->form([
                        Select::make('status')
                        ->options(PaymentStatus::class)                
                        ->required()
                  
                    ])
                    ->action(function(Collection $records, array $data) {
                                               
                        GiftCardPayout::whereIn('id', $records->pluck('id'))
                        ->update(['status' => $data['status']]);
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
            'index' => Pages\ListGiftCardPayouts::route('/'),
            'create' => Pages\CreateGiftCardPayout::route('/create'),
            // 'view' => Pages\ViewGiftCardPayout::route('/{record}'),
            'edit' => Pages\EditGiftCardPayout::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function boot()
    {
        parent::boot();
    }

    public static function getNavigationItems(): array
    {
        $items = parent::getNavigationItems();

        if (config('services.paypal.payout_enabled')) {
            $items[] = NavigationItem::make('paypal-payouts')
                ->label('PayPal Payouts')
                ->icon('fab-paypal') // Using our custom PayPal icon
                ->badge(UserPayment::where('payment_method_code', 'paypal')->count())
                ->url(static::getUrl('index', ['tableFilters' => ['payment_method_code' => ['value' => 'paypal']]]))
                ->group('Manage Users')
                ->sort(6);
        }

        return $items;
    }
}
