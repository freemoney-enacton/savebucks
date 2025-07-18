<?php

namespace App\Filament\Widgets;

use App\Models\Offer;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class TopOffers extends BaseWidget
{
    public function table(Table $table): Table
    {
        return $table
            ->paginated(false)
            ->heading('Top Offers')
            ->defaultSort('clicks', 'desc')
            ->defaultSort('redemptions', 'desc')
            ->query(Offer::where('status', 'publish')->limit(10))
            ->columns([
                // Tables\Columns\ImageColumn::make('image'),
                Tables\Columns\TextColumn::make('name'),
                Tables\Columns\TextColumn::make('clicks'),
                Tables\Columns\TextColumn::make('redemptions'),
            ])->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl")
                    ->url(fn(Offer $record) => route('filament.admin.resources.offers.edit', $record)),
            ]);
    }
}
