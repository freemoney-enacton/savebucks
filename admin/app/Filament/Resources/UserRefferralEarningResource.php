<?php

namespace App\Filament\Resources;

use App\Enums\NetworkType;
use App\Enums\TransactionStatus;
use App\Filament\Resources\UserRefferralEarningResource\Pages;
use App\Filament\Resources\UserRefferralEarningResource\RelationManagers;
use App\Models\FrontUser;
use App\Models\Network;
use App\Models\Offer;
use App\Models\UserRefferralEarning;
use Filament\Forms;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\IconPosition;
use Filament\Tables;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\QueryBuilder;
use Filament\Tables\Filters\QueryBuilder\Constraints\DateConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\NumberConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint\Operators\IsRelatedToOperator;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Filament\Resources\Concerns\Translatable;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserRefferralEarningResource extends Resource
{
    use Translatable;
    protected static ?string $model = UserRefferralEarning::class;

    protected static ?int $navigationSort       = 4;
    protected static ?string $navigationGroup   = "Manage Users";
    protected static ?string $navigationLabel   = 'Users Referral Earnings';
    protected static ?string $navigationIcon    = 'heroicon-o-rectangle-stack';
    protected static ?string $modelLabel        = 'Users Referral Earnings';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('sales_id')->disabled(true),
                Select::make('user_id')->label('Referrer')
                    ->relationship('user', 'name')
                    ->disabled(true),
                Select::make('referee_id')->label('Referee')
                    ->relationship('referee', 'name')
                    ->disabled(true),
                // Select::make('task_offer_id')->label('Offer')
                //     // ->relationship('offer', 'name')
                //     ->options(Offer::all()->pluck('name', 'id'))
                //     ->formatStateUsing(fn($state) => $state == $state ?? 'Na')
                //     ->disabled(true),
                TextInput::make('task_offer_id')
                    ->formatStateUsing(fn($state) => Offer::where('offer_id',$state)->pluck('name') ?? '')
                    ->label('Offer'),
                TextInput::make('amount')->disabled(true),
                TextInput::make('referral_amount')->disabled(true),
                DateTimePicker::make('transaction_time')->disabled(true),
                Textarea::make('note')->disabled(true),
                Textarea::make('admin_note')->disabled(false),
                Radio::make('status')->disabled(false)
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'declined' => 'Rejected',
                    ])->inline()->inlineLabel(false)->columnSpanFull(),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label("User")
                    ->description(fn(UserRefferralEarning $record) => $record->user ? $record->user->email : 'NA')
                    ->sortable()
                    ->limit(15)
                    ->tooltip(fn(UserRefferralEarning $record) => $record->user ? ($record->user->name . '(' . $record->user->email . ')') : 'NA')
                    ->url(fn($record): string => FrontUserResource::getUrl('edit', ['record' => $record->user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab()
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->whereHas('user', fn($q) => $q->where('users.name', 'like', "%{$search}%")->orWhere('users.email', 'like', "%{$search}%"));
                    }),

                Tables\Columns\TextColumn::make('referee.name')
                    ->label("Referee")
                    ->description(fn(UserRefferralEarning $record) => $record->referee ? $record->referee->email : 'NA')
                    ->sortable()
                    ->limit(15)
                    ->tooltip(fn(UserRefferralEarning $record) => $record->referee ? ($record->referee->name . '(' . $record->referee->email . ')') : 'NA')
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->whereHas('referee', fn($q) => $q->where('users.name', 'like', "%{$search}%")->orWhere('users.email', 'like', "%{$search}%"));
                    }),

                Tables\Columns\TextColumn::make('networkModel.name')
                    ->label("Network")
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->where('network', 'like', "%{$search}%")
                            ->orWhereHas('networkModel', fn($q) => $q->where('name', 'like', "%{$search}%"));
                    }),

                Tables\Columns\TextColumn::make('offer_name')
                    ->label('Offer')
                    ->state(fn(UserRefferralEarning $record) => ($record->offer ? $record->offer->name : 'NA'))
                    ->description(fn(UserRefferralEarning $record) => $record->offer_id ?? null)
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->where('offer_id', 'like', "%{$search}%")
                            ->orWhereHas('offer', fn($q) => $q->where('name', 'like', "%{$search}%"));
                    })
                    ->limit(15)
                    ->tooltip(fn(UserRefferralEarning $record) => ($record->offer ? $record->offer->name : 'NA')),

                Tables\Columns\TextColumn::make('transaction_id')
                    ->label('Transaction ID')
                    ->searchable(),

                Tables\Columns\TextColumn::make('task_type')
                    ->badge(),

                Tables\Columns\TextColumn::make('referral_amount')
                    ->label("Referral Earning")
                    ->formatStateUsing(fn($state) => formatCurrency($state))
                    ->sortable(),

                Tables\Columns\TextColumn::make('amount')
                    ->label("Task Earning")
                    ->formatStateUsing(fn($state) => formatCurrency($state))
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('payout')
                    ->label("Revenue")
                    ->formatStateUsing(fn($state) => formatCurrency($state))
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->badge(),

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
                    
                Tables\Filters\SelectFilter::make('referee_id')
                    ->label("Referees")
                    ->options(
                        FrontUser::all()->pluck('name', 'id')
                            ->mapWithKeys(fn($name, $id) => [$id => $name . ' - ' . FrontUser::find($id)->email])
                            ->toArray()
                    )
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
                }),


            ])
            ->filtersFormColumns(2)
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),             
            ])
            ->bulkActions([]);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canDeleteAny(): bool
    {
        return false;
    }

    public static function canDelete(Model $record): bool
    {
        return false;
    }

    public static function canEdit(Model $record): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageUserRefferralEarnings::route('/'),
        ];
    }
}
