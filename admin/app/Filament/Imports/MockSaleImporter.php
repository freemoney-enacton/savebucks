<?php

namespace App\Filament\Imports;

use App\Models\MockSale;
use Filament\Actions\Imports\ImportColumn;
use Filament\Actions\Imports\Importer;
use Filament\Actions\Imports\Models\Import;
use Illuminate\Support\Facades\Log;
use Filament\Notifications\Notification;
use Filament\Actions\Imports\Exceptions;

class MockSaleImporter extends Importer
{
    protected static ?string $model = MockSale::class;

    public static function getColumns(): array
    {
        return [

            ImportColumn::make('network_id')
                ->requiredMapping()
                ->numeric()
                ->example('3')
                ->rules(['required', 'integer']),

            ImportColumn::make('network_campaign_id')
                ->requiredMapping()
                ->numeric()
                ->example('112')
                ->rules(['required', 'integer']),

            ImportColumn::make('transaction_id')
                ->requiredMapping()
                ->example('541')
                ->rules(['required', 'max:50']),

            ImportColumn::make('commission_id')
                ->example('54')
                ->rules(['max:50']),

            ImportColumn::make('order_id')
                ->example('5')
                ->rules(['max:50']),

            ImportColumn::make('sale_date')
                ->example('2022-01-01')
                ->rules(['max:50', 'date_format:Y-m-d']),

            ImportColumn::make('sale_amount')
                ->numeric()
                ->example('55')
                ->rules(['numeric']),

            ImportColumn::make('base_commission')
                ->numeric()
                ->example('5')
                ->rules(['numeric']),

            ImportColumn::make('currency')
                ->requiredMapping()
                ->example("USD")
                ->rules(['required', 'max:3']),

            ImportColumn::make('status')
                ->requiredMapping()
                ->example("confirmed")
                ->rules(['required', 'in:pending,confirmed,declined']),

            ImportColumn::make('aff_sub1')
                ->example("Aff_example")
                ->rules(['max:50']),

            ImportColumn::make('aff_sub2')
                ->example("Aff_example")
                ->rules(['max:50']),

            ImportColumn::make('aff_sub3')
                ->example("Aff_example")
                ->rules(['max:50']),

            ImportColumn::make('aff_sub4')
                ->example("Aff_example")
                ->rules(['max:50']),

            ImportColumn::make('aff_sub5')
                ->example("Aff_example")
                ->rules(['max:50']),

            ImportColumn::make('extra_information')
                ->example("extra info"),
        ];
    }

    public function resolveRecord(): ?MockSale
    {
        Log::info('Enter in resolverrrrrrr: =====>');
        $existingRecord = MockSale::where('network_id', $this->data['network_id'])
                                ->where('transaction_id', $this->data['transaction_id'])
                                ->first();

        

        if ($existingRecord) {
            // If exact match on both values exists, return the existing record
            return $existingRecord;
            Log::info('Existing record: =====>' . $existingRecord);
        }

        // If no matching record with BOTH values exists, create a new record
        return new MockSale();
    }
    

    public static function getCompletedNotificationBody(Import $import): string
    {
        $body = 'Your mock sale import has completed and ' . number_format($import->successful_rows) . ' ' . str('row')->plural($import->successful_rows) . ' imported.';

        if ($failedRowsCount = $import->getFailedRowsCount()) {
            $body .= ' ' . number_format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to import.';
        }

        return $body;
    }

    public function import(Import $import): void
    {

        try {

            log::info('Starting of try');
            parent::import($import);

        } catch (\Exception $e) {

            log::info('Starting of catch');

            Log::error('Manual Sales Import failed: ' . $e->getMessage(), [
                'import_id' => $import->id,
                'file' => $import->file_path,
                'trace' => $e->getTraceAsString()
            ]);

            Notification::make()
                ->icon('heroicon-o-exclamation-triangle')
                ->title('Row Import Error')
                ->body($e->getMessage())
                ->send();

            throw $e;
        }
    }

    protected function beforeImport(): void
    {
        Log::info('Starting Manual Sales Import', [
            'total_rows' => $this->import->total_rows
        ]);
    }


    protected function afterImport(): void
    {
        Log::info('Completed Manual Sales Import', [
            'successful_rows' => $this->import->successful_rows,
            'failed_rows' => $this->import->getFailedRowsCount()
        ]);
    }
}
