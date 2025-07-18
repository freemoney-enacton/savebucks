<?php

namespace App\Filament\Resources\EarningsByNetworkResource\Pages;

use App\Filament\Resources\EarningsByNetworkResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Actions\ExportAction;
use App\Filament\Exports\EarningsByNetworkExporter;
use Filament\Actions\Exports\Enums\ExportFormat;

class ListEarningsByNetworks extends ListRecords
{
    protected static string $resource = EarningsByNetworkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ExportAction::make()
                    ->exporter(EarningsByNetworkExporter::class)
                    ->label("Export CSV")
                    ->color('warning')
                    ->formats([
                        ExportFormat::Csv,
                        // ExportFormat::Xlsx,
                    ])
        ];
    }
}
