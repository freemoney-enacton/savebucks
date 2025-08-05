<?php

namespace App\Filament\Affiliate\Resources;

use App\Filament\Affiliate\Resources\AffiliateMonthlyEarningResource\Pages;
use App\Filament\Affiliate\Resources\AffiliateMonthlyEarningResource\RelationManagers;
use App\Models\Affiliate\AffiliateMonthlyEarning;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Carbon\Carbon;

class AffiliateMonthlyEarningResource extends Resource
{
    protected static ?string $model = AffiliateMonthlyEarning::class;

    protected static ?string $navigationGroup   = 'Logs & Reports';
    protected static ?int $navigationSort       = 3;
    protected static ?string $modelLabel        = 'Affiliate Monthly Report';
    protected static ?string $navigationIcon    = 'heroicon-o-chart-pie';

    // public static function form(Form $form): Form
    // {
    //     return $form
    //         ->schema([
    //             Forms\Components\Select::make('affiliate_id')
    //                 ->relationship('affiliate', 'name')
    //                 ->required(),
    //             Forms\Components\TextInput::make('month')
    //                 ->maxLength(7),
    //             Forms\Components\TextInput::make('status')
    //                 ->required(),
    //             Forms\Components\TextInput::make('total_earning')
    //                 ->numeric(),
    //             Forms\Components\TextInput::make('transaction_count')
    //                 ->required()
    //                 ->numeric()
    //                 ->default(0),
    //         ]);
    // }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                // Tables\Columns\TextColumn::make('id')
                //     ->label('ID')
                //     ->numeric()
                //     ->sortable(),

                Tables\Columns\TextColumn::make('affiliate.name')
                    ->description(fn($record) => $record->affiliate->email )
                    ->label('Affiliate')
                    ->searchable(['name', 'email'])
                    ->sortable(),


                Tables\Columns\TextColumn::make('month')
                    ->date("M-Y")
                    // ->humanReadable()
                    ->label("Month")
                    ->searchable(),

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

                // Tables\Filters\Filter::make('month')
                //     ->label('Filter By Month')
                //     ->form([
                //         Forms\Components\DatePicker::make('month_from')
                //             ->label('Month From')
                //             ->displayFormat('M-Y')
                //             ->format('Y-m')
                //             ->native(),
                //         Forms\Components\DatePicker::make('month_to')
                //             ->label('Month To')
                //             ->displayFormat('M-Y')
                //             ->format('Y-m')
                //             ->native(),
                //     ])
                //     ->query(function (Builder $query, array $data): Builder {
                //         return $query
                //             ->when(
                //                 !empty($data['month_from']),
                //                 fn (Builder $q) => $q->where('month', '>=', $data['month_from'])
                //             )
                //             ->when(
                //                 !empty($data['month_to']),
                //                 fn (Builder $q) => $q->where('month', '<=', $data['month_to'])
                //             );
                //     }),

                Tables\Filters\SelectFilter::make('month')
                    ->label('Filter By Month')
                    ->placeholder('Select Available Month')
                    ->options(function () {
                        return AffiliateMonthlyEarning::distinct()
                            ->pluck('month', 'month')
                            ->mapWithKeys(function ($month) {
                                return [$month => Carbon::createFromFormat('Y-m', $month)->format('F Y')];
                            })
                            ->sort();
                    })
                    ->default(Carbon::now()->format('Y-m'))
                    ->preload()
                    ->searchable(),

            ])
            ->actions([
                // Tables\Actions\EditAction::make(),
                // Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageAffiliateMonthlyEarnings::route('/'),
        ];
    }
}
