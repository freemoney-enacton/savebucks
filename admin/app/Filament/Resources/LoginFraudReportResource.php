<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LoginFraudReportResource\Pages;
use App\Filament\Resources\LoginFraudReportResource\RelationManagers;
use App\Models\LoginFraudReport;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\IconPosition;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class LoginFraudReportResource extends Resource
{
    protected static ?string $model = LoginFraudReport::class;

    protected static ?int $navigationSort = 4;
    protected static ?string $navigationGroup = "Reports & Logs";
    protected static ?string $navigationLabel = 'Login Fraud Report';
    protected static ?string $navigationIcon = 'heroicon-o-user';
    protected static ?string $modelLabel = 'Login Fraud Report';

    public function getTableRecordKey(LoginFraudReport $record): string
    {
        return uniqid();
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('joinee_user_id')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('joinee_email')
                    ->searchable()
                    ->url(fn($record): string => FrontUserResource::getUrl('edit', ['record' => $record->joinee_user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab(),
                Tables\Columns\TextColumn::make('referrer_user_id')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('referer_email')
                    ->searchable()
                    ->url(fn($record): string => FrontUserResource::getUrl('edit', ['record' => $record->referrer_user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab(),
                Tables\Columns\TextColumn::make('ip_match')
                    ->numeric()
                    ->sortable(),
            ])
            ->defaultSort('ip_match','desc')
            ->filters([
                //
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLoginFraudReports::route('/'),
        ];
    }
}
