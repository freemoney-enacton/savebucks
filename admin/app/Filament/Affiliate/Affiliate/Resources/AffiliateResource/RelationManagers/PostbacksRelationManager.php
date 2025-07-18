<?php

namespace App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PostbacksRelationManager extends RelationManager
{
    protected static string $relationship = 'postbacks';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('transaction_id')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('transaction_id')
            ->columns([

                Tables\Columns\TextColumn::make('campaign.name')
                    ->label('Campaign')
                    ->searchable(),

                Tables\Columns\TextColumn::make('campaignGoal.name')
                    ->label('Campaign Goal')
                    ->searchable(),

                Tables\Columns\TextColumn::make('postback_url')
                    ->label('Postback URL')
                    ->limit(25)
                    ->copyable()
                     ->copyMessage('Postback URL copied')
                    ->tooltip(fn($state)=> $state)
                    ->searchable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Received At')
                    ->dateTime()
                    ->sortable(),

                // Tables\Columns\TextColumn::make('processed_at')
                //     ->label('Processed At')
                //     ->dateTime()
                //     ->sortable(),
            ])
            ->filters([

                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'success' => 'Success',
                        'failure' => 'Failure',
                    ]),
            ])
            ->headerActions([
                // Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                // Tables\Actions\EditAction::make(),
                // Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
