<?php

namespace App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use App\Models\Affiliate\Campaign;

class AffiliateCampaignsRelationManager extends RelationManager
{
    protected static string $relationship = 'affiliateCampaigns';

    public function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('campaign_id')
                ->label('Campaign')
                ->options(fn () => Campaign::where('status', 'active')->pluck('name','id'))
                ->preload()
                ->searchable()
                ->required(),
            Forms\Components\Select::make('status')
                ->options([
                    'pending' => 'Pending',
                    'approved' => 'Approved',
                    'rejected' => 'Rejected',
                ])
                ->required()
                ->default('pending'),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('campaign.name')->label('Campaign'),
                Tables\Columns\BadgeColumn::make('status'),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }
}
