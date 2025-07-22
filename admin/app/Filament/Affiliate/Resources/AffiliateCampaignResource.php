<?php

namespace App\Filament\Affiliate\Resources;

use App\Filament\Affiliate\Resources\AffiliateCampaignResource\Pages;
use App\Models\Affiliate\AffiliateCampaign;
use App\Models\Affiliate\Campaign;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class AffiliateCampaignResource extends Resource
{
    protected static ?string $model = AffiliateCampaign::class;
    protected static ?string $navigationGroup = 'Campaigns';
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([

            Forms\Components\Select::make('affiliate_id')
                ->label('Affiliate')
                ->relationship('affiliate', 'email')
                ->preload()
                ->searchable()
                ->required(),

            Forms\Components\Select::make('campaign_id')
                ->label('Campaign')
                ->options(fn() => Campaign::where('status', 'active')->pluck('name','id'))
                ->preload()
                ->searchable()
                ->required(),

            Forms\Components\Select::make('status')
                ->label("Status")
                ->preload()
                ->searchable()
                ->options([
                    'pending' => 'Pending',
                    'approved' => 'Approved',
                    'rejected' => 'Rejected',
                ])
                ->required()
                ->default('pending'),

        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            
            Tables\Columns\TextColumn::make('affiliate.name')
                ->description(fn($record) => $record->affiliate->email)
                ->label('Affiliate')
                ->searchable(['name','email']),

            Tables\Columns\TextColumn::make('campaign.name')
                ->label('Campaign')
                ->searchable()
                ->formatStateUsing(fn($state)=> ucfirst($state)),

            Tables\Columns\TextColumn::make('status')
                ->badge()
                ->formatStateUsing(fn($state)=> ucfirst($state))          
                ->color(fn($state) => match ($state) {
                        'pending'   => 'warning',
                        'approved'  => "success",
                        'rejected'  => "danger",
                        default     =>  "gray",
                    })
                ,
        ])
        ->filters([
            Tables\Filters\SelectFilter::make('status')
                ->preload()
                ->searchable()
                ->options([
                    'pending'   => 'Pending',
                    'approved'  => 'Approved',
                    'rejected'  => 'Rejected',
                ]),
        ])
        ->actions([
            Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("lg"),
            Tables\Actions\ViewAction::make()->label("")->tooltip("View")->size("lg"),
            // Tables\Actions\DeleteAction::make()->label("")->tooltip("Delete")->size("lg"),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAffiliateCampaigns::route('/'),
            // 'create' => Pages\CreateAffiliateCampaign::route('/create'),
            // 'edit' => Pages\EditAffiliateCampaign::route('/{record}/edit'),
        ];
    }
}
