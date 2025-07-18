<?php

namespace App\Filament\Affiliate\Resources;

use App\Filament\Affiliate\Resources\PostbackLogResource\Pages;
use App\Filament\Affiliate\Resources\PostbackLogResource\RelationManagers;
use App\Models\Affiliate\PostbackLog;
use App\Models\Affiliate\AffPostBack;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use ValentinMorice\FilamentJsonColumn\JsonColumn;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PostbackLogResource extends Resource
{
    protected static ?string $model             = AffPostBack::class;
    protected static ?string $modelLabel        = 'Postbacks';
    protected static ?string $navigationGroup   = "Logs & Reports";
    protected static ?int $navigationSort       = 1;
    protected static ?string $navigationIcon    = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Basic Postback Information')                
                    ->columns(2)
                    ->schema([

                    Forms\Components\TextInput::make('transaction_id')
                        ->label('Transaction ID')
                        ->required()
                        ->maxLength(255),

                    Forms\Components\Radio::make('status')
                        ->label('Status')   
                        ->inline()
                        ->inlineLabel(false)
                        ->options([
                            'success' => 'Success',
                            'failure' => 'Failure',
                        ])
                        ->required(),

                    JsonColumn::make('raw_postback_data')
                        ->label('Raw Postback Data')
                        ->hintIcon('heroicon-o-question-mark-circle')
                        ->hintIconTooltip('Raw Postback Data received from the postback.')
                        ->extraFieldWrapperAttributes([
                            'class' => 'category-block',
                        ])
                        ->editorOnly(),

                    JsonColumn::make('status_messages')
                        ->label('Status Messages')
                        ->hintIcon('heroicon-o-question-mark-circle')
                        ->hintIconTooltip('Status messages received from the postback.')
                        ->extraFieldWrapperAttributes([
                            'class' => 'category-block',
                        ])
                        ->editorOnly(),

                    // Forms\Components\TextInput::make('status_messages'),

                    Forms\Components\DateTimePicker::make('received_at')
                        ->label('Received At')
                        ->native(false)
                        ->prefixicon('heroicon-o-calendar')
                        ->required(),

                    Forms\Components\DateTimePicker::make('processed_at')
                        ->label('Processed At')
                        ->native(false)
                        ->prefixicon('heroicon-o-calendar'),

                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('transaction_id')
                    ->label('Transaction ID')
                    ->searchable(),
              
                Tables\Columns\TextColumn::make('received_at')
                    ->label('Received At')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('processed_at')
                    ->label('Processed At')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => ucfirst($state))
                    ->color(fn (string $state): string => match ($state) {
                        'success' => 'success',
                        'failure' => 'danger',
                         default => 'gray',
                    })
                    ->searchable(),

            ])
            ->filters([
                
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'success' => 'Success',
                        'failure' => 'Failure',
                    ]),
                
            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip("View")->size("lg"),
                // Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("lg"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Tables\Actions\DeleteBulkAction::make(),
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
            'index' => Pages\ListPostbackLogs::route('/'),
            'create' => Pages\CreatePostbackLog::route('/create'),
            'view' => Pages\ViewPostbackLog::route('/{record}'),
            'edit' => Pages\EditPostbackLog::route('/{record}/edit'),
        ];
    }
}
