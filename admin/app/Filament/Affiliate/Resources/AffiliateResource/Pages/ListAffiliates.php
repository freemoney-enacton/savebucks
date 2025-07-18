<?php

namespace App\Filament\Affiliate\Resources\AffiliateResource\Pages;

use App\Filament\Affiliate\Resources\AffiliateResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;

class ListAffiliates extends ListRecords
{
    protected static string $resource = AffiliateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            null => Tab::make('All'),
            'pending' => Tab::make()->query(fn ($query) => $query->where('approval_status', 'pending')),
            'approved' => Tab::make()->query(fn ($query) => $query->where('approval_status', 'approved')),
            'rejected' => Tab::make()->query(fn ($query) => $query->where('approval_status', 'rejected')),
            'suspended' => Tab::make()->query(fn ($query) => $query->where('approval_status', 'suspended')),
        ];
    }
}
