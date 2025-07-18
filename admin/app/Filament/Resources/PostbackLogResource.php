<?php

namespace App\Filament\Resources;

use App\Enums\PostbackLogStatus;
use App\Filament\Resources\PostbackLogResource\Pages;
use App\Filament\Resources\PostbackLogResource\RelationManagers;
use App\Models\Network;
use App\Models\PostbackLog;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\QueryBuilder;
use Filament\Tables\Filters\QueryBuilder\Constraints\SelectConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use ValentinMorice\FilamentJsonColumn\JsonColumn;

class PostbackLogResource extends Resource
{
    protected static ?string $model = PostbackLog::class;

    protected static ?int $navigationSort = 9;
    protected static ?string $navigationGroup = "Affiliate Networks";
    protected static ?string $navigationLabel = 'Postback Logs';
    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $modelLabel = 'Postback Log';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('network')
                    ->required()
                    ->maxLength(50),
                Forms\Components\TextInput::make('transaction_id')
                    ->label('Transaction ID')
                    ->maxLength(50)
                    ->default(null),
                JsonColumn::make('payload')
                    ->viewerOnly()
                    ->required()
                    ->columnSpanFull(),
                JsonColumn::make('data')
                    ->viewerOnly()
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('status')
                    ->required(),
                Forms\Components\TextInput::make('message')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('networkModel.name')
                    ->description(fn($record) => $record->network)
                    ->label("Network")
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->where('network', 'like', "%{$search}%")
                            ->orWhereHas('networkModel', fn($q) => $q->where('name', 'like', "%{$search}%"));
                    }),            
           
                Tables\Columns\TextColumn::make('transaction_id')
                    ->label('Transaction ID')
                    ->searchable(),

                Tables\Columns\TextColumn::make('status')
                    ->badge(),
                    
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(PostbackLogStatus::class)
            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPostbackLogs::route('/'),
            'view' => Pages\ViewPostbackLog::route('/{record}'),
        ];
    }
}
