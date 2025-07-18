<?php

namespace App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ConversionsRelationManager extends RelationManager
{
    protected static string $relationship = 'conversions';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('campaign_id')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('campaign_id')
            ->columns([

                Tables\Columns\TextColumn::make('campaign.id')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('click_code')
                    ->label('Click Code')
                    ->searchable(),

                Tables\Columns\TextColumn::make('affiliate.name')
                    ->label('Affiliate')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('transaction_id')
                    ->searchable(),

                Tables\Columns\TextColumn::make('commission')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->formatStateUsing(fn($state) => Str::ucfirst($state))
                    ->badge()
                    ->color(fn ($state): string => match ($state) {
                        'pending'   => 'warning',
                        'approved'  => 'info',
                        'declined'  => 'danger',
                        'paid'      => 'success',
                        default     => 'gray',
                    })
                    ->searchable(),

                Tables\Columns\TextColumn::make('payout_id')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('converted_at')
                    ->label("Converted At")
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending'   => 'Pending',
                        'approved'  => 'Approved',
                        'declined'  => 'Declined',
                        'paid'      => 'Paid',           
                    ])  
                    ->preload()
                    ->searchable()
                    ->label('Status'),

                Tables\Filters\SelectFilter::make('campaign_id')
                    ->relationship('campaign', 'name')
                    ->preload()
                    ->searchable()
                    ->label('Filter By Campaign'),

                Tables\Filters\SelectFilter::make('affiliate_id')
                    ->relationship('affiliate', 'name')
                    ->preload()
                    ->searchable()
                    ->label('Filter by Affiliate'),

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
