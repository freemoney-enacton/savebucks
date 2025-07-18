<?php

namespace App\Filament\Resources\UserOfferSaleResource\Pages;

use App\Filament\Resources\UserOfferSaleResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use App\Notifications\OfferStatusChangedNotification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;


class EditUserOfferSale extends EditRecord
{   
    // use EditRecord\Concerns\Translatable;
    protected static string $resource = UserOfferSaleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            // Actions\LocaleSwitcher::make(),
        ];
    }

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        // Get the old status before update
        $oldStatus = $record->status?->value ?? $record->status;
        
        // Update the record
        $record->update($data);
        
        // Check if status changed to confirmed or declined
        $newStatus = $data['status'] ?? null;
        if ($newStatus && $newStatus !== $oldStatus && in_array($newStatus, ['confirmed', 'declined'])) {
            // Send notification
            if ($record->user) {
              $record->user->notify(new \App\Notifications\UserOfferwallSaleUpdate($record, $newStatus, $oldStatus));
            }
        }

        Log::info('edit -> User offer sale updated form Edit ======>', [
            'id'     => $record->id,
            'status' => $newStatus
        ]);


        if ($newStatus === 'confirmed') {

            $userOfferSale = $record;

           // Log data before processing
            // Log::info(' edit -> Preparing ticker data...', [
            //     'amount'    => $userOfferSale->amount,
            //     'userName'  => $userOfferSale->user->name ?? 'Unknown',
            //     'offerName' => $userOfferSale->task_name ?? 'Unknown Offer',
            //     'providerName' => $userOfferSale->networkModel->name ?? $userOfferSale->network ?? 'Unknown Provider'
            // ]);

            // Create the JSON data
            $tickerData = [
                'rewards'       => number_format($userOfferSale->amount, 2),
                'userName'      => $userOfferSale->user->name ?? 'Unknown',
                'offerName'     => $userOfferSale->task_name ?? 'Unknown Offer',
                'providerName'  => $userOfferSale->networkModel->name ?? $userOfferSale->network ?? 'Unknown Provider'
            ];

             // Prepare ticker entry data
            $tickerEntry = [
                'user_id'     => $userOfferSale->user_id,
                'ticker_type' => 'Earnings',
                'ticker_data' => json_encode($tickerData),
                'created_at'  => now(),
            ];

            // Log ticker entry data before insertion
            // Log::info('edit -> Ticker entry data prepared:', [
            //     'tickerEntry' => $tickerEntry
            // ]);

            // Insert into tickers table
            try {
                \DB::table('tickers')->insert($tickerEntry);
                Log::info(' edit user offer sale -> Ticker entry inserted into the db for user offer sale ID: ' . $userOfferSale->id);
            } catch (\Exception $e) {
                Log::error(' edit -> Failed to insert ticker entry into the database for user offer sale ID: ' . $userOfferSale->id, [
                    'error' => $e->getMessage()
                ]);
            }

            // Log the ticker entry creation
            // Log::info('Edit -> Ticker entry created for user offer sale ID: ' . $userOfferSale->id, [
            //     'tickerData' => $tickerData,
            // ]);

        }

        return $record;
    }
}
