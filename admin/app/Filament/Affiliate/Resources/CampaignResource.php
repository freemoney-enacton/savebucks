<?php

namespace App\Filament\Affiliate\Resources;

use App\Filament\Affiliate\Resources\CampaignResource\Pages;
use App\Filament\Affiliate\Resources\CampaignResource\RelationManagers;
use App\Models\Affiliate\Campaign;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;
use App\Filament\Affiliate\Resources\CampaignResource\RelationManagers\GoalsRelationManager;

class CampaignResource extends Resource
{
    protected static ?string $model = Campaign::class;
    protected static ?string $navigationIcon   = 'heroicon-o-trophy';
    protected static ?string $navigationGroup  = "Campaigns";
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Campaign Details')
                    ->description("Enter Basic Capaign Information")
                    ->columns(2)
                    ->schema([

                    Forms\Components\TextInput::make('name')
                        ->required()
                        ->infotip("Enter Name of the campaign")
                        ->maxLength(255),
                    
                    Forms\Components\TextInput::make('campaign_type')
                        // ->label()
                        ->required()
                        ->maxLength(255),

                    Forms\Components\Textarea::make('description')                        
                        ->required(),

                    Forms\Components\FileUpload::make('logo_url')
                        ->image()
                        ->label('Logo')
                        ->acceptedFileTypes([
                            'image/jpeg',
                            'image/png',
                        ])
                        ->placeholder("Valid formats: jpeg, png, max size:2mb")
                        ->maxSize(1024 * 2)
                        ->disk('frontend'),

                    Forms\Components\Textarea::make('terms_and_conditions')
                        ->infotip("Enter Terms and Conditions for the campaign")
                        ->label("Terms & Conditions"),

                    Forms\Components\Radio::make('status')
                        ->options([
                            'active' => 'Active',
                            'paused' => 'Pending',
                            'ended'  => 'Ended',
                        ])
                        ->inline()
                        ->inlineLabel(false)
                        ->label("Campaign Status")
                        ->required()                                    
                        ->default('active'),

                ]),

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                    
                Tables\Columns\ImageColumn::make('logo_url')
                    ->label('Logo')
                    ->searchable(),

                Tables\Columns\TextColumn::make('campaign_type')
                    ->label('Campaign Type')
                    ->searchable(),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn($state) => Str::ucfirst($state))
                    ->color(fn($state) => match ($state) {
                        'active'    => "success",
                        'paused'    => "warning", 
                        'ended'     => "danger",
                        default     => "gray",
                    })
                    ->searchable(),
                    
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label("Created At")
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'active' => 'Active',
                        'paused' => 'Paused',
                        'ended'  => 'Ended',                        
                    ])  
                    ->preload()
                    ->searchable()
                    ->label('Status'),
                
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
            GoalsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCampaigns::route('/'),
            'create' => Pages\CreateCampaign::route('/create'),
            'view' => Pages\ViewCampaign::route('/{record}'),
            'edit' => Pages\EditCampaign::route('/{record}/edit'),
        ];
    }
}
