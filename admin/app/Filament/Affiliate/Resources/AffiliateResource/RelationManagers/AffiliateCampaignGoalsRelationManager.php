<?php

namespace App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use App\Models\Affiliate\CampaignGoal;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class AffiliateCampaignGoalsRelationManager extends RelationManager
{
    protected static string $relationship = 'affiliateCampaignGoals';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                // Forms\Components\TextInput::make('affiliate_id')
                //     ->required()
                //     ->maxLength(255),

                
                Forms\Components\Select::make('campaign_id')
                    ->label('Campaign')
                    ->relationship('campaign', 'name')
                    ->preload()
                    ->searchable()
                    ->reactive()
                    ->afterStateUpdated(fn (callable $set) => $set('campaign_goal_id', null))
                    ->required(),

                Forms\Components\Select::make('campaign_goal_id')
                    ->label('Campaign Goal')
                    ->options(function (callable $get) {
                        $campaignId = $get('campaign_id');

                        if (!$campaignId) {
                            return [];
                        }

                        return CampaignGoal::where('status', 'active')
                            ->where('campaign_id', $campaignId)
                            ->pluck('name', 'id');
                    })
                    ->preload()
                    ->searchable()
                    ->reactive()
                    ->required()
                    ->disabled(fn (callable $get) => !$get('campaign_id')),

                Forms\Components\TextInput::make('custom_commission_rate')
                    ->label('Custom Commission Rate')       
                    ->prefix(config('freemoney.default.default_currency'))                 
                    ->numeric(),

            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('affiliate_id')
            ->columns([

                // Tables\Columns\TextColumn::make('affiliate_id'),

                Tables\Columns\TextColumn::make('campaign.name')
                    ->label('Campaign')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('campaignGoal.name')
                    ->label('Campaign Goal')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('custom_commission_rate')
                    ->label('Custom Commission Rate')
                    ->money(config('freemoney.default.default_currency'))                    
                    ->sortable(),
            ])
            ->filters([
                
                Tables\Filters\SelectFilter::make('campaign_id')
                    ->label("Filter By Campaign")
                    ->relationship('campaign', 'name')
                    ->searchable()
                    ->preload(),

                Tables\Filters\SelectFilter::make('campaign_goal_id')
                    ->label("Filter By Campaign Goal")
                    ->relationship('campaign', 'name')
                    ->searchable()
                    ->preload(),

            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()->label("Add Campaign Goal")->tooltip("Add")->size("lg"),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("lg"),
                // Tables\Actions\DeleteAction::make()->label("")->tooltip("Delete")->size("lg"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
