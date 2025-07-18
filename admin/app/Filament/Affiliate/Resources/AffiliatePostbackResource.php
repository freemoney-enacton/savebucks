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
    protected static ?string $navigationGroup   = "Logs & Reports";
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

                    Forms\Components\TextInput::make('postback_url')
                        ->required()
                        ->label('Postback URL')
                        ->url()
                        ->prefixIcon('heroicon-o-link')
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
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('campaign.name')
                    ->numeric()
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('campaignGoal.name')
                    ->numeric()
                    ->searchable()
                    ->sortable(),

                Tables\Columns\IconColumn::make('postback_url')
                    ->label('Destination Url')
                    ->url(fn($record): string => $record->postback_url)
                    ->icon('heroicon-o-link')
                    ->tooltip(fn($record): string => $record->postback_url)
                    ->searchable(),

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
            'create' => Pages\CreateAffiliatePostback::route('/create'),
            'view' => Pages\ViewAffiliatePostback::route('/{record}'),
            'edit' => Pages\EditAffiliatePostback::route('/{record}/edit'),
        ];
    }
}
