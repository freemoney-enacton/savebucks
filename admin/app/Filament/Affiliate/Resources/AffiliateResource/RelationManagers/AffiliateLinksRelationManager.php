<?php

namespace App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Grid;

class AffiliateLinksRelationManager extends RelationManager
{
    protected static string $relationship = 'affiliateLinks';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Link Details')
                    ->description('Fundamental information about the affiliate link')
                    ->schema([

                        Grid::make(2)->schema([

                            Forms\Components\TextInput::make('slug')
                                ->required()
                                ->unique(ignoreRecord: true)
                                ->maxLength(255)
                                ->helperText('A unique identifier for the link'),                        

                            Forms\Components\Select::make('campaign_id')
                                ->relationship('campaign', 'name')
                                ->required()
                                ->searchable()
                                ->preload()
                                ->placeholder('Select a campaign'),

                            // Forms\Components\Select::make('affiliate_id')
                            //     ->relationship('affiliate', 'name')
                            //     ->required()
                            //     ->searchable()
                            //     ->preload()
                            //     ->placeholder('Select an affiliate'),

                            Forms\Components\TextInput::make('destination_url')
                                ->label('Destination URL')
                                ->url()
                                ->required()
                                ->maxLength(1000)
                                ->suffixIcon('heroicon-m-globe-alt')
                                ->placeholder('https://example.com/landing-page'),
                        ]),

                      
                    ]),

                Section::make('Tracking Parameters')
                    ->description('Additional tracking and sub-tracking information')
                    ->schema([
                        Grid::make(3)->schema([
                            Forms\Components\TextInput::make('sub1')
                                ->label('Sub ID 1')
                                ->nullable()
                                ->maxLength(255),

                            Forms\Components\TextInput::make('sub2')
                                ->label('Sub ID 2')
                                ->nullable()
                                ->maxLength(255),

                            Forms\Components\TextInput::make('sub3')
                                ->label('Sub ID 3')
                                ->nullable()
                                ->maxLength(255),
                        ]),
                    ]),

                Section::make('Link Performance')
                    ->description('Link performance and status tracking')
                    ->schema([
                        Grid::make(2)->schema([
                            Forms\Components\Select::make('status')
                                ->options([
                                    'active' => 'Active',
                                    'inactive' => 'Inactive',
                                ])
                                ->default('active')
                                ->required(),

                            Forms\Components\TextInput::make('total_clicks')
                                ->label('Total Clicks')
                                ->numeric()
                                ->default(0),                         

                            Forms\Components\TextInput::make('total_earnings')
                                ->label('Total Earnings')
                                ->numeric()
                                ->prefix('$')
                                ->default(0),
                              
                        ]),
                    ]),
            ]);
    }



    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('slug')
            ->columns([

                Tables\Columns\TextColumn::make('slug')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('campaign.name')
                    ->label('Campaign')
                    ->searchable(),

                Tables\Columns\IconColumn::make('destination_url')
                    ->label('Destination')
                    ->url(fn($record): string => $record->destination_url)   
                    ->tooltip(fn($record): string => $record->destination_url)       
                    ->openUrlInNewTab()
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->searchable(),
                  
                Tables\Columns\TextColumn::make('total_clicks')
                    ->label('Clicks')
                    ->searchable()
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('total_earnings')
                    ->label('Earnings')
                    ->searchable()
                    ->money(config('freemoney.default.default_currency'))
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('status')
                    ->searchable()
                    ->formatStateUsing(fn($state) => ucfirst($state))
                    ->colors([
                        'success' => 'active',
                        'warning' => 'paused',
                        'danger' => 'archived',
                    ]),
            ])
            ->filters([

                Tables\Filters\SelectFilter::make('campaign_id')
                    ->label("Filter by Campaign")
                    ->relationship('campaign', 'name')
                    ->searchable()
                    ->preload(),

                Tables\Filters\SelectFilter::make('status')
                    ->label("Filter by Status")
                    ->options([
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                    ]),
            ])
            ->headerActions([
                // Tables\Actions\CreateAction::make()
                //     ->label('Create Affiliate Link'),
            ])
            ->actions([
                // Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("lg"),
                Tables\Actions\ViewAction::make()->label("")->tooltip("View")->size("lg"),
                // Tables\Actions\DeleteAction::make()->label("")->tooltip("View")->size("lg"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
