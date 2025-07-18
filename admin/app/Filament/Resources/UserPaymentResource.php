<?php

namespace App\Filament\Resources;

use App\Enums\PaymentStatus;
use App\Filament\Actions\PaypalPayoutAction;
use App\Filament\Resources\UserPaymentResource\Pages;
use App\Filament\Resources\UserPaymentResource\RelationManagers;
use App\Models\FrontUser;
use App\Models\PaymentType;
use App\Models\UserPayment;
use Filament\Forms;
// use Filament\Forms\Components\Group;
// use Filament\Forms\Components\Section;
// use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Navigation\NavigationItem;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Support\Enums\IconPosition;
use Filament\Tables;
// use Filament\Tables\Enums\FiltersLayout;
// use Filament\Tables\Filters\QueryBuilder;
// use Filament\Tables\Filters\QueryBuilder\Constraints\NumberConstraint;
// use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint;
// use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint\Operators\IsRelatedToOperator;
// use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use ValentinMorice\FilamentJsonColumn\JsonColumn;
use carbon\carbon;
use Illuminate\Support\HtmlString;

class UserPaymentResource extends Resource
{
    protected static ?string $model = UserPayment::class;

    protected static ?int $navigationSort = 5;
    protected static ?string $navigationGroup = "Manage Users";
    protected static ?string $navigationLabel = 'Users Payout Requests';
    protected static ?string $navigationIcon = 'heroicon-o-receipt-percent';
    protected static ?string $modelLabel = 'Users Payout Requests';

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

                                Forms\Components\DateTimePicker::make('paid_at')
                                    ->label('Paid At')
                                    ->native(false)
                                    ->prefixicon('heroicon-o-calendar'),

                                Forms\Components\DateTimePicker::make('updated_at')
                                    ->label('Updated At')
                                    ->native(false)
                                    ->prefixicon('heroicon-o-calendar'),

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
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('paymentMethod.name')
                    ->description(fn($record) => $record->paymentMethod?->payment_group)
                    ->searchable()
                    ->url(fn($record): string => PaymentTypeResource::getUrl('edit', ['record' => $record->paymentMethod?->id ?? '#']))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab(),

                Tables\Columns\TextColumn::make('account')
                    ->limit(25)
                    ->tooltip(fn($state) => $state )
                    ->searchable(),

                Tables\Columns\TextColumn::make('amount')
                    ->formatStateUsing(fn($state) => formatCurrency($state)),            
               
                // Tables\Columns\TextColumn::make('status')
                //     ->badge(),

                Tables\Columns\TextColumn::make('paid_at')
                    ->label("Paid At")                   
                    ->formatStateUsing(fn($state) => $state ?? 'N/A')
                    ->dateTime()
                    ->sortable(),
                
                Tables\Columns\SelectColumn::make('status')
                    ->label(new HtmlString('<div style="width:120px; text-align:left;">Status</div>'))
                    ->options([
                        'created'       =>  'Created',
                        'processing'    =>  'Processing',
                        'completed'     =>  'Completed',
                        'declined'      =>  'Declined',
                    ])
                    ->selectablePlaceholder(false),

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
                    ->options(FrontUser::pluck("email", "id"))
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

                Tables\Filters\Filter::make('paid_at')
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("Paid Date from")->columnSpan(1)->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("Paid Date until")->columnSpan(1)->icon('heroicon-s-calendar'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('paid_at', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('paid_at', '<=', $data['until']));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                
                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'Paid Date from ' . Carbon::parse($data['from'])->toFormattedDateString();
                        }
                
                        if ($data['until'] ?? null) {
                            $indicators['until'] = 'Paid Date until ' . Carbon::parse($data['until'])->toFormattedDateString();
                        }
                
                        return $indicators;
                }),
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
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUserPayments::route('/'),
            'create' => Pages\CreateUserPayment::route('/create'),
            'edit' => Pages\EditUserPayment::route('/{record}/edit'),
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

        // if (config('services.paypal.payout_enabled'))
        if (config('services.paypal.payout_enabled'))
        {   
            // dd(config('services.paypal.client_secret'));
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
