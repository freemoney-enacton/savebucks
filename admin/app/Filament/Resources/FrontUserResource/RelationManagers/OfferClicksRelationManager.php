<?php

namespace App\Filament\Resources\FrontUserResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OfferClicksRelationManager extends RelationManager
{
    protected static string $relationship = 'offerClicks';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('task_type')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('platform'),
                Forms\Components\TextInput::make('task_type'),
                Forms\Components\TextInput::make('network'),
                Forms\Components\TextInput::make('task_offer_id'),
                Forms\Components\TextInput::make('campaign_id'),
                Forms\Components\TextInput::make('clicked_on'),
                Forms\Components\TextInput::make('Referer'),
                Forms\Components\TextInput::make('locale'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('task_type')
            ->columns([
                Tables\Columns\TextColumn::make('task_type'),
                Tables\Columns\TextColumn::make('platform'),
                Tables\Columns\TextColumn::make('task_type'),
                Tables\Columns\TextColumn::make('network'),
                Tables\Columns\TextColumn::make('clicked_on'),
            ])
            ->filters([
                //
            ])
            ->headerActions([])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([]);
    }
}
