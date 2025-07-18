<?php

namespace App\Filament\Resources\EarningByStoreResource\Pages;

use App\Filament\Resources\EarningByStoreResource;
use App\Filament\Exports\EarningByStoreExporter;
use Filament\Actions\Exports\Enums\ExportFormat;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListEarningByStores extends ListRecords
{
    protected static string $resource = EarningByStoreResource::class;
    use ListRecords\Concerns\Translatable;

    protected function getHeaderActions(): array
    {
        return [
            // Actions\CreateAction::make(),
            Actions\LocaleSwitcher::make(),
            Actions\ExportAction::make()
                ->exporter(EarningByStoreExporter::class)
                ->button()
                ->color('warning')
                ->label("Export CSV")
                ->formats([
                    ExportFormat::Csv,
                ])

        ];
    }
}
