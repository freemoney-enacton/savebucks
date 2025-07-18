<?php

namespace App\Filament\Widgets;

use Filament\Tables;
use Filament\Tables\Table;
use App\Models\Store;
use Filament\Widgets\TableWidget as BaseWidget;

class TopMerchants extends BaseWidget
{
    public function table(Table $table): Table
    {
        return $table
            ->heading('Top Cashback Stores')
            ->paginated(false)
            ->query(
                Store::orderby('clicks', 'desc')->orderBy('visits', 'desc')->limit(10)
            )
            ->columns([
                Tables\Columns\TextColumn::make('name'),
                Tables\Columns\TextColumn::make('clicks')->label('Views'),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl")
            ]);
    }
}
