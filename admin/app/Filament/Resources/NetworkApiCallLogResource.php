<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NetworkApiCallLogResource\Pages;
use App\Filament\Resources\NetworkApiCallLogResource\RelationManagers;
use App\Models\NetworkApiCallLog;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use ValentinMorice\FilamentJsonColumn\JsonColumn;

class NetworkApiCallLogResource extends Resource
{
    protected static ?string $model = NetworkApiCallLog::class;
    protected static ?string $modelLabel = "Network Api Log";
    protected static ?int $navigationSort = 6;
    protected static ?string $navigationGroup = "Affiliate Networks";
    protected static ?string $navigationIcon = 'heroicon-o-document-chart-bar';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Network Api Log Information')
                    ->description('Details of network api logs')
                    ->schema([

                        Forms\Components\TextInput::make('network')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('endpoint')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('request_method')
                            ->label("Request Method")
                            ->required()
                            ->maxLength(50),

                        Forms\Components\TextInput::make('url')
                            ->required()
                            ->url()
                            ->maxLength(1500),

                        Forms\Components\TextInput::make('headers')
                            ->required()
                            ->maxLength(2000),

                        Forms\Components\TextInput::make('response_status')
                            ->label("Response Status")
                            ->numeric(),

                        JsonColumn::make('params')
                            ->label('Params')
                            ->required()
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->editorHeight(300)
                            ->editorOnly(),

                    ])->columns(2)

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('network')
                    ->label('Network')
                    ->searchable(),

                Tables\Columns\TextColumn::make('endpoint')
                    ->searchable(),

                Tables\Columns\TextColumn::make('request_method')
                    ->label('Request Method')
                    ->searchable(),

                Tables\Columns\TextColumn::make('url')
                    ->limit(40)
                    ->tooltip(fn($state) => $state)
                    ->searchable(),

                Tables\Columns\TextColumn::make('response_status')
                    ->label('Response Status')
                    ->searchable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created Date')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Updated At')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: false),
            ])
            ->filters([
                //
            ])
            ->actions([
                // Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),
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
            'index' => Pages\ListNetworkApiCallLogs::route('/'),
            'create' => Pages\CreateNetworkApiCallLog::route('/create'),
            'edit' => Pages\EditNetworkApiCallLog::route('/{record}/edit'),
        ];
    }
}
