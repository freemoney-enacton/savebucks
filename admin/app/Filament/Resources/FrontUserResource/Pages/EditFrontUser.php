<?php

namespace App\Filament\Resources\FrontUserResource\Pages;

use App\Filament\Resources\FrontUserResource;
use App\Filament\Resources\UserBonusResource;
use App\Filament\Resources\UserEarningReportResource;
use App\Filament\Resources\UserOfferSaleResource;
use App\Filament\Resources\UserPaymentResource;
use App\Filament\Resources\UserRefferralEarningResource;
use App\Filament\Resources\UserSaleResource;
use App\Filament\Resources\UserClaimResource;
use Filament\Actions;
use Filament\Tables\Actions\ActionGroup;
use Filament\Actions\Action;
use Filament\Resources\Pages\EditRecord;

class EditFrontUser extends EditRecord
{
    protected static string $resource = FrontUserResource::class;

    protected function getHeaderActions(): array
    {
        return [

            ActionGroup::make([

                Action::make('user-stats')
                ->label('Earnings Report')
                ->url(UserEarningReportResource::getUrl('index', ['tableSearch' => $this->getRecord()->id]))
                ->color('success')
                ->openUrlInNewTab(),

                Action::make('user-task-earnings')
                    ->label('Task Earnings')
                    ->url(fn($record): string => UserOfferSaleResource::getUrl('index', ['tableFilters[user_id][value]' => $this->getRecord()->id]))
                    ->color('info')
                    ->openUrlInNewTab(),

                Action::make('user-bonus-earnings')
                    ->label('Bonus Earnings')
                    ->url(fn($record): string => UserBonusResource::getUrl('index', ['tableFilters[user_id][value]' => $this->getRecord()->id]))
                    ->color('warning')
                    ->openUrlInNewTab(),

                Action::make('user-referral-earnings')
                    ->label('Referral Earnings')
                    ->url(fn($record): string => UserRefferralEarningResource::getUrl('index', ['tableFilters[user_id][value]' => $this->getRecord()->id]))
                    ->color('gray')
                    ->openUrlInNewTab(),              

            ])->label('Earnings')
            ->icon('heroicon-o-currency-dollar')
            ->button(),
            
            Action::make('user-withdrawals')
            ->label('Withdrawals')
            ->url(fn($record): string => UserPaymentResource::getUrl('index', ['tableFilters[user_id][value]' => $this->getRecord()->id]))
            ->color('info')
            ->openUrlInNewTab(),  
        
            Action::make('user-referrals')
                ->label('User Referrals')
                ->url(
                    fn($record): string =>
                    FrontUserResource::getUrl('index') .
                        '?tableFilters[referral_code_filter][value]=' .
                        urlencode($record->referral_code)
                )
                ->color('success')
                ->openUrlInNewTab(),

            Action::make('missing_claims')
                ->label('Missing Claims')
                ->url(
                    fn($record): string =>
                    UserClaimResource::getUrl('index') .
                        '?tableFilters[user_id][value]=' .
                        urlencode($record->id)
                )
                ->color('info')
                ->openUrlInNewTab(),

            Action::make('cashback_transactions')  
                ->label('CB Transactions')
                ->url(
                    fn($record): string =>
                    UserSaleResource::getUrl('index') .
                        '?tableFilters[user_id][value]=' .
                        urlencode($record->id)
                )
                ->color('gray')
                ->openUrlInNewTab(),

            // Actions\DeleteAction::make(),
            // Actions\ForceDeleteAction::make(),
            // Actions\RestoreAction::make(),
        ];
    }
}
