<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserChatMessagesResource\Pages;
use App\Filament\Resources\UserChatMessagesResource\RelationManagers;
use App\Models\FrontUser;
use App\Models\Message;
use App\Models\Room;
use App\Models\Country;
use App\Models\UserChatMessages;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\IconPosition;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserChatMessagesResource extends Resource
{
    protected static ?string $model = Message::class;

    protected static ?int $navigationSort = 4;
    protected static ?string $navigationGroup = "Manage Users";
    protected static ?string $navigationLabel = 'User Chat Messages';
    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    protected static ?string $modelLabel = 'User Chat Message';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->label('User')
                    ->relationship('user', 'name')
                    ->required()
                    ->disabledOn('edit'),
                Forms\Components\Select::make('room_code')
                    ->label('Room')
                    ->relationship('room', 'name')
                    ->required()
                    ->disabledOn('edit'),
                Forms\Components\Textarea::make('content')
                    ->label("Message")
                    ->required()
                    ->disabledOn('edit'),
                Forms\Components\DateTimePicker::make('sent_at')
                    ->label('Sent At')
                    ->required()
                    ->disabledOn('edit'),

                Forms\Components\TextInput::make('country')
                    ->label('Country'),

                Forms\Components\Toggle::make('is_hidden')
                    ->label('Hidden'),

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn($query) => $query->has('user'))
            ->columns([

                Tables\Columns\TextColumn::make('user.name')
                    ->description(fn(Message $record) => $record->user->email)
                    ->limit(15)
                    ->tooltip(fn (Message $record) => $record->user->name . '('.$record->user->email.')')
                    ->url(fn($record): string => FrontUserResource::getUrl('edit', ['record' => $record->user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab()
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->whereHas('user', fn($q) => $q->where('users.name', 'like', "%{$search}%")->orWhere('users.email', 'like', "%{$search}%"));
                    }),

                Tables\Columns\TextColumn::make('room.name')
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->where('room_code','like',"%{$search}%")
                            ->orWhereHas('room', fn($q) => $q->where('rooms.name', 'like', "%{$search}%"));
                    }),

                Tables\Columns\TextColumn::make('content')
                    ->label("Message")
                    ->searchable()
                    ->limit(15)
                    ->tooltip(fn (Message $record) => $record->content),

                Tables\Columns\ToggleColumn::make('is_hidden')
                    ->label("Hidden"),

                Tables\Columns\TextColumn::make('country')
                    ->label("Country")
                    ->searchable(),               

                Tables\Columns\TextColumn::make('sent_at')
                    ->label("Message Time"),

            ])
            ->filters([

                Tables\Filters\SelectFilter::make('user_id')
                    ->label("Users")
                    ->options(FrontUser::pluck("email","id"))
                    ->searchable()
                    ->preload(),

                Tables\Filters\SelectFilter::make('room_code')
                    ->label("Room")
                    ->options(Room::pluck('name','code'))
                    ->searchable()
                    ->preload(),

                Tables\Filters\TernaryFilter::make('is_hidden')
                    ->label("Hidden"),

                Tables\Filters\SelectFilter::make('country')
                    ->options(Country::pluck('code','code'))
                    ->preload()
                    ->label("Filter by Country")
                    ->searchable()
                    ->query(function (Builder $query, array $data): Builder {

                        if (isset($data['value']) && !empty($data['value'])) {                          
                            return $query->where('country', $data['value']);
                        }
                        return $query;
                    }),

                
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUserChatMessages::route('/'),
            // 'create' => Pages\CreateUserChatMessages::route('/create'),
            // 'edit' => Pages\EditUserChatMessages::route('/{record}/edit'),
        ];
    }
}
