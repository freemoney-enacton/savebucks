<?php

namespace App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Filament\Affiliate\Resources\ClickResource;


class ClicksRelationManager extends RelationManager
{
    protected static string $relationship = 'clicks';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('affiliate_id')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('affiliate_id')
            ->columns([

                Tables\Columns\TextColumn::make('campaign.name')
                    ->label('Campaign')
                    ->searchable()
                    ->numeric()
                    ->sortable(),

                Tables\Columns\IconColumn::make('affiliateLink.destination_url')
                    ->label('Destination Url')
                    ->url(fn($record): string => $record->affiliateLink->destination_url)
                    ->icon('heroicon-o-link')
                    ->tooltip(fn($record): string => $record->affiliateLink->destination_url),
                  
                    
                // Tables\Columns\TextColumn::make('affiliate.name')
                //     ->numeric()
                //     ->sortable(),

                Tables\Columns\TextColumn::make('click_code')
                    ->label('Click Code')
                    ->searchable(),

                Tables\Columns\IconColumn::make('is_converted')
                    ->label('Is Converted')
                    ->boolean(),

                Tables\Columns\TextColumn::make('clicked_at')
                    ->label('Clicked At')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([

                Tables\Filters\SelectFilter::make('campaign_id')
                    ->label("Filter By Campaign")
                    ->relationship('campaign', 'name')
                    ->searchable()
                    ->preload(),

                Tables\Filters\TernaryFilter::make('is_converted')    
                    ->label('Is Converted')
                    ->placeholder('All'),

                //
            ])
            ->headerActions([
                // Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                // Tables\Actions\EditAction::make(),
                // Tables\Actions\DeleteAction::make(),
                 Tables\Actions\Action::make('view_record')
                    ->label('')
                    ->tooltip('View')
                    ->icon('heroicon-o-eye')  // Example: eye icon
                    ->url(fn ($record) => ClickResource::getUrl('view', ['record' => $record->getKey()]))
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
