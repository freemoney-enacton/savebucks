<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RoomResource\Pages;
use App\Filament\Resources\RoomResource\RelationManagers;
use App\Models\Room;
use App\Models\Tier;
use App\Models\Country;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class RoomResource extends Resource
{
    protected static ?string $model = Room::class;

    protected static ?int $navigationSort = 2;
    protected static ?string $navigationGroup = "Settings";
    protected static ?string $navigationLabel = 'Chat Rooms';
    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-oval-left';
    protected static ?string $modelLabel = 'Chat Rooms';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(500)
                   ->live(onBlur:true)
                    ->afterStateUpdated(fn (Set $set, ?string $state) => 
                        $set('code', Str::slug($state))
                    ),
                Forms\Components\TextInput::make('code')
                    ->required()
                    ->maxLength(500),

                Forms\Components\Select::make('tier')
                    ->label('Min Tier')
                    ->options(Tier::pluck('label', 'id'))
                    ->searchable()
                    ->preload(),

                Forms\Components\Select::make('countries')
                    ->multiple()
                    ->options(Country::where('is_enabled', '1')->pluck('code', 'code'))
                    ->preload()
                    ->searchable()
                    ->label('Country'),

                Forms\Components\Toggle::make('enabled')
                    ->required(),
                Forms\Components\FileUpload::make('icon')
                    ->maxSize(2500),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('code')
                    ->searchable(),
                Tables\Columns\TextColumn::make('tier')
                    ->label('Min Tier')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\ImageColumn::make('icon')
                    ->searchable(),
                Tables\Columns\IconColumn::make('enabled')
                    ->boolean(),
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
                Tables\Filters\TernaryFilter::make('enabled'),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size('xl'),
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListRooms::route('/'),
            // 'create' => Pages\CreateRoom::route('/create'),
            // 'edit' => Pages\EditRoom::route('/{record}/edit'),
        ];
    }
}
