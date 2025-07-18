<?php

namespace App\Filament\Affiliate\Widgets;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms;
use Filament\Widgets\TableWidget as BaseWidget;
use App\Models\Affiliate\Conversion;
use Illuminate\Support\Facades\DB;
use App\Models\Affiliate\ViewConversion;

class TopGoals extends BaseWidget
{
    protected static ?string $heading = 'Top Goals by Conversions';
    protected static ?int $sort = 4;

    public function table(Table $table): Table
    {
        return $table
            ->query($this->getTopGoalsQuery())
            ->defaultSort('conversion_count', 'desc')  // Sort by count, highest first
            ->columns([

                Tables\Columns\TextColumn::make('goal_name')
                    ->label('Goal'),

                Tables\Columns\TextColumn::make('conversion_count')
                    ->label('Count')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('conversion_amount')
                    ->label('Amount')
                    ->money(config('freemoney.default.default_currency'))
                    ->weight('bold')
                    ->color('success')
                    ->sortable()
                    ->alignEnd(),

                // Tables\Columns\TextColumn::make('goal_name')
                //     ->label('Description')
                //     ->tooltip(fn($state) => $state)
                //     ->limit(15)                 
                //     ->sortable(),
            ])
            ->actions([
                // Tables\Actions\ViewAction::make(),
            ])
            ->paginated(false);
    }

    public function getTableRecordKey($record): string
    {
        return (string) ($record->campaign_goal_id ?? uniqid());
    }

    private function getTopGoalsQuery()
    {
        return ViewConversion::whereIn('conversion_status', ['approved', 'paid'])
            ->whereNotNull('campaign_goal_id')
            ->select([
                'campaign_goal_id',
                'goal_name',
                DB::raw('COUNT(*) as conversion_count'),
                DB::raw('SUM(commission) as conversion_amount'),
            ])
            ->groupBy([
                'campaign_goal_id',
                'goal_name'
            ])
            ->orderBy('conversion_count', 'desc')   // Primary sort: most conversions first
            ->orderBy('conversion_amount', 'desc')  // Secondary sort: highest amount if counts are equal
            ->limit(10);
    }
}