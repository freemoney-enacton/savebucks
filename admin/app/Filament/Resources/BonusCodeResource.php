<?php

namespace App\Filament\Resources;

use App\Enums\RewardType;
use App\Filament\Resources\BonusCodeResource\Pages;
use App\Filament\Resources\BonusCodeResource\RelationManagers;
use App\Models\BonusCode;
use App\Models\Spin;
use App\Models\Tier;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Concerns\Translatable;
use Filament\Resources\Resource;
use Filament\Support\Enums\IconPosition;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class BonusCodeResource extends Resource
{
    use Translatable;

    protected static ?string $model = BonusCode::class;

    protected static ?int $navigationSort = 2;
    protected static ?string $navigationGroup = "Rewards Settings";
    protected static ?string $navigationLabel = 'Bonus Codes';
    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';
    protected static ?string $modelLabel = 'Bonus Codes';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('code')
                    ->required()
                    ->maxLength(255)
                    ->live()
                    ->helperText("Bonus Code should always be in caps so that it will create no confusion for end users to what to enter.")
                    ->afterStateUpdated(fn(Get $get, Set $set) => $set('code', Str::upper($get('code')))),
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),

                Forms\Components\Select::make('tier')
                    ->label('Tier')
                    ->options(function() {
                        return Tier::where('enabled',1)->pluck('label', 'id')->toArray();
                    })
                    ->getOptionLabelFromRecordUsing(fn (Tier $tier) => $tier->label)
                    ->infotip('The user should have this or tier above this.'),

                Forms\Components\TextInput::make('usage_limit')
                    ->numeric(),
                Forms\Components\DatePicker::make('start_date'),
                Forms\Components\DatePicker::make('end_date'),
                Forms\Components\Radio::make('reward_type')
                    ->options(RewardType::class)
                    ->required()
                    ->inline()
                    ->inlineLabel(false)
                    ->live(),
                Forms\Components\Select::make('spin_code')
                    ->options(Spin::get())
                    ->native(false)
                    ->searchable()
                    ->preload()
                    ->visible(fn(Get $get) => $get('reward_type') == RewardType::Spin->value),
                Forms\Components\TextInput::make('amount')
                    ->required()
                    ->numeric()
                    ->infotip("The amount user will recieve as bonus. If spin is selected, enter the upto amount to which user will earn bonus.")
                    ->visible(fn(Get $get) => $get('reward_type') == RewardType::Flat->value),
                Forms\Components\Toggle::make('enabled')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->searchable(),
                Tables\Columns\TextColumn::make('title')
                    ->searchable(),

                Tables\Columns\TextColumn::make('usage_count')
                    ->default(0),

                Tables\Columns\TextColumn::make('max_amount')
                    ->label("Max Amount")
                    ->state(function($record) {
                        if($record->reward_type == RewardType::Flat) return $record->amount;

                        if(!$record->spin) return 'NA';

                        else if($record->spin->variable_rewards) {
                            if(!$record->spinconfigs) return 'NA';
                            if(!$record->spinconfigs->sortByDesc('max_amount')->first()) return 'NA';
                            return $record->spinconfigs->sortByDesc('max_amount')->first()->max_amount;
                        } else {
                            if(!$record->spinconfigs) return 'NA';
                            if(!$record->spinconfigs->sortByDesc('amount')->first()) return 'NA';
                            return $record->spinconfigs->sortByDesc('amount')->first()->amount;
                        }
                    })
                    ->formatStateUsing(fn($state) => formatCurrency($state))
                    ->default(0),

                Tables\Columns\TextColumn::make('reward_type')
                    ->badge(),
                Tables\Columns\TextColumn::make('spin.name')
                    ->url(fn($record): string | null => !$record->spin ? null : SpinResource::getUrl('edit', ['record' => $record->spin->id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab()
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->whereHas('spin', fn($q) => $q->where('spins.name', 'like', "%{$search}%"));
                    }),

                Tables\Columns\ToggleColumn::make('enabled'),

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
                Tables\Filters\SelectFilter::make('reward_type')
                    ->options(RewardType::class),
                Tables\Filters\TernaryFilter::make('enabled')
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("xl"),
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageBonusCodes::route('/'),
        ];
    }


    public static function canDeleteAny(): bool
    {
        return false;
    }
}
