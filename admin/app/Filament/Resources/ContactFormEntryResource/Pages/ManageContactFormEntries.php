<?php

namespace App\Filament\Resources\ContactFormEntryResource\Pages;

use App\Filament\Resources\ContactFormEntryResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageContactFormEntries extends ManageRecords
{
    protected static string $resource = ContactFormEntryResource::class;
}
