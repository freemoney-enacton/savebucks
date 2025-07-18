<?php

namespace App\Filament\Affiliate\Resources;

use App\Filament\Affiliate\Resources\AffiliateCampaignGoalResource\Pages;
use App\Filament\Affiliate\Resources\AffiliateCampaignGoalResource\RelationManagers;
use App\Models\Affiliate\AffiliateCampaignGoal;
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
                        ->relationship('affiliate', 'name')
                        ->preload()
                        ->searchable()
                        ->required()                            
                        ->label("Affiliate"),
           
                    Forms\Components\Select::make('campaign_id')
                        ->label('Campaign')
                        ->relationship('campaign', 'name')
                        ->preload()
                        ->searchable()
                        ->required(),

                    Forms\Components\Select::make('campaign_goal_id')
                        ->relationship('campaignGoal', 'name')
                        ->label('Campaign Goal')
                        ->preload()
                        ->searchable(),        

                    Forms\Components\TextInput::make('custom_commission_rate')
                        ->label('Custom Commission Rate')                        
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
                    ->numeric()
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
                    Tables\Actions\DeleteBulkAction::make(),
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
            'create' => Pages\CreateAffiliateCampaignGoal::route('/create'),
            'view' => Pages\ViewAffiliateCampaignGoal::route('/{record}'),
            'edit' => Pages\EditAffiliateCampaignGoal::route('/{record}/edit'),
        ];
    }
}
