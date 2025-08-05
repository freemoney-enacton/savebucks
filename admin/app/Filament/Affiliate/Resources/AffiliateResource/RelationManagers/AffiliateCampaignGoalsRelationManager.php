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
                    ->infotip('Select the campaign associated with the affiliate. Only campaigns assigned to this affiliate will be shown.')
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
                    ->infotip('Select a campaign goal for the affiliate from the available goals related to the selected campaign.')
                    ->disabled(fn (callable $get) => !$get('campaign_id')),

                Forms\Components\TextInput::make('custom_commission_rate')
                    ->label('Custom Commission Rate')
                    ->prefix(config('freemoney.default.default_currency'))
                    ->infotip('Enter the commission rate for the affiliate. This is a custom rate specific to the affiliate for this goal.')
                    ->numeric(),

                Forms\Components\TextInput::make('qualification_amount')
                    ->label('Qualification Amount')
                    ->prefix(config('freemoney.default.default_currency'))
                    ->numeric()
                    ->minValue(0)
                    ->visible(function ($get) {
                        $goalId = $get('campaign_goal_id');
                        
                        // Fetch the tracking code of the selected goal
                        $goal = CampaignGoal::find($goalId);
                        
                        // Only show the qualification amount if the goal's tracking code is 'user_transaction'
                        return $goal && $goal->tracking_code == 'user_transaction';
                    })
                    ->infotip('Enter the amount required for the affiliate to qualify for this goal. This will only show if the "User Transaction" goal is selected.'),

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
                Tables\Columns\TextColumn::make('qualification_amount')
                    ->label('Qualification Amount')
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
