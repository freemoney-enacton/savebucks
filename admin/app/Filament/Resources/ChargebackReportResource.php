<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ChargebackReportResource\Pages;
use App\Filament\Resources\ChargebackReportResource\RelationManagers;
use App\Models\ChargebackReport;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\IconPosition;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ChargebackReportResource extends Resource
{
    protected static ?string $model             = ChargebackReport::class;

    protected static ?int $navigationSort       = 4;
    protected static ?string $navigationGroup   = "Reports & Logs";
    protected static ?string $navigationLabel   = 'Chargeback Report';
    protected static ?string $navigationIcon    = 'heroicon-o-banknotes';
    protected static ?string $modelLabel        = 'Chargeback Report';

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user_id')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('name')
                    ->description(fn($record) => $record->email)
                    ->searchable(['name','email'])
                    ->url(fn($record): string => FrontUserResource::getUrl('edit', ['record' => $record->user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab(),

                Tables\Columns\TextColumn::make('sales_count_breakdown')
                    ->label('Task Earnings')
                    ->state(function ($record) {
                        return "
                            <strong>" . __('Total Sales Count') . ":</strong> " . formatNumber($record->total_sales_count) . "<br>
                            <strong>" . __('Confirmed Sales Count') . ":</strong> " . formatNumber($record->confirmed_sales_count) . "<br>
                            <strong>" . __('Pending Sales Count') . ":</strong> " . formatNumber($record->pending_sales_count) . "<br>
                            <strong>" . __('Chargeback Count') . ":</strong> " . formatNumber($record->chargeback_count) . "<br>
                        ";
                    })
                    ->html(),
                Tables\Columns\TextColumn::make('total_amount')
                    ->formatStateUsing(fn($state) => formatCurrency($state)),
                Tables\Columns\TextColumn::make('chargeback_amount')
                    ->formatStateUsing(fn($state) => formatCurrency($state)),
                Tables\Columns\TextColumn::make('chargeback_ratio')
                    ->formatStateUsing(fn($state) => formatPercent($state)),
            ])
            ->defaultSort('chargeback_ratio','desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListChargebackReports::route('/'),
        ];
    }
}
