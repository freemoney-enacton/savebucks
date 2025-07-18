<?php

namespace App\Filament\Resources\FrontUserResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OfferSalesRelationManager extends RelationManager
{
    protected static string $relationship = 'OfferSales';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                // 
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('task_name')
            ->columns([
                Tables\Columns\TextColumn::make('transaction_id')
                    ->label('Transaction ID'),

                Tables\Columns\TextColumn::make('offer.name')
                    ->label('Offer name')
                    ->placeholder('N/A'),

                Tables\Columns\TextColumn::make('network_code.name')
                    ->label('Network')
                    ->placeholder('N/A'),

            ])
            ->filters([
                //
            ])
            ->headerActions([
                // Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                // Tables\Actions\EditAction::make(),
                // Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                // Tables\Actions\BulkActionGroup::make([
                //     Tables\Actions\DeleteBulkAction::make(),
                // ]),
            ]);
    }
}
