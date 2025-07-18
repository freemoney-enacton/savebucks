<?php

namespace App\Filament\Resources\UserOfferSaleResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\ImageEntry;

class UserTaskUploadsRelationManager extends RelationManager
{
    protected static string $relationship = 'userTaskUploads';
    protected static bool $isLazy = false;

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('task_offer_id')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([

                Infolists\Components\Section::make('Details')
                    ->description('User task upload details')
                    ->schema([

                        TextEntry::make('network')
                            ->label('Network'),

                        TextEntry::make('platform')
                            ->label('Platform'),

                        TextEntry::make('offer_id')
                            ->label('Offer Id'),

                        TextEntry::make('task_offer_id')
                            ->label('Task Offer ID'),

                        TextEntry::make('created_at')
                            ->label('Created At')
                            ->dateTime(),

                        ImageEntry::make('upload_path')
                            ->label('Uploaded File')
                            ->columnSpanFull(),

                    ])->columns(2)

            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('task_offer_id')
            ->columns([

                Tables\Columns\TextColumn::make('network')
                    ->label('Network'),

                Tables\Columns\TextColumn::make('platform')
                    ->searchable(),

                Tables\Columns\TextColumn::make('task_offer_id')
                    ->label('Task Offer Id'),

                Tables\Columns\ImageColumn::make('upload_path')
                    ->label("Upload Image")
                    ->url(function ($record) {
                        return $record->upload_path;
                    })
                    ->openUrlInNewTab()
                    ->size(30),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created At'),

            ])
            ->filters([
                //
            ])
            ->headerActions([
                // Tables\Actions\CreateAction::make(),
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
}
