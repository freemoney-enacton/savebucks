<?php

namespace App\Filament\Affiliate\Resources;

use App\Filament\Affiliate\Resources\AffiliateCampaignGoalResource\Pages;
use App\Filament\Affiliate\Resources\AffiliateCampaignGoalResource\RelationManagers;
use App\Models\Affiliate\AffiliateCampaignGoal;
use App\Models\Affiliate\Campaign;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class AffiliateCampaignGoalResource extends Resource
{
    protected static ?string $model = AffiliateCampaignGoal::class;
    protected static ?string $navigationGroup  = "Campaigns";
    protected static ?int $navigationSort = 2;
    protected static ?string $navigationIcon = 'heroicon-o-paper-airplane';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Basic Affiliate Campaign Goal Details')
                    ->description("Add Basic Affiliate Campaign Goal related information")
                    ->columns(2)
                    ->schema([

                    Forms\Components\Select::make('affiliate_id')
                        ->label('affiliate')
                        ->relationship('affiliate', 'email')
                        ->preload()
                        ->reactive()
                        ->searchable()
                        ->afterStateUpdated(function (callable $set) {
                            $set('campaign_goal_id', null);
                        })
                        ->validationMessages([
                            'required' => 'Please select affiliate to proceed.',                            
                        ])
                        ->required()                 
                        ->disabledon("edit")           
                        ->label("Affiliate"),
           
                    Forms\Components\Select::make('campaign_id')
                        ->label('Campaign')
                        // ->options(fn () => Campaign::where('status', 'active')->pluck('name', 'id'))
                        ->options(function (callable $get) {
                            $affiliateId = $get('affiliate_id');
                            
                            if (!$affiliateId) {
                                return [];
                            }

                            // Get campaign IDs that are assigned to the selected affiliate
                            $assignedCampaignIds = \App\Models\Affiliate\AffiliateCampaign::where('affiliate_id', $affiliateId)
                                ->pluck('campaign_id')
                                ->toArray();

                            // Return only campaigns that are assigned to the affiliate and are active
                            return Campaign::whereIn('id', $assignedCampaignIds)
                                ->where('status', 'active')
                                ->pluck('name', 'id');
                        })
                        ->preload()
                        ->disabledon("edit")
                        ->searchable()
                        ->reactive()
                        ->infotip("Select Affiliate's assigned campaigns")
                        ->afterStateUpdated(fn (callable $set) => $set('campaign_goal_id', null))
                        ->validationMessages([
                            'required' => 'Please select campaign to proceed.',
                        ])
                        ->required(),

                    Forms\Components\Select::make('campaign_goal_id')
                        ->label('Campaign Goal')
                        ->options(function (callable $get) {
                            $affiliateId = $get('affiliate_id');
                            
                            if (!$affiliateId) {
                                return [];
                            }

                            // Get all campaign goals
                            $campaignId = $get('campaign_id');

                            if (!$campaignId) {
                                return [];
                            }

                            $allGoals = \App\Models\Affiliate\CampaignGoal::where('status', 'active')
                                ->where('campaign_id', $campaignId)
                                ->pluck('name', 'id');

                            // Get already assigned goals for this affiliate
                            $assignedGoals = \App\Models\Affiliate\AffiliateCampaignGoal::where('affiliate_id', $affiliateId)
                                ->where('campaign_id', $campaignId)
                                ->pluck('campaign_goal_id')
                                ->toArray();
                            
                            // Return only unassigned goals
                            return $allGoals->except($assignedGoals);
                        })
                        ->preload()
                        ->reactive() 
                        ->searchable()                      
                        ->required()
                        ->validationMessages([
                            'required' => 'Please select campaign goal to proceed.',                            
                        ])
                        ->disabledOn("edit")
                        // ->disabled(fn (callable $get, string $operation) => !$get('affiliate_id') || $operation === 'edit')
                        ->infotip('Select an affiliate first to see available campaign goals'),     

                    Forms\Components\TextInput::make('campaign_goal_id')
                        ->formatStateUsing(fn ($state) => $state ? optional(\App\Models\Affiliate\CampaignGoal::find($state))->name : '')
                        ->visibleOn('edit')
                        ->disabledOn('edit') // Corrected from disabledon to disabledOn
                        ->label('Campaign Goal'),

                    Forms\Components\TextInput::make('custom_commission_rate')
                        ->required()
                        ->prefix(config('freemoney.default.default_currency'))
                        ->label('Custom Commission Rate')
                        ->minValue(0)
                        ->infotip('Enter the customised commision amount for affiliate')
                        ->numeric(),

                    Forms\Components\TextInput::make('qualification_amount')
                        ->required()
                        ->prefix(config('freemoney.default.default_currency'))
                        ->label('Qualification Amount')
                        ->minValue(0)
                        ->numeric()
                        ->visible(function ($get) {
                            $goalId = $get('campaign_goal_id');
                            
                            // Fetch the tracking code of the selected goal
                            $goal = \App\Models\Affiliate\CampaignGoal::find($goalId);
                            
                            if ($goal && $goal->tracking_code == 'user_transaction') {
                                // Show the qualification amount field only if the goal's tracking code is 'user_transaction'
                                return true;
                            }

                            // Otherwise, hide the field
                            return false;
                        })
                        ->infotip('Enter the amount required to qualify for this goal. This field will be applicable for "User Transaction" goal is selected.'),

                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('affiliate.name')
                    ->label('Affiliate')
                    ->description(fn($record) => $record->affiliate->email)
                    ->searchable(),           

                Tables\Columns\TextColumn::make('campaign.name')
                    ->label('Campaign')
                    ->searchable()
                    ->numeric(),

                Tables\Columns\TextColumn::make('campaignGoal.name')
                    ->label('Campaign Goal')
                    ->numeric()
                    ->searchable(),

                Tables\Columns\TextColumn::make('custom_commission_rate')
                    ->label('Custom Commission Rate')
                    ->money(config('freemoney.default.default_currency'))
                    ->searchable()
                    // ->align('right')
                    ->sortable(),

                Tables\Columns\TextColumn::make('qualification_amount')
                    ->label('Qualification Amount')
                    ->money(config('freemoney.default.default_currency'))
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([

                Tables\Filters\SelectFilter::make('affiliate_id')
                    ->relationship('affiliate', 'email')
                    ->preload()
                    ->searchable()
                    ->label('Affiliate'),

                // Tables\Filters\SelectFilter::make('campaign_id')
                //     ->relationship('campaign', 'name')                 
                //     ->preload()
                //     ->searchable()
                //     ->label('Campaign'),

                // Tables\Filters\SelectFilter::make('campaign_goal_id')
                //     ->relationship('campaignGoal', 'name')                 
                //     ->preload()
                //     ->searchable()
                //     ->label('Campaign Goal'),


                Tables\Filters\Filter::make('campaign_filter')
                ->label('Campaign & Goal')
                ->form([
                    Forms\Components\Select::make('campaign_id')
                        ->label('Campaign')
                        ->searchable()
                        ->options(fn () => \App\Models\Affiliate\Campaign::pluck('name', 'id'))
                        ->live()
                        ->afterStateUpdated(function ($state, $set) {
                            $set('campaign_goal_id', null); // Clear goal when campaign changes
                        }),
                        
                    Forms\Components\Select::make('campaign_goal_id')
                        ->label('Campaign Goal')
                        ->searchable()
                        ->options(function (callable $get) {
                            $campaignId = $get('campaign_id');
                            if (!$campaignId) {
                                return [];
                            }
                            
                            return \App\Models\Affiliate\CampaignGoal::where('campaign_id', $campaignId)
                                ->orderBy('name')
                                ->pluck('name', 'id');
                        })
                        ->disabled(fn (callable $get) => !$get('campaign_id'))
                        ->placeholder('Select campaign first'),
                ])
                ->query(function (Builder $query, array $data): Builder {
                    return $query
                        ->when($data['campaign_id'], function (Builder $q, $campaignId) {
                            return $q->where('campaign_id', $campaignId);
                        })
                        ->when($data['campaign_goal_id'], function (Builder $q, $campaignGoalId) {
                            return $q->where('campaign_goal_id', $campaignGoalId);
                        });
                })
                ->indicateUsing(function (array $data) {
                    $indicators = [];

                    if ($data['campaign_id']) {
                        $campaign = \App\Models\Affiliate\Campaign::find($data['campaign_id']);
                        if ($campaign) {
                            $indicators[] = 'Campaign: ' . $campaign->name;
                        }
                    }

                    if ($data['campaign_goal_id'] && $data['campaign_id']) {
                        $campaignGoal = \App\Models\Affiliate\CampaignGoal::where('id', $data['campaign_goal_id'])
                            ->where('campaign_id', $data['campaign_id'])
                            ->first();
                        if ($campaignGoal) {
                            $indicators[] = 'Goal: ' . $campaignGoal->name;
                        }
                    }

                    return $indicators;
                })

            
                                
            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip("View")->size("lg"),
                Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("lg"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAffiliateCampaignGoals::route('/'),
            // 'create' => Pages\CreateAffiliateCampaignGoal::route('/create'),
            // 'view' => Pages\ViewAffiliateCampaignGoal::route('/{record}'),
            // 'edit' => Pages\EditAffiliateCampaignGoal::route('/{record}/edit'),
        ];
    }
}
