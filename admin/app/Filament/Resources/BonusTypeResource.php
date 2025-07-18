<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BonusTypeResource\Pages;
use App\Filament\Resources\BonusTypeResource\RelationManagers;
use App\Models\BonusType;
use App\Models\Setting;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Closure;
use Filament\Forms\Get;
use Filament\Resources\Concerns\Translatable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

class BonusTypeResource extends Resource
{
    use Translatable;

    protected static ?string $model = BonusType::class;

    protected static ?int $navigationSort = 1;
    protected static ?string $navigationGroup = "Rewards Settings";
    protected static ?string $navigationLabel = 'Bonus Types';
    protected static ?string $navigationIcon = 'heroicon-o-bars-4';
    protected static ?string $modelLabel = 'Bonus Types';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('code')
                    ->hintIcon('heroicon-o-question-mark-circle')
                    ->hintIconTooltip('Used internally to reference bonus in multiple places. Should be unique.')
                    ->extraFieldWrapperAttributes([
                        'class' => 'category-block',
                    ])
                    ->label('Code')
                    ->disabledOn('edit')
                    ->rules([
                        fn (Get $get): Closure => function (string $attribute, $value, Closure $fail) use ($get) {
                            $code = $get('code');
                            $id = $get('id');
                            BonusType::whereRaw("code like '%{$code}%' ")->where('id', '!=', $id)->exists() ? $fail('Code must be unique.') : true;
                        },
                    ])
                    ->required()
                    ->maxLength(25),

                Forms\Components\TextInput::make('name')
                    ->required(),

                Forms\Components\TextInput::make('amount')
                    ->required()
                    ->minValue(0)
                    ->numeric()
                    ->infotip("Amount the user will recieve once this bonus code will be awarded to the user."),

                Forms\Components\TextInput::make('qualifying_amount')
                    ->required()
                    ->label('Qualifying Amount')
                    ->minValue(0)
                    ->infotip("Sales amount required by the user to earn to confirm the bonus.")
                    ->extraFieldWrapperAttributes([
                        'class' => 'category-block',
                    ])
                    ->default(0)
                    ->numeric(),
                Forms\Components\TextInput::make('validity_days')
                    ->required()
                    ->label('Validity Days')
                    ->hintIcon('heroicon-o-question-mark-circle')
                    ->hintIconTooltip('Earn qualifying amount within given days')
                    ->extraFieldWrapperAttributes([
                        'class' => 'category-block',
                    ])
                    ->minValue(0)
                    ->numeric()
                    ->default(90),

                Forms\Components\Toggle::make('enabled')
                    ->default(1)
                    ->inline(false)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),

                Tables\Columns\TextColumn::make('amount')
                    ->numeric()
                    ->money(config('freemoney.currencies.default'))
                    ->sortable(),

                Tables\Columns\TextColumn::make('qualifying_amount')
                    ->label('Qualifying Amount')
                    ->numeric()
                    ->money(config('freemoney.currencies.default'))
                    ->sortable(),

                Tables\Columns\TextColumn::make('validity_days')
                    ->label('Validity Days')
                    ->numeric()
                    ->suffix(' ' . 'Days')
                    ->sortable(),

                Tables\Columns\ToggleColumn::make('enabled'),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('enabled')
                    ->native(false),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl")
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageBonusTypes::route('/'),
        ];
    }

    public static function canDeleteAny(): bool
    {
        return false;
    }
}
