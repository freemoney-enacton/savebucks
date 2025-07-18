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
           
                    // Forms\Components\Select::make('campaign_id')
                    //     ->label('Campaign')
                    //     ->options(Campaign::where('status', 'active')->pluck("name", 'id'))
                    //     ->default(1)
                    //     ->preload()
                    //     ->searchable()
                    //     ->visibleon([''])
                    //     ->required(),
                        
                    Forms\Components\Hidden::make('campaign_id')
                        ->default(1),

                    Forms\Components\Select::make('campaign_goal_id')
                        ->label('Campaign Goal')
                        ->options(function (callable $get) {
                            $affiliateId = $get('affiliate_id');
                            
                            if (!$affiliateId) {
                                return [];
                            }

                            // Get all campaign goals
                            $allGoals = \App\Models\Affiliate\CampaignGoal::where('status', 'active')->pluck('name', 'id');
                            
                            // Get already assigned goals for this affiliate
                            $assignedGoals = \App\Models\Affiliate\AffiliateCampaignGoal::where('affiliate_id', $affiliateId)
                                ->where('campaign_id', 1)
                                ->pluck('campaign_goal_id')
                                ->toArray();
                            
                            // Return only unassigned goals
                            return $allGoals->except($assignedGoals);
                        })
                        ->preload()
                        ->visibleon("create")
                        ->reactive() 
                        ->searchable()                      
                        ->required()
                        ->validationMessages([
                            'required' => 'Please select campaign goal to proceed.',                            
                        ])
                        ->disabled(fn (callable $get, string $operation) => !$get('affiliate_id') || $operation === 'edit')
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
                        ->numeric(),

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
                    ->relationship('affiliate', 'name')
                    ->preload()
                    ->searchable()
                    ->label('Affiliate'),

                Tables\Filters\SelectFilter::make('campaign_id')
                    ->relationship('campaign', 'name')                 
                    ->preload()
                    ->searchable()
                    ->label('Campaign'),

                Tables\Filters\SelectFilter::make('campaign_goal_id')
                    ->relationship('campaignGoal', 'name')                 
                    ->preload()
                    ->searchable()
                    ->label('Campaign Goal'),
                
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
