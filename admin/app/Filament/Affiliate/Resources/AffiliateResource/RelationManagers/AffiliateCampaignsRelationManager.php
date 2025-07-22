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
                ->preload()
                ->searchable()
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
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn($state) => match ($state) {
                            'pending'   => 'warning',
                            'approved'  => "success",
                            'rejected'  => "danger",
                            default     =>  "gray",
                        })                    
                    ->formatStateUsing(fn($state)=> ucfirst($state)),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->preload()
                    ->searchable()
                    ->options([
                        'pending'   => 'Pending',
                        'approved'  => 'Approved',
                        'rejected'  => 'Rejected',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("lg"),
                Tables\Actions\DeleteAction::make()->label("")->tooltip("Delete")->size("lg"),
            ]);
    }
}
