<?php

namespace App\Filament\Resources;

use App\Enums\NetworkType;
use App\Enums\TransactionStatus;
use App\Filament\Resources\UserOfferSaleResource\Pages;
use App\Filament\Resources\UserOfferSaleResource\RelationManagers\UserTaskUploadsRelationManager;
use App\Models\FrontUser;
use App\Models\Network;
use App\Models\Offer;
use App\Models\OfferGoal;
use App\Models\UserOfferSale;
use App\Models\UserTaskUpload;
use Filament\Forms;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Grid;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use ValentinMorice\FilamentJsonColumn\JsonColumn;
use Filament\Resources\Concerns\Translatable;
use Filament\Tables\Actions\BulkAction;
use Filament\Support\Enums\IconPosition;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\QueryBuilder;
use Filament\Tables\Filters\QueryBuilder\Constraints\NumberConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint\Operators\IsRelatedToOperator;
use Filament\Tables\Filters\QueryBuilder\Constraints\SelectConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;
use carbon\carbon;
use Illuminate\Support\HtmlString;
use Illuminate\Database\Eloquent\Collection;
use App\Notifications\UserOfferwallSaleUpdate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class UserOfferSaleResource extends Resource
{
    use Translatable;

    protected static ?string $model = UserOfferSale::class;

    protected static ?int $navigationSort       = 2;
    protected static ?string $navigationGroup   = "Manage Users";
    protected static ?string $navigationLabel   = 'Users Task Earnings';
    protected static ?string $navigationIcon    = 'heroicon-o-archive-box-arrow-down';
    protected static ?string $modelLabel        = 'Users Task Earning';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Grid::make(2)
                    ->schema([

                        Group::make()->schema([

                            Section::make("Basic Information")
                                ->schema([
                                    Forms\Components\Select::make('user_id')
                                        ->label('User')
                                        ->relationship('user', 'name')
                                        ->disabledOn('edit'),

                                    Forms\Components\Select::make('network')
                                        ->required()
                                        ->options(Network::pluck('name', 'code')),
                                        // ->disabledOn('edit'),

                                    Forms\Components\TextInput::make('network'),
                                    

                                    Forms\Components\TextInput::make('task_name')
                                        ->label("Offer Name")
                                        ->disabledOn('edit')
                                        ->maxLength(255),

                                    Forms\Components\TextInput::make('offer_id')
                                        ->label("Offer Id (Campaign ID)")
                                        ->disabledOn('edit'),

                                    Forms\Components\Radio::make('task_type')
                                        ->options(NetworkType::class)
                                        ->disabledOn('edit'),

                                    Forms\Components\TextInput::make('network_goal_id')
                                        ->disabledOn('edit'),
                                ])->columnspan(1),

                            Section::make("Additional Info")
                                ->schema([
                                    JsonColumn::make('extra_info')
                                        ->viewerOnly()
                                        ->columnSpanFull(),
                                ])
                                ->columnSpanFull(),

                        ]),

                        Group::make()->schema([
                            Section::make("Manage")
                                ->schema([
                                    Forms\Components\DateTimePicker::make('created_at'),
                                    // ->disabledOn('edit'),

                                    Forms\Components\DateTimePicker::make('updated_at')
                                        ->disabledOn('edit'),

                                    Forms\Components\TextInput::make('amount')
                                        ->required()
                                        ->disabledOn('edit')
                                        ->numeric(),

                                    Forms\Components\TextInput::make('payout')
                                        ->disabled('edit')
                                        ->required()
                                        ->numeric(),

                                    Forms\Components\Radio::make('status')
                                        ->inline()
                                        ->inlineLabel(false)
                                        ->required()
                                        ->options(TransactionStatus::class),

                                    Forms\Components\Textarea::make('note')
                                        ->maxLength(500),

                                    Forms\Components\Textarea::make('admin_note')
                                        ->maxLength(500),
                                ])->columnspan(1),
                        ]),
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn($query) => $query->has('user'))
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->description(fn(UserOfferSale $record) => $record->user->email)
                    ->sortable()
                    ->limit(15)
                    ->tooltip(fn(UserOfferSale $record) => $record->user->name . '(' . $record->user->email . ')')
                    ->url(fn($record): string => FrontUserResource::getUrl('edit', ['record' => $record->user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab()
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->whereHas('user', fn($q) => $q->where('users.name', 'like', "%{$search}%")->orWhere('users.email', 'like', "%{$search}%"));
                    }),
                

                Tables\Columns\TextColumn::make('networkModel.name')
                    ->description(fn($record) => $record->network)
                    ->label("Network")
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->where('network', 'like', "%{$search}%")
                            ->orWhereHas('networkModel', fn($q) => $q->where('name', 'like', "%{$search}%"));
                    }),

                Tables\Columns\TextColumn::make('offer_name')
                    ->label('Offer')
                    ->state(fn(UserOfferSale $record) => $record->task_name ?? null)
                    // ->description(fn(UserOfferSale $record) => $record->offer_id ?? null)
                    ->description(fn(UserOfferSale $record) => Str::limit($record->offer_id ?? '', 25))
                    ->searchable(['task_name', 'offer_id'])
                    ->limit(15)
                    ->tooltip(fn(UserOfferSale $record) => $record->task_name ?? null),

                Tables\Columns\TextColumn::make('transaction_id')
                    ->label('Transaction ID')
                    ->limit(15)
                    ->tooltip(fn($state)=>$state)
                    ->searchable(),

                Tables\Columns\TextColumn::make('task_type')
                    ->searchable()
                    ->badge(),

                Tables\Columns\TextColumn::make('amount')
                    ->label("Task Earning")
                    ->formatStateUsing(fn($state) => formatCurrency($state))
                    ->sortable(),

                Tables\Columns\TextColumn::make('payout')
                    ->label("Revenue")
                    ->formatStateUsing(fn($state) => formatCurrency($state))
                    ->sortable(),
                    
                // Tables\Columns\TextColumn::make('status')
                //     ->badge(), 

                Tables\Columns\SelectColumn::make('status')
                    ->label(new HtmlString('<div style="width:120px; text-align:left;">Status</div>'))
                    ->options([
                        'pending'    => 'Pending',
                        'confirmed'  => 'Confirmed',
                        'declined'   => 'Declined',
                        'expired'    => 'Expired',
                    ])
                    ->alignEnd()
                    ->beforeStateUpdated(function ($record, $state) {
                        // Store the old status in a temporary property
                        session()->put("old_status_{$record->id}", $record->status?->value ?? $record->status);
                    })
                    ->afterStateUpdated(function ($record, $state) {
                        // Get the old status from temporary property
                         $oldStatus = session()->pull("old_status_{$record->id}");
                        
                        // Send notification when status is manually changed to confirmed or declined
                        if ($state !== $oldStatus && in_array($state, ['confirmed', 'declined'])) {

                            if ($record->user) {
                                $record->user->notify(new \App\Notifications\UserOfferwallSaleUpdate($record, $state, $oldStatus));
                            }
                        }

                        if ($state === 'confirmed' && $state !== $oldStatus) {
                            Log::info("ticker entry enter ==>");
                            $resource = new static();
                            $resource->createTickerEntry($record);
                        }
                        
                        Log::info("Resource user-offer-sales/User task earning  ====> Status changed for user offer sale {$record->id} from {$oldStatus} to {$state}");

                        // Clean up temporary property
                        unset($record->_oldStatus);
                    })
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
                    ->options(FrontUser::pluck("email","id"))
                    ->searchable()
                    ->preload(),

                Tables\Filters\SelectFilter::make('network')
                    ->label("Network")
                    ->options(Network::getAll())
                    ->searchable()
                    ->preload(),

                Tables\Filters\SelectFilter::make('task_type')
                    ->label("Task Type")
                    ->options(NetworkType::class),

                Tables\Filters\SelectFilter::make('status')
                    ->label("Status")
                    ->options(TransactionStatus::class),

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
                }),

                Tables\Filters\Filter::make('created_at')
                ->form([
                    Forms\Components\DatePicker::make('from')->native(false)->label("Created from")->columnSpan(1)->icon('heroicon-s-calendar'),
                    Forms\Components\DatePicker::make('until')->native(false)->label("Created until")->columnSpan(1)->icon('heroicon-s-calendar'),
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
            })

            ])
            ->filtersFormColumns(2)
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
                // Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([

                Tables\Actions\BulkActionGroup::make([]),
                
                BulkAction::make('change_status')
                ->label('Change Status')
                ->modalWidth('lg')
                ->form([
                    Forms\Components\Select::make('status')
                        ->label('Select Status')
                        ->options(TransactionStatus::class)
                        ->required(),
                ])
                ->action(function (Collection $records, array $data) {

                      $newStatus = $data['status'];
                        
                        // Process each record individually to send notifications
                        $records->each(function ($record) use ($newStatus) {
                            $oldStatus = $record->status?->value ?? $record->status;
                            
                            // Update the record
                            $record->update(['status' => $newStatus]);
                            
                            // Send notification if status changed to confirmed or declined
                            if ($newStatus !== $oldStatus && in_array($newStatus, ['confirmed', 'declined'])) {
                                if ($record->user) {
                                    $record->user->notify(new \App\Notifications\UserOfferwallSaleUpdate($record, $newStatus, $oldStatus));                                    
                                }
                            }
                            Log::info('Resource : Useroffersale ===>  Updated record with ID by bulk ' . $record->id . ' to status ' . $newStatus);
                        });

                    // UserOfferSale::whereIn('id', $records->pluck('id'))->update(['status' => $data['status']]);
                })
                ->deselectRecordsAfterCompletion()
                ->button(),

            ]);
    }

    public static function getRelations(): array
    {
        return [
            UserTaskUploadsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUserOfferSales::route('/'),
            // 'create' => Pages\CreateUserOfferSale::route('/create'),
            'edit' => Pages\EditUserOfferSale::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }

  private function createTickerEntry($userOfferSale)
    {
        // Log::info('Ticker entry creation started for user offer sale ID: ' . $userOfferSale->id . "STATUS " . $userOfferSale->status->value);

        // Only create if status is confirmed
        if ($userOfferSale->status->value !== 'confirmed') {
            Log::info('Ticker entry not created: Status is not confirmed.');
            return;
        }

        // Log data before processing
        // Log::info('Preparing ticker data...', [
        //     'amount' => $userOfferSale->amount,
        //     'userName' => $userOfferSale->user->name ?? 'Unknown',
        //     'offerName' => $userOfferSale->task_name ?? 'Unknown Offer',
        //     'providerName' => $userOfferSale->networkModel->name ?? $userOfferSale->network ?? 'Unknown Provider'
        // ]);

        // Create the JSON data
        $tickerData = [
            'rewards'       => number_format($userOfferSale->amount, 2),
            'userName'      => $userOfferSale->user->name ?? 'Unknown',
            'offerName'     => $userOfferSale->task_name ?? 'Unknown Offer',
            'providerName'  => $userOfferSale->networkModel->name ?? $userOfferSale->network ?? 'Unknown Provider'
        ];

        // Prepare ticker entry data
        $tickerEntry = [
            'user_id'     => $userOfferSale->user_id,
            'ticker_type' => 'Earnings',
            'ticker_data' => json_encode($tickerData),
            'created_at'  => now(),
        ];

        // Log ticker entry data before insertion
        // Log::info('Ticker entry data prepared:', [
        //     'tickerEntry' => $tickerEntry
        // ]);

        // Insert into tickers table
        try {
            \DB::table('tickers')->insert($tickerEntry);
            Log::info('Ticker entry successfully inserted into the database for user offer sale ID: ' . $userOfferSale->id);
        } catch (\Exception $e) {
            Log::error('Failed to insert ticker entry into the database for user offer sale ID: ' . $userOfferSale->id, [
                'error' => $e->getMessage()
            ]);
        }

        // Log the ticker entry creation
        // Log::info('Ticker entry created for user offer sale ID: ' . $userOfferSale->id, [
        //     'tickerData' => $tickerData,
        // ]);
    }

}
