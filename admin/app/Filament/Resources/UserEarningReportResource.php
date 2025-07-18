<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserEarningReportResource\Pages;
use App\Filament\Resources\UserEarningReportResource\RelationManagers;
use App\Models\FrontUser;
use App\Models\UserBonus;
use App\Models\UserEarningReport;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\IconPosition;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserEarningReportResource extends Resource
{
    protected static ?string $model = UserEarningReport::class;

    protected static ?int $navigationSort       = 5;
    protected static ?string $navigationGroup   = "Reports & Logs";
    protected static ?string $navigationLabel   = 'User Earning Report';
    protected static ?string $navigationIcon    = 'heroicon-o-user';
    protected static ?string $modelLabel        = 'User Earning Report';

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn($query) => $query->whereNull('deleted_at'))
            ->columns([
                Tables\Columns\TextColumn::make('user_info')
                    ->label('User Information')
                    ->state(function ($record) {
                        return "
                            <strong>" . __('ID') . ":</strong> {$record->user_id}<br>
                            <strong>" . __('Name') . ":</strong> {$record->name}<br>
                            <strong>" . __('Email') . ":</strong> {$record->email}<br>
                            <strong>" . __('Phone') . ":</strong> {$record->phone_no}<br>
                            <strong>" . __('Current Tier') . ":</strong> {$record->current_tier}<br>
                            <strong>" . __('Current Level') . ":</strong> {$record->current_level}
                        ";
                    })
                    ->html()
                    ->searchable(['user_id','name', 'email', 'phone_no'])
                    ->url(fn($record): string => FrontUserResource::getUrl('edit', ['record' => $record->user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab(),

                Tables\Columns\TextColumn::make('task_earnings')
                    ->label('Task Earnings')
                    ->state(function ($record) {
                        return "
                            <strong>" . __('Total Tasks') . ":</strong> " . formatNumber($record->total_tasks) . "<br>
                            <strong>" . __('Surveys Completed') . ":</strong> " . formatNumber($record->surveys_completed) . "<br>
                            <strong>" . __('Total Earnings') . ":</strong> " . formatCurrency($record->total_task_earnings) . "<br>
                            <strong>" . __('Pending') . ":</strong> " . formatCurrency($record->pending_task_earnings) . "<br>
                            <strong>" . __('Confirmed') . ":</strong> " . formatCurrency($record->confirmed_task_earnings) . "<br>
                            <strong>" . __('Declined') . ":</strong> " . formatCurrency($record->declined_task_earnings) . "
                        ";
                    })
                    ->html()
                    ->url(fn($record): string => UserOfferSaleResource::getUrl('index', ['tableFilters[user_id][value]' => $record->user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab(),

                Tables\Columns\TextColumn::make('bonus_earnings')
                    ->label('Bonus Earnings')
                    ->state(function ($record) {
                        return "
                            <strong>" . __('Total Bonus') . ":</strong> " . formatCurrency($record->total_bonus) . "<br>
                            <strong>" . __('Pending') . ":</strong> " . formatCurrency($record->pending_bonus) . "<br>
                            <strong>" . __('Confirmed') . ":</strong> " . formatCurrency($record->confirmed_bonus) . "<br>
                            <strong>" . __('Declined') . ":</strong> " . formatCurrency($record->declined_bonus) . "<br>
                            <strong>" . __('Expired') . ":</strong> " . formatCurrency($record->expired_bonus) . "
                        ";
                    })
                    ->html()
                    ->url(fn($record): string => UserBonusResource::getUrl('index', ['tableFilters[user_id][value]' => $record->user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab(),

                Tables\Columns\TextColumn::make('referral_earnings')
                    ->label('Referral Earnings')
                    ->state(function ($record) {
                        return "
                            <strong>" . __('Total') . ":</strong> " . formatCurrency($record->total_referral_earnings) . "<br>
                            <strong>" . __('Pending') . ":</strong> " . formatCurrency($record->pending_referral_earnings) . "<br>
                            <strong>" . __('Confirmed') . ":</strong> " . formatCurrency($record->confirmed_referral_earnings) . "<br>
                            <strong>" . __('Declined') . ":</strong> " . formatCurrency($record->declined_referral_earnings) . "
                        ";
                    })
                    ->html()
                    ->url(fn($record): string => UserRefferralEarningResource::getUrl('index', ['tableFilters[user_id][value]' => $record->user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab(),

                Tables\Columns\TextColumn::make('withdrawal_info')
                    ->label('Withdrawal Information')
                    ->state(function ($record) {
                        return "
                            <strong>" . __('Pending Withdrawals') . ":</strong> " . formatNumber($record->pending_withdrawals_count) . " (" . formatCurrency($record->pending_withdrawals_amount) . ")<br>
                            <strong>" . __('Withdrawn') . ":</strong> " . formatNumber($record->withdrawn_count) . " (" . formatCurrency($record->withdrawn_amount) . ")<br>
                            <strong>" . __('Declined') . ":</strong> " . formatNumber($record->declined_withdrawals_count) . " (" . formatCurrency($record->declined_withdrawals_amount) . ")<br>
                            <strong>" . __('Total Withdrawals') . ":</strong> " . formatCurrency($record->total_withdrawals_amount) . "
                        ";
                    })
                    ->html()
                    ->url(fn($record): string => UserPaymentResource::getUrl('index', ['tableFilters[user_id][value]' => $record->user_id]))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab(),

                Tables\Columns\TextColumn::make('summary')
                    ->label('Summary')
                    ->state(function ($record) {
                        return "
                            <strong>" . __('Total Earnings') . ":</strong> " . formatCurrency($record->total_earnings) . "<br>
                            <strong>" . __('Total Withdrawals') . ":</strong> " . formatCurrency($record->total_withdrawals_amount) . "<br>
                            <strong>" . __('Current Balance') . ":</strong> " . formatCurrency($record->current_balance) . "
                        ";
                    })
                    ->html(),
            ])
            ->defaultSort('user_id','desc')
            ->filters([])
            ->actions([])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUserEarningReports::route('/'),
        ];
    }
}
