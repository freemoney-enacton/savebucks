<?php

namespace App\Filament\Resources;

use App\Enums\NetworkType;
use App\Enums\PlatformTypes;
use App\Filament\Resources\UserOfferClickResource\Pages;
use App\Models\FrontUser;
use App\Models\Network;
use App\Models\Offer;
use App\Models\UserOfferClick;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\IconPosition;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class UserOfferClickResource extends Resource
{
    protected static ?string $model = UserOfferClick::class;

    protected static ?int $navigationSort = 2;
    protected static ?string $navigationGroup = "Manage Users";
    protected static ?string $navigationLabel = 'Users Clicks';
    protected static ?string $navigationIcon = 'heroicon-o-cursor-arrow-rays';
    protected static ?string $modelLabel = 'Users Clicks';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('User click information')
                    ->columns(2)
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->relationship('user', 'name')
                            ->label('User ID')
                            ->disabled('onEdit')
                            ->required(),

                        Forms\Components\DateTimePicker::make('clicked_on')
                            ->label('Clicked on')
                            ->disabled('onEdit')
                            ->required(),

                        Forms\Components\TextInput::make('Referer')
                            ->required()
                            ->disabled('onEdit')
                            ->maxLength(255),

                        Forms\Components\TextInput::make('user_agent')
                            ->required()
                            ->label('User Agent')
                            ->disabled('onEdit')
                            ->maxLength(255),
                    ]),

                Forms\Components\Section::make('Offer information')
                    ->columns(3)
                    ->schema([
                        Forms\Components\TextInput::make('task_offer_id')
                            ->maxLength(50)
                            ->disabled('onEdit')
                            ->label('Task offer ID')
                            ->default(null),

                        Forms\Components\TextInput::make('platform')
                            ->required()
                            ->disabled('onEdit')
                            ->maxLength(50),

                        Forms\Components\TextInput::make('task_type')
                            ->required()
                            ->disabled('onEdit')
                            ->maxLength(25),

                        Forms\Components\TextInput::make('network')
                            ->required()
                            ->disabled('onEdit')
                            ->maxLength(25),

                        Forms\Components\TextInput::make('campaign_id')
                            ->required()
                            ->label('Campaign ID')
                            ->disabled('onEdit')
                            ->maxLength(50),

                        Forms\Components\TextInput::make('countries')
                            ->required()
                            ->disabled('onEdit')
                            ->maxLength(255),

                        Forms\Components\TextInput::make('locale')
                            ->required()
                            ->disabled('onEdit')
                            ->maxLength(255),
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
            ->modifyQueryUsing(fn($query) => $query->has('user'))
            ->columns([
                
                Tables\Columns\TextColumn::make('user.name')
                    ->description(fn(UserOfferClick $record) => $record->user?->email)
                    ->sortable()
                    ->limit(15)
                    ->tooltip(fn (UserOfferClick $record) => $record->user?->name . '('.$record->user?->email.')')
                    ->url(fn($record): string => FrontUserResource::getUrl('edit', ['record' => $record->user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab()
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->whereHas('user', fn($q) => $q->where('users.name', 'like', "%{$search}%")->orWhere('users.email', 'like', "%{$search}%"));
                    }),

                Tables\Columns\TextColumn::make('platform')
                    ->searchable()
                    ->badge(),

                Tables\Columns\TextColumn::make('networkModel.name')
                    ->description(fn($record) => $record->network)
                    ->label("Network")
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->where('network','like',"%{$search}%")
                            ->orWhereHas('networkModel', fn($q) => $q->where('name', 'like', "%{$search}%"));
                    }),

                Tables\Columns\TextColumn::make('offer.name')
                    ->label('Offer')
                    ->description('task_offer_id')
                    ->searchable()
                    ->limit(15)
                    ->tooltip(fn (UserOfferClick $record) => $record->offer->name ?? null),

                Tables\Columns\TextColumn::make('clicked_on')
                    ->label('Clicked On')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('ip')
                    ->placeholder('N/A')
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->label('IP'),

                Tables\Columns\TextColumn::make('countries')
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->searchable(),

                Tables\Columns\TextColumn::make('locale')
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('Referer')
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('user_agent')
                    ->label('User Agent')
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('campaign_id')
                    ->label('Campaign ID')
                    ->searchable()
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
                Tables\Filters\SelectFilter::make('platform')
                    ->label("Platform")
                    ->options(PlatformTypes::class),
            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip("View")->size("xl"),
            ])
            ->bulkActions([]);
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
            'index' => Pages\ListUserOfferClicks::route('/'),
            // 'create' => Pages\CreateUserOfferClick::route('/create'),
            // 'view' => Pages\ViewUserOfferClick::route('/{record}'),
            // 'edit' => Pages\EditUserOfferClick::route('/{record}/edit'),
        ];
    }
}
