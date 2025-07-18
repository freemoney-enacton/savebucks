<?php

namespace App\Filament\Resources\UserOfferClickResource\Pages;

use App\Filament\Resources\UserOfferClickResource;
use Filament\Actions;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Database\Eloquent\Model;

class ViewUserOfferClick extends ViewRecord
{
    protected static string $resource = UserOfferClickResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Actions\DeleteAction::make(),
        ];
    }

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->columns()
            ->schema([
                Infolists\Components\Section::make('User click information')
                    ->columns(4)
                    ->schema([
                        Infolists\Components\TextEntry::make('user.name')
                            ->size(Infolists\Components\TextEntry\TextEntrySize::Large)
                            ->label('User ID'),

                        Infolists\Components\TextEntry::make('clicked_on')
                            ->size(Infolists\Components\TextEntry\TextEntrySize::Large)
                            ->label('Clicked on'),

                        Infolists\Components\TextEntry::make('referer')
                            ->size(Infolists\Components\TextEntry\TextEntrySize::Large)
                            ->placeholder('N/A'),

                        Infolists\Components\TextEntry::make('user_agent')
                            ->size(Infolists\Components\TextEntry\TextEntrySize::Large)
                            ->label('User Agent'),
                    ]),

                Infolists\Components\Section::make('Offer information')
                    ->columns(4)
                    ->columnSpan(2)
                    ->schema([
                        Infolists\Components\TextEntry::make('task_offer_id')
                            ->size(Infolists\Components\TextEntry\TextEntrySize::Large)
                            ->label('Task offer ID'),

                        Infolists\Components\TextEntry::make('platform')
                            ->size(Infolists\Components\TextEntry\TextEntrySize::Large),

                        Infolists\Components\TextEntry::make('task_type')
                            ->size(Infolists\Components\TextEntry\TextEntrySize::Large),

                        Infolists\Components\TextEntry::make('network')
                            ->formatStateUsing(fn(string $state): string => ucwords($state))
                            ->size(Infolists\Components\TextEntry\TextEntrySize::Large),

                        Infolists\Components\TextEntry::make('campaign_id')
                            ->size(Infolists\Components\TextEntry\TextEntrySize::Large)
                            ->label('Campaign ID'),

                        Infolists\Components\TextEntry::make('countries')
                            ->size(Infolists\Components\TextEntry\TextEntrySize::Large),

                        Infolists\Components\TextEntry::make('locale')
                            ->size(Infolists\Components\TextEntry\TextEntrySize::Large),
                    ]),
            ]);
    }
}
