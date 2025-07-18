<?php

namespace App\Filament\Resources\CampaignResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CampaignRatesRelationManager extends RelationManager
{
    protected static string $relationship = 'campaignRates';

    public function form(Form $form): Form
    {
        return $form
            ->columns(2)
            ->schema([

                Forms\Components\Section::make('Rate Information')
                    ->columns(1)
                    ->schema([

                        Forms\Components\TextInput::make('network_id')
                            ->label('Network ID')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('network_campaign_id')
                            ->label('Network Campaign ID')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('campaign_id')
                            ->label('Campaign ID')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
        
                        Forms\Components\Radio::make('type')
                            ->options([
                                'fixed' => 'Fixed',
                                'percent' => 'Percent',
                            ])
                            ->required()
                            ->default('percent'),
                        
                        Forms\Components\DateTimePicker::make('deleted_at')
                                ->native(false)
                                ->label('Delete at')
                                ->prefixicon("heroicon-o-calendar")                            
            
                ])->columnSpan(1),

                Forms\Components\Section::make('Additional Information')
                    ->columns(1)
                    ->schema([

                    Forms\Components\TextInput::make('amount')
                        ->numeric()
                        ->required()
                        ->maxLength(255),          
        
                    Forms\Components\TextInput::make('base_amount')
                        ->numeric()
                        ->required()
                        ->maxLength(255),                    
        
                    Forms\Components\TextInput::make('currency')                       
                        ->Placeholder('e.g. USD'),

                    Forms\Components\TextInput::make('network_rate_id')
                        ->required()
                        ->maxLength(255),
        
                    Forms\Components\TextInput::make('found_batch_id')
                        ->maxLength(255),
                    

                ])->columnSpan(1)
                        
            ]);
    }
    
    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
               
                Tables\Columns\TextColumn::make('network_campaign_id')->label('Network Campaign ID'),
                Tables\Columns\TextColumn::make('name'),                
                Tables\Columns\TextColumn::make('type'),
                Tables\Columns\TextColumn::make('amount'),
                Tables\Columns\TextColumn::make('base_amount')->label('Base Amount'),
                Tables\Columns\TextColumn::make('network_rate_id')->label('Network Rate ID')->limit(20)->tooltip(fn($state)=>$state),
                Tables\Columns\TextColumn::make('currency'),
                Tables\Columns\TextColumn::make('updated_at')->label('Updated At')->tooltip(fn($state)=>$state)->date(),

            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()->label("Add Campaign Rate"),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
                Tables\Actions\DeleteAction::make()->label("")->tooltip('Delete')->size("xl"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
