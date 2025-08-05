<?php

namespace App\Filament\Affiliate\Resources;

use App\Filament\Affiliate\Resources\AffiliateReportResource\Pages;
use App\Filament\Affiliate\Resources\AffiliateReportResource\RelationManagers;
use App\Models\Affiliate\AffiliateReport;
use App\Models\Affiliate\AffiliateDailyEarnings;
use App\Models\Affiliate;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\DateFilter;
use Illuminate\Support\Carbon;

class AffiliateReportResource extends Resource
{
    protected static ?string $model = AffiliateDailyEarnings::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar';
    protected static ?string $navigationGroup = 'Logs & Reports';
    protected static ?int $navigationSort = 2;
    protected static ?string $modelLabel = 'Affiliate Daily Report';

    // public static function form(Form $form): Form
    // {
    //     return $form
    //         ->schema([
    //             //
    //         ]);
    // }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table
            // ->defaultSort('conversion_date', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('affiliate.name')
                    ->description(fn($record) => $record->affiliate->email )
                    ->label('Affiliate')
                    ->searchable(['name', 'email'])
                    ->sortable(),

                Tables\Columns\TextColumn::make('day')
                    ->date()
                    ->label("Date"),

                Tables\Columns\TextColumn::make('transaction_count')
                    ->label('Transacations Count')
                    ->numeric()
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('total_earning')
                    ->label('Reward')
                    ->money(config('freemoney.default.default_currency'))
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->label('Conversion Status')
                    ->badge()
                    ->formatStateUsing(fn($state) => ucfirst($state))
                    ->color(fn($state) => match ($state) {
                        'pending'   => 'warning',
                        'approved'  => 'success',
                        'declined'  => 'danger',
                        'paid'      => 'success',
                        'untracked' => 'gray',
                    })
                    ->searchable(),

            ])
            ->filters([


                Tables\Filters\SelectFilter::make('affiliate_id')
                    ->relationship('affiliate', 'email')
                    ->preload()
                    ->searchable()
                    ->label('Filter By Affiliate'),

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending'   => 'Pending',
                        'approved'  => 'Approved',
                        'declined'  => 'Declined',
                        'paid'      => 'Paid',
                        'untracked' => 'Untracked',
                    ])
                    ->default('approved')
                    ->preload()
                    ->searchable()
                    ->label('Status'),

                Tables\Filters\Filter::make('day')
                    ->label('Filter By Conversion Date')
                    ->form([
                        Forms\Components\DatePicker::make('day_from')
                            ->label('Converted Date From')
                            ->default(now()->startOfMonth())
                            ->native(false),
                        Forms\Components\DatePicker::make('day_to')
                            ->label('Converted Date To')
                            ->default(now()->endOfMonth())
                            ->native(false),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                !empty($data['day_from']),
                                fn (Builder $q) => $q->where('day', '>=',
                                    Carbon::parse($data['day_from'])->startOfDay()
                                )
                            )
                            ->when(
                                !empty($data['day_to']),
                                fn (Builder $q) => $q->where('day', '<=',
                                    Carbon::parse($data['day_to'])->endOfDay()
                                )
                            );
                    }),

            ])
            ->defaultPaginationPageOption(25);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageAffiliateReports::route('/'),
        ];
    }
}
