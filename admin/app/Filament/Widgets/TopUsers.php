<?php

namespace App\Filament\Widgets;

use App\Models\FrontUser;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class TopUsers extends BaseWidget
{
    public function table(Table $table): Table
    {
        return $table
            ->paginated(false)
            ->heading('Top Users')
            ->defaultSort('created_at', 'desc')
            ->query(FrontUser::withSum('bonuses', 'amount')
                ->orderByDesc('bonuses_sum_amount')
                ->limit(10))
            ->columns([
                Tables\Columns\TextColumn::make('name'),
                Tables\Columns\TextColumn::make('bonuses_sum_amount')->label('Bonus'),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl")
                    ->url(fn(FrontUser $record): string => route('filament.admin.resources.front-users.edit', $record)),
            ]);
    }
}
