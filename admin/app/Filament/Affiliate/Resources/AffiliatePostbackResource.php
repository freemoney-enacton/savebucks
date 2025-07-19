<?php

namespace App\Filament\Affiliate\Resources;

use App\Filament\Affiliate\Resources\AffiliatePostbackResource\Pages;
use App\Filament\Affiliate\Resources\AffiliatePostbackResource\RelationManagers;
use App\Models\Affiliate\AffiliatePostback;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class AffiliatePostbackResource extends Resource
{
    protected static ?string $model             = AffiliatePostback::class;
    protected static ?string $navigationGroup   = "Affiliate";
    protected static ?string $navigationLabel   = 'Affiliate Postbacks';
    protected static ?string $navigationIcon    = 'heroicon-o-link';
    protected static ?string $modelLabel        = 'Affiliate Postback';
    protected static ?int $navigationSort     = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                
                Forms\Components\Section::make('Basic Information')
                    ->description("Basic Affiliate Postback Information")
                    ->columns(2)
                    ->schema([

                    Forms\Components\Select::make('affiliate_id')
                        ->label('affiliate')
                        ->relationship('affiliate', 'email')                        
                        ->preload()
                        ->searchable()
                        ->required()                            
                        ->label("Affiliate"),

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

                            return \App\Models\Affiliate\CampaignGoal::where('status', 'active')
                                ->where('campaign_id', $campaignId)
                                ->pluck('name', 'id');
                        })
                        ->preload()
                        ->searchable()
                        ->reactive()
                        ->disabled(fn (callable $get) => !$get('campaign_id')),

                    Forms\Components\Textarea::make('postback_url')
                        ->required()
                        ->label('Postback URL')
                        ->rows(5)
                        // ->url()
                        // ->prefixIcon('heroicon-o-link')
                        ->maxLength(1500),

                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('affiliate.name')
                    ->numeric()
                    ->description(fn($record) => $record->affiliate->email)
                    ->sortable(),

                Tables\Columns\TextColumn::make('campaign.name')
                    ->label("Campaign")
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('campaignGoal.name')
                    ->label("Campaign Goal")
                    ->numeric()
                    ->sortable(),
                    
                // Tables\Columns\TextColumn::make('postback_url')
                //     ->label("Postback URL")
                //     ->limit(35)
                //     ->tooltip(fn($state)=> $state)
                //     ->searchable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label("Created At")
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label("Updated At")
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([

                Tables\Filters\SelectFilter::make('affiliate_id')
                    ->relationship('affiliate', 'email')
                    ->preload()
                    ->searchable()
                    ->label('Filter By Affiliate'),

                Tables\Filters\SelectFilter::make('campaign_id')
                    ->relationship('campaign', 'name')                 
                    ->preload()
                    ->searchable()
                    ->label('Filter By Campaign'),

                Tables\Filters\SelectFilter::make('campaign_goal_id')
                    ->relationship('campaignGoal', 'name')                 
                    ->preload()
                    ->searchable()
                    ->label('Filter By Campaign Goal'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip("View")->size("lg"),
                // Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("lg"),
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
            'index' => Pages\ListAffiliatePostbacks::route('/'),
            // 'create' => Pages\CreateAffiliatePostback::route('/create'),
            // 'view' => Pages\ViewAffiliatePostback::route('/{record}'),
            // 'edit' => Pages\EditAffiliatePostback::route('/{record}/edit'),
        ];
    }
}
