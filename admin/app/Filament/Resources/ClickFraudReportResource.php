<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ClickFraudReportResource\Pages;
use App\Filament\Resources\ClickFraudReportResource\RelationManagers;
use App\Models\ClickFraudReport;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\IconPosition;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ClickFraudReportResource extends Resource
{
    protected static ?string $model = ClickFraudReport::class;

    protected static ?int $navigationSort = 5;
    protected static ?string $navigationGroup = "Reports & Logs";
    protected static ?string $navigationLabel = 'Click Fraud Report';
    protected static ?string $navigationIcon = 'heroicon-o-cursor-arrow-rays';
    protected static ?string $modelLabel = 'Click Fraud Report';

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user_id')
                    ->numeric()
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('name')
                    ->description(fn($record) => $record->email)
                    ->searchable(['name','email'])
                    ->url(fn($record): string => FrontUserResource::getUrl('edit', ['record' => $record->user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab(),
                Tables\Columns\TextColumn::make('total_clicks_count')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('distinct_clicks_count')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('distinct_ip_count')
                    ->numeric()
                    ->sortable(),
            ])
            ->defaultSort('user_id','desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListClickFraudReports::route('/'),
        ];
    }
}
