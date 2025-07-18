<?php

namespace App\Filament\Affiliate\Widgets;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use App\Models\Affiliate\Affiliate;
use App\Filament\Affiliate\Resources\AffiliateResource;

// Alternative Option 2: Direct query approach (if you don't want to add relationship)
class TopAffiliates extends BaseWidget
{   
    protected static ?string $heading = 'Top Affiliates';
    protected static ?int $sort = 4;

    public function table(Table $table): Table
    {
        return $table
            ->query($this->getTopAffiliatesQuery())
            ->columns([
                Tables\Columns\TextColumn::make('affiliate_name')
                    ->label('Affiliate')
                    // ->url(fn (Affiliate $record): string => AffiliateResource::getUrl('view', ['record' => $record]))
                    ->description(fn ($record): string => $record->affiliate_email)
                    ->url(fn ($record): string => AffiliateResource::getUrl('view', ['record' => $record->affiliate_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->openUrlInNewTab()               
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('conversion_count')
                    ->label('Conversions')
                    ->numeric()
                    ->sortable()
                    ->alignCenter()
                    ->badge()
                    ->color('info'),

                Tables\Columns\TextColumn::make('total_commission')
                    ->label('Total Commission')
                    // ->money(config('freemoney.currencies.default'))
                    ->money(config('freemoney.default.default_currency'))
                    ->sortable()
                    ->weight('bold')
                    ->color('success')
                    ->alignEnd(),
            ])
            ->defaultSort('total_commission', 'desc')
            ->paginated(false);
    }

    private function getTopAffiliatesQuery()
    {
        return \App\Models\Affiliate\ViewConversion::whereIn('conversion_status', ['approved', 'paid'])
            ->select([
                'affiliate_id',
                'affiliate_name',
                'affiliate_email',
                \DB::raw('COUNT(*) as conversion_count'),
                \DB::raw('SUM(commission) as total_commission'),
            ])
            ->groupBy(['affiliate_id', 'affiliate_name', 'affiliate_email'])
            ->orderBy('total_commission', 'desc')
            ->limit(10);
    }

    public function getTableRecordKey($record): string
    {
        return (string) ($record->affiliate_id ?? uniqid());
    }
}