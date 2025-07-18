<?php

namespace App\Filament\Imports;

use App\Models\UserSale;
use Filament\Actions\Imports\ImportColumn;
use Filament\Actions\Imports\Importer;
use Filament\Actions\Imports\Models\Import;

class UserSaleImporter extends Importer
{
    protected static ?string $model = UserSale::class;

    public static function getColumns(): array
    {
        return [
            ImportColumn::make('user_id')
                ->requiredMapping()
                ->numeric()
                ->example(5)
                ->rules(['integer']),

            ImportColumn::make('sales_id')
                ->requiredMapping()
                ->example(2)
                ->numeric()
                ->rules(['required', 'integer', 'exists:sales,id']),

            ImportColumn::make('network_id')
                ->requiredMapping()
                ->example(2)
                ->numeric()
                ->rules(['required', 'integer']),

            ImportColumn::make('order_id')
                ->rules(['max:255']),

            ImportColumn::make('store_id')
                ->requiredMapping()
                ->example(1)
                ->numeric()
                ->rules(['required', 'integer']),

            ImportColumn::make('click_id')
                ->requiredMapping()
                ->example(80)
                ->numeric()
                ->rules(['required']),

            ImportColumn::make('click_code')
                ->example('he416NvwuY')
                ->rules(["max:10"]),

            ImportColumn::make('order_amount')
                ->requiredMapping()
                ->example(34.50)
                ->numeric()
                ->rules(['required', 'numeric']),

            ImportColumn::make('cashback')
                ->requiredMapping()
                ->numeric()
                ->example(1.50)
                ->rules(['required', 'numeric']),

            ImportColumn::make('cashback_type')
                ->requiredMapping()
                ->example('cashback')
                ->rules(['required', 'in:cashback,reward']),

            ImportColumn::make('currency')
                ->requiredMapping()
                ->example('USD')
                ->rules(['required', 'max:3']),

            ImportColumn::make('status')
                ->requiredMapping()
                ->example('confirmed')
                ->rules(['required','in:pending,confirmed,declined']),

            ImportColumn::make('transaction_time')
                ->requiredMapping()
                ->example('2021-12-01 00:00:00')
                ->rules(['required']),

            ImportColumn::make('expected_date')
                ->example('2021-12-01 00:00:00')
                ->rules([]),

            ImportColumn::make('mail_sent')
                ->requiredMapping()
                ->example(1)
                ->rules(["in:0,1"])
                ->boolean(),

            ImportColumn::make('lock_status')
                ->requiredMapping()
                ->example(0)
                ->boolean(),

            ImportColumn::make('lock_amount')
                ->requiredMapping()
                ->example(0)
                ->boolean(),

            ImportColumn::make('note'),

            ImportColumn::make('admin_note')
                ->example("tested note")
                ->rules(['max:500']),
        ];
    }


    public function resolveRecord(): ?UserSale
    {
        return UserSale::firstOrNew([
            // Update existing records, matching them by `$this->data['column_name']`
            'sales_id' => $this->data['sales_id'],
        ]);

        return new UserSale();
    }

    public static function getCompletedNotificationBody(Import $import): string
    {
        $body = 'Your user sale import has completed and ' . number_format($import->successful_rows) . ' ' . str('row')->plural($import->successful_rows) . ' imported.';

        if ($failedRowsCount = $import->getFailedRowsCount()) {
            $body .= ' ' . number_format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to import.';
        }

        return $body;
    }
}
