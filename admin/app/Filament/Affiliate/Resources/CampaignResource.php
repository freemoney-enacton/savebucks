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
use Tapp\FilamentAuditing\RelationManagers\AuditsRelationManager;
use Filament\Forms\Components\RichEditor;


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
                        ->label("Campaign Type")
                        ->required()
                        ->maxLength(255),

                    // Forms\Components\TextInput::make('min_payout_request')
                    //     ->label('Minimum Payout Request Amount')
                    //     ->infotip("The minimum amount of payout an affiliate can request for this campaign")
                    //     ->numeric()
                    //     ->prefix(config('freemoney.currencies.default')),

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

                    Forms\Components\Toggle::make('is_default')
                        ->label('Default Campaign'),

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



                ])->columnspan(2),

                Forms\Components\Section::make('Other Details')
                    ->description("")
                    ->columns(2)
                    ->schema([

                    Forms\Components\TextInput::make('terms_and_condition_url')
                        ->label("Terms & Conditions URL")
                        ->columnspanFull()
                        ->prefixIcon('heroicon-m-link')
                        ->placeholder("Enter terms & conditions URL")
                        ->infotip("If you have a link to the terms & conditions page, enter it here.")
                        ->url()
                        ->nullable()
                        ->maxLength(255),

                    Forms\Components\RichEditor::make('description')
                        // ->columnSpanFull()
                        ->required(),

                    Forms\Components\RichEditor::make('terms_and_conditions')
                        // ->columnSpanFull()
                        ->infotip("Enter Terms and Conditions for the campaign")
                        ->label("Terms & Conditions"),

                ])->columnspan(2),

            ])->columns(2);
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

                Tables\Columns\IconColumn::make('is_default')
                    ->label('Default')
                    ->boolean(),

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
            // AuditsRelationManager::class,
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

    public static function shouldRegisterNavigation(): bool
    {
        return true;
    }
}
