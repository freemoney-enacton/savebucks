<?php

namespace App\Filament\Widgets;

use App\Models\Sale;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestTransactions extends BaseWidget
{
    public function table(Table $table): Table
    {
        return $table
            ->paginated(false)
            ->heading('Latest Transactions')            
            ->query(
                Sale::orderby('created_at', 'desc')->limit(10)
            )
            ->columns([

                Tables\Columns\TextColumn::make('network.name')
                    ->label("Network & Campaign")  
                    ->formatStateUsing(fn ($state) => "Network: ". $state ?? "")       
                    ->description(fn ($record) => "Campaign: ".     $record->campaign?->name ?? ""),
                   
                Tables\Columns\TextColumn::make('sale_amount')
                    ->label('Transaction Amount')
                    ->formatStateUsing(fn ($state) => "Sale Amount: ". number_format($state,2) ?? "")
                    ->description(fn ($record) => "Commission: ".number_format($record->commission_amount, 2)),                   

                Tables\Columns\TextColumn::make('sale_date')
                    ->label('Sale Date')
                    ->date()
                    ->tooltip(fn($state) => $state)                               

            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl")
                    ->url(fn(Sale $record): string => route('filament.admin.resources.sales.view', $record)),
            ]);
    }
}
