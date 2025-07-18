<?php

namespace App\Filament\Resources\UserEarningResource\Pages;

use App\Filament\Resources\UserEarningResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Actions\ExportAction;
use App\Filament\Exports\UserEarningExporter;
use Filament\Actions\Exports\Enums\ExportFormat;

class ListUserEarnings extends ListRecords
{
    protected static string $resource   = UserEarningResource::class;
    protected ?string $subheading       = 'Cashback Users Earning Report to manage here,';


    protected function getHeaderActions(): array
    {
        return [
            ExportAction::make()
            ->exporter(UserEarningExporter::class)
            ->label("Export CSV")
            ->color('warning')
            ->formats([
                ExportFormat::Csv,
                // ExportFormat::Xlsx,
            ])
        ];
    }
}
