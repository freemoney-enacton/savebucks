<?php

namespace App\Filament\Resources;

use App\Enums\TransactionStatus;
use App\Filament\Resources\UserBonusResource\Pages;
use App\Filament\Resources\UserBonusResource\RelationManagers;
use App\Models\BonusCode;
use App\Models\BonusType;
use App\Models\FrontUser;
use App\Models\UserBonus;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\IconPosition;
use Filament\Tables;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\QueryBuilder;
use Filament\Tables\Filters\QueryBuilder\Constraints\DateConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint\Operators\IsRelatedToOperator;
use Filament\Tables\Filters\QueryBuilder\Constraints\SelectConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserBonusResource extends Resource
{
    protected static ?string $model = UserBonus::class;

    protected static ?int $navigationSort = 5;
    protected static ?string $navigationGroup = "Sales & Cashback";
    protected static ?string $navigationLabel = 'Bonus Transactions';
    protected static ?string $navigationIcon = 'heroicon-o-trophy';
    protected static ?string $modelLabel = 'Bonus Transactions';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Bonus Details')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('User')
                            ->preload()
                            ->searchable()
                            ->relationship('user', 'email')
                            ->required()
                            ->disabledOn('edit'),
                        Forms\Components\TextInput::make('bonus_code')
                            // ->disabledOn('edit')
                            ->label('Bonus')
                            ->required()
                            ->maxLength(25),
                        // Forms\Components\Select::make('bonus_code')
                        //     ->label('Bonus Code')
                        //     ->preload()
                        //     ->searchable()
                        //     ->options(BonusType::pluck("name", 'code'))
                        //     ->required(),
                            // ->disabledOn('edit'),                        
                        Forms\Components\TextInput::make('amount')
                            ->required()
                            ->numeric(),
                        Forms\Components\DateTimePicker::make('awarded_on')->label('Awarded On'),
                        Forms\Components\DateTimePicker::make('expires_on')->label('Expires On'),
                    ])
                    ->columns(3),

                Section::make('Manage Bonus')->schema([
                    Forms\Components\Textarea::make('admin_note')
                        ->label('Admin Note')
                        ->maxLength(500)
                        ->default(null),
                    Forms\Components\Radio::make('status')
                        ->options(TransactionStatus::class)
                        ->default('pending')
                        ->required()
                        ->inline()
                        ->inlineLabel(false),
                ]),
            ]);
    }

    public static function canCreate(): bool
    {
        return true;
    }

    public static function canDelete(Model $record): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn($query) => $query->has('user'))
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->description(fn(UserBonus $record) => $record->user?->email)
                    ->sortable()
                    ->limit(15)
                    ->tooltip(fn(UserBonus $record) => $record->user?->name . '(' . $record->user?->email . ')')
                    ->url(fn($record): string => FrontUserResource::getUrl('edit', ['record' => $record->user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab()
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->whereHas('user', fn($q) => $q->where('users.name', 'like', "%{$search}%")->orWhere('users.email', 'like', "%{$search}%"));
                    }),

                Tables\Columns\TextColumn::make('bonus')
                    ->state(fn(UserBonus $record) => $record->bonusCode ? $record->bonusCode->name : ucwords(str_replace("_", " ", $record->bonus_code)))
                    ->label('Bonus'),

                Tables\Columns\TextColumn::make('amount')
                    ->formatStateUsing(fn($state) => formatCurrency($state))
                    ->sortable(),

                Tables\Columns\TextColumn::make('awarded_on')
                    ->label('Awarded On')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('expires_on')
                    ->label('Expires On')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

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
                    ->options(FrontUser::pluck('email', 'id')->toArray())
                    ->searchable()
                    ->columnSpan(2)
                    ->preload(),

                Tables\Filters\SelectFilter::make('status')
                    ->label("Status")
                    ->searchable()
                    ->preload()
                    ->options(TransactionStatus::class),

                Tables\Filters\SelectFilter::make('bonus_code')
                    ->label("Bonus Type")
                    ->options(BonusType::getAll())
                    ->native(false)
                    ->searchable(),                    

                Tables\Filters\Filter::make('awarded_on')
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("Awarded on Date from")->columnSpan(1)->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("Awarded on Date until")->columnSpan(1)->icon('heroicon-s-calendar'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('awarded_on', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('awarded_on', '<=', $data['until']));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                
                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'Awarded on Date from ' . Carbon::parse($data['from'])->toFormattedDateString();
                        }
                
                        if ($data['until'] ?? null) {
                            $indicators['until'] = 'Awarded on Date until ' . Carbon::parse($data['until'])->toFormattedDateString();
                        }
                
                        return $indicators;
                }),

                Tables\Filters\Filter::make('expires_on')
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("Expired on Date from")->columnSpan(1)->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("Expired on Date until")->columnSpan(1)->icon('heroicon-s-calendar'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('expires_on', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('expires_on', '<=', $data['until']));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                
                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'Expired on Date from ' . Carbon::parse($data['from'])->toFormattedDateString();
                        }
                
                        if ($data['until'] ?? null) {
                            $indicators['until'] = 'Expired on Date until ' . Carbon::parse($data['until'])->toFormattedDateString();
                        }
                
                        return $indicators;
                }),

            ])
            ->filtersFormColumns(2)
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
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
            'index' => Pages\ListUserBonuses::route('/'),
            'create' => Pages\CreateUserBonus::route('/create'),
            'edit' => Pages\EditUserBonus::route('/{record}/edit'),
        ];
    }
}
