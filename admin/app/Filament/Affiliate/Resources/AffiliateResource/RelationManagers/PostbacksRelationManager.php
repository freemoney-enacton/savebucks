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

               Tables\Columns\TextColumn::make('affiliate.name')
                    ->label('Affiliate')
                    ->searchable(),           

                Tables\Columns\TextColumn::make('campaign.name')
                    ->label('Campaign')
                    ->searchable()
                    ->numeric(),

                Tables\Columns\TextColumn::make('campaignGoal.name')
                    ->label('Campaign Goal')
                    ->numeric()
                    ->searchable(),

                 Tables\Columns\IconColumn::make('postback_url')
                    ->label('Destination Url')
                    ->url(fn($record): string => $record->postback_url)
                    ->icon('heroicon-o-link')
                    ->tooltip(fn($record): string => $record->postback_url)
                    ->searchable(),

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

                Tables\Filters\SelectFilter::make('affiliate_id')
                    ->relationship('affiliate', 'name')
                    ->preload()
                    ->searchable()
                    ->label('Affiliate'),

                Tables\Filters\SelectFilter::make('campaign_id')
                    ->relationship('campaign', 'name')                 
                    ->preload()
                    ->searchable()
                    ->label('Campaign'),

                Tables\Filters\SelectFilter::make('campaign_goal_id')
                    ->relationship('campaignGoal', 'name')                 
                    ->preload()
                    ->searchable()
                    ->label('Campaign Goal'),
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
                    // Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
