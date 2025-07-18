<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DailyEarningReportResource\Pages;
use App\Filament\Resources\DailyEarningReportResource\RelationManagers;
use App\Models\DailyEarningReport;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class DailyEarningReportResource extends Resource
{
    protected static ?string $model             = DailyEarningReport::class;
    protected static ?string $navigationIcon    = 'heroicon-o-chart-bar';
    protected static ?string $navigationLabel   = 'Daily Revenue Report';
    protected static ?string $navigationGroup   = 'Reports & Logs';
    protected static ?int $navigationSort       = 4;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\DateTimePicker::make('date'),
                Forms\Components\TextInput::make('sales_revenue')
                    ->numeric(),
                Forms\Components\TextInput::make('task_revenue')
                    ->numeric(),
                Forms\Components\TextInput::make('total_revenue')
                    ->numeric(),
                Forms\Components\TextInput::make('task_cashback')
                    ->numeric(),
                Forms\Components\TextInput::make('store_cashback')
                    ->numeric(),
                Forms\Components\TextInput::make('bonus')
                    ->numeric(),
                Forms\Components\TextInput::make('referral')
                    ->numeric(),
                Forms\Components\TextInput::make('total_cashback')
                    ->numeric(),
                Forms\Components\TextInput::make('total_bonus')
                    ->numeric(),
                Forms\Components\TextInput::make('net_profit')
                    ->numeric(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            // ->defaultSort('date', 'desc')
            ->columns([

                Tables\Columns\TextColumn::make('date')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('sales_revenue')
                    ->label("Sales Revenue")
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('task_revenue')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('total_revenue')
                    ->label("Total Revenue")
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('task_cashback')
                    ->label("Task Cashback")
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('store_cashback')
                    ->label("Store Cashback")
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('bonus')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('referral')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('total_cashback')
                    ->label("Total Cashback")
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('total_bonus')
                    ->label("Total Bonus")
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('net_profit')
                    ->label("Net Profit")
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label('')->size("xl")->tooltip("View"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDailyEarningReports::route('/'),
            'create' => Pages\CreateDailyEarningReport::route('/create'),
            'edit' => Pages\EditDailyEarningReport::route('/{record}/edit'),
        ];
    }
}
