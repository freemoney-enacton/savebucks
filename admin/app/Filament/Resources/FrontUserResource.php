<?php

namespace App\Filament\Resources;

use Filament\Forms;
use Filament\Tables;
use Filament\Forms\Form;
use App\Models\FrontUser;
use Filament\Tables\Table;
use App\Enums\FrontUserStatus;
use Filament\Resources\Resource;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Section;
use Filament\Tables\Enums\FiltersLayout;
use Illuminate\Database\Eloquent\Builder;
use App\Filament\Resources\FrontUserResource\Pages;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Filament\Resources\FrontUserResource\RelationManagers;
use App\Models\Country;
use App\Models\Tier;
use App\Models\Language;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\BooleanConstraint;

class FrontUserResource extends Resource
{
    protected static ?string $model = FrontUser::class;

    protected static ?int $navigationSort = 1;
    protected static ?string $navigationGroup = "Manage Users";
    protected static ?string $navigationLabel = 'Users';
    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $modelLabel = 'Users';

    public static function form(Form $form): Form
    {
        return $form
            ->columns(2)
            ->schema([
                Forms\Components\Group::make()->schema([
                    Forms\Components\Section::make('User Information')
                        ->columns(2)
                        ->schema([

                            Forms\Components\TextInput::make('name')
                                ->required()
                                ->maxLength(255),

                            Forms\Components\TextInput::make('email')
                                ->email()
                                ->required()
                                ->maxLength(255),

                            Forms\Components\TextInput::make('phone_no')
                                ->tel(),

                            Forms\Components\Toggle::make('is_private')
                                ->label('Is private?')
                                ->inline(false)
                                ->inlineLabel(false),

                            Forms\Components\TextInput::make('password')
                                ->visibleOn('create')
                                ->password()
                                ->revealable()
                                ->maxLength(255)
                                ->default(null),

                            Forms\Components\Select::make('lang')
                                // ->disabledOn('edit')
                                ->visibleOn("edit")
                                ->placeholder("select language")
                                ->searchable()
                                ->preload()
                                ->options(Language::where('is_enabled', 1)->pluck('code', 'code')->toArray())
                                ->default(null),

                            Forms\Components\Select::make('country_code')
                                ->options(Country::getAll())
                                ->preload()
                                ->searchable()
                                ->default(null),

                            Forms\Components\TextInput::make('referral_code')
                                ->maxLength(255)
                                ->disabled(true)
                                ->default(null),

                            Forms\Components\TextInput::make('referrer_code')
                                ->disabled(true)
                                ->maxLength(255)
                                ->default(null),
                        ]),
                    Forms\Components\Section::make('User Kyc Information')
                        ->columns(2)
                        ->columnSpanFull()
                        ->schema([
                            Forms\Components\Toggle::make('kyc_verified'),
                            Forms\Components\Select::make('kyc_verification_status')
                                ->options([
                                    "In Progress" => "In Progress",
                                    "Not Started" => "Not Started",
                                    "Approved" => "Approved",
                                    "Declined" => "Declined",
                                    "In Review" => "In Review",
                                    "Expired" => "Expired",
                                    "Abandoned" => "Abandoned",
                                    "Kyc Expired" => "Kyc Expired"
                                ]),

                            Forms\Components\DateTimePicker::make('kyc_verified_at')
                                ->disabledOn('edit'),

                            Forms\Components\TextInput::make('kyc_session_id')
                                ->disabledOn('edit'),

                            Forms\Components\Textarea::make('kyc_verification_payload')
                                ->columnSpanFull()
                                ->rows(10)
                                ->disabledOn('edit'),
                        ])
                ]),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Manage User')
                            ->columns(2)
                            ->schema([
                                Forms\Components\Radio::make('status')
                                    ->inline()
                                    ->columnSpanFull()
                                    ->inlineLabel(false)
                                    ->options(FrontUserStatus::class),

                                Forms\Components\Toggle::make('is_email_verified')
                                    ->label('Is email verified?')
                                    ->inline(false)
                                    ->inlineLabel(false),

                                Forms\Components\Toggle::make('is_phone_no_verified')
                                    ->label('Is phone number verified?')
                                    ->inline(false)
                                    ->inlineLabel(false),

                                Forms\Components\Select::make('current_tier')
                                    ->label('Tier')
                                    ->options(function () {
                                        return Tier::where('enabled', 1)->pluck('label', 'id')->toArray();
                                    })
                                    ->getOptionLabelFromRecordUsing(fn(Tier $tier) => $tier->label)
                                    ->hintIcon('heroicon-o-question-mark-circle')
                                    ->hintIconTooltip('This will determine the current tier required by the user for accessing the task.')
                                    ->required()
                                    ->columnSpanFull(),

                            ]),
                    ]),
            ]);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label("User Id")
                    ->limit(20)
                    ->searchable(),

                Tables\Columns\TextColumn::make('name')
                    ->limit(20)
                    ->searchable(),

                Tables\Columns\TextColumn::make('email')
                    ->tooltip(fn($state) => $state)
                    ->limit(20)
                    ->searchable(),

                Tables\Columns\TextColumn::make('phone_no')
                    ->placeholder('N/A')
                    ->searchable(),

                Tables\Columns\TextColumn::make('country_code'),

                Tables\Columns\TextColumn::make('referral_code')
                    ->limit(20)
                    ->label('Referral Code')
                    ->toggleable()
                    ->searchable(),

                Tables\Columns\ToggleColumn::make('is_email_verified')
                    ->label('Is Verified'),

                Tables\Columns\ToggleColumn::make('is_email_verified')
                    ->label('Is Verified'),

                Tables\Columns\TextColumn::make('status')
                    ->badge(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('dS F, Y h:i A')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime('dS F, Y h:i A')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make()
                    ->label("Delete Records"),

                Tables\Filters\TernaryFilter::make('is_email_verified')
                    ->label("Is Email Verified")
                    ->placeholder('All users')
                    ->trueLabel('Verified users')
                    ->falseLabel('Not verified users'),

                Tables\Filters\TernaryFilter::make('is_private')
                    ->label("Is Private")
                    ->placeholder("All"),

                Tables\Filters\TernaryFilter::make('is_phone_no_verified')
                    ->label("Is Phone Verified")
                    ->placeholder("All"),

                Tables\Filters\TernaryFilter::make('kyc_verified')
                    ->label("Kyc Verified")
                    ->placeholder("All"),

                Tables\Filters\SelectFilter::make('kyc_verification_status')
                    ->label("Kyc Verification Status")
                    ->options([
                        "In Progress" => "In Progress",
                        "Not Started" => "Not Started",
                        "Approved" => "Approved",
                        "Declined" => "Declined",
                        "In Review" => "In Review",
                        "Expired" => "Expired",
                        "Abandoned" => "Abandoned",
                        "Kyc Expired" => "Kyc Expired"
                    ])
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('current_tier')
                    ->options(Tier::pluck('label', 'id'))
                    ->preload()
                    ->label("Tier")
                    ->searchable(),

                Tables\Filters\SelectFilter::make('country_code')
                    ->options(Country::getAll())
                    ->preload()
                    ->label("Country Code")
                    ->searchable(),

                Tables\Filters\SelectFilter::make('status')
                    ->options(FrontUserStatus::class)
                    ->preload()
                    ->label("Status")
                    ->searchable(),

                Tables\Filters\SelectFilter::make('referral_code_filter')
                    ->label('Filter By User Referrers')
                    ->searchable()
                    ->preload()
                    ->placeholder('Select Referral Code')
                    ->options(function () {
                        return FrontUser::query()
                            ->whereNotNull('referral_code')
                            ->distinct('referral_code')
                            ->pluck('email', 'referral_code');
                    })
                    ->query(function (Builder $query, array $data): Builder {
                        if (isset($data['value']) && !empty($data['value'])) {
                            return $query->where(function ($subQuery) use ($data) {
                                $subQuery
                                    ->where('referrer_code', $data['value']);
                            });
                        }
                        return $query;
                    }),

            ])->filtersFormColumns(3)
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
            ]);
            
    }

    // public static function getRelations(): array
    // {
    //     return [
    //         RelationManagers\OfferSalesRelationManager::class,
    //         RelationManagers\BonusesRelationManager::class,
    //         RelationManagers\OfferClicksRelationManager::class,
    //     ];
    // }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFrontUsers::route('/'),
            'create' => Pages\CreateFrontUser::route('/create'),
            'edit' => Pages\EditFrontUser::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
