<?php

namespace App\Filament\Imports;

use App\Models\Sale;
use Filament\Actions\Imports\ImportColumn;
use Filament\Actions\Imports\Importer;
use Filament\Actions\Imports\Models\Import;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Log;

class SaleImporter extends Importer
{
    protected static ?string $model = Sale::class;

    public function getJobRetryUntil(): ?CarbonInterface
    {
        return now()->addHour();
    }


    public static function getColumns(): array
    {
        return [

            ImportColumn::make('network_id')
            ->requiredMapping()
            ->rules([
                'required', 'integer'
            ])
            ->example(2),
            
            ImportColumn::make('network_campaign_id')
                ->requiredMapping()
                ->rules(['required'])
                ->example(1),
    
            ImportColumn::make('transaction_id')
                ->requiredMapping()
                ->rules([
                    'required', 
                    'max:50',                   
                ])
                ->example('448480'),           
           
            ImportColumn::make('commission_id')
                ->rules(['max:50'])
                ->example(0),
    
            ImportColumn::make('order_id')
                ->rules(['max:50'])
                ->example(96),
    
            ImportColumn::make('click_date')
                ->castStateUsing(function ($state) {
                    return empty($state) ? null : $state;
                }),
            
            ImportColumn::make('sale_date')
                ->castStateUsing(function ($state) {
                    return empty($state) ? null : $state;
                }),          
        
            ImportColumn::make('sale_amount')
                ->numeric()
                ->example(1000),
    
            ImportColumn::make('base_commission')
                ->numeric()
                ->example(1000),
    
            ImportColumn::make('commission_amount')
                ->requiredMapping()
                ->numeric()
                ->rules(['required'])
                ->example(1000),
    
            ImportColumn::make('currency')
                ->requiredMapping()
                ->rules(['required', 'max:3'])
                ->example('USD'),
    
            ImportColumn::make('sale_status')
                ->requiredMapping()
                ->rules(['required', 'max:50'])
                ->example('pending'),
    
            ImportColumn::make('status')
                ->requiredMapping()
                ->rules(['required', 'in:pending,confirmed,delayed,declined'])
                ->example('pending'),
    
            ImportColumn::make('sale_updated_time')
                ->castStateUsing(function ($state) {
                    return empty($state) ? null : $state;
                }), 
    
            ImportColumn::make('aff_sub1')
                ->rules(['max:50'])
                ->example('q1nyQYohIA'),
    
            ImportColumn::make('aff_sub2')
                ->rules(['max:50'])
                ->example('example_sub2'),
    
            ImportColumn::make('aff_sub3')
                ->rules(['max:50'])
                ->example('example_sub3'),
    
            ImportColumn::make('aff_sub4')
                ->rules(['max:50'])
                ->example('example_sub4'),
    
            ImportColumn::make('aff_sub5')
                ->rules(['max:50'])
                ->example('example_sub5'),
    
            ImportColumn::make('extra_information')
                ->example('[]'),
    
            ImportColumn::make('found_batch_id')
                ->numeric()
                ->rules(['integer'])
                ->example(22),
        ];
    }
    

    public function resolveRecord(): ?Sale
    {
        $existingSale = Sale::where('network_id', $this->data['network_id'])
        ->where('transaction_id', $this->data['transaction_id'])
        ->first();

        if ($existingSale) {
           
            // Option 2: Update the existing record
            $existingSale->fill($this->data);
            logger('Duplicate sale updated =================>', $this->data);
            return $existingSale;

        }
    
        $sale = new Sale();

        // Properly handle empty date fields
        foreach (['click_date', 'sale_date', 'sale_updated_time'] as $dateField) {
            if (empty($this->data[$dateField])) {
                $this->data[$dateField] = null;
            }
        }
        
        // Handle empty extra_information
        if (isset($this->data['extra_information']) && $this->data['extra_information'] === '[]') {
            $this->data['extra_information'] = json_encode([]);
        }
        
        // Fill the model with the data
        $sale->fill($this->data);
        
        return $sale;
        
        // return new Sale();   <---og
    }

    protected function beforeSave(): void
    {
        // Optional: Log data before saving to help debug
        \Log::info('Saving sale record', [
            'data' => $this->data,
            'model' => get_class($this->record)
        ]);
    }
    
    // Handle validation errors
    protected function beforeValidate(): void
    {
        // Ensure date fields are properly formatted or null
        foreach (['click_date', 'sale_date', 'sale_updated_time'] as $dateField) {
            if (empty($this->data[$dateField])) {
                $this->data[$dateField] = null;
            }
        }
    }

    public static function getCompletedNotificationBody(Import $import): string
    {
        $body = 'Your sale import has completed and ' . number_format($import->successful_rows) . ' ' . str('row')->plural($import->successful_rows) . ' imported.';

        if ($failedRowsCount = $import->getFailedRowsCount()) {
            $body .= ' ' . number_format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to import.';
        }

        return $body;
    }
}
