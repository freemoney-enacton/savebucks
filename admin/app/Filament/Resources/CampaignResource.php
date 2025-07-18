<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CampaignResource\Pages;
use App\Filament\Resources\CampaignResource\RelationManagers;
use App\Filament\Resources\CampaignResource\RelationManagers\CampaignRatesRelationManager;
use App\Models\Campaign;
use App\Models\Network;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Resources\Concerns\Translatable;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\HtmlString;
use App\Models\AffiliateNetwork;
use ValentinMorice\FilamentJsonColumn\JsonColumn;


class CampaignResource extends Resource
{
    use Translatable;
    protected static ?string $model             = Campaign::class;
    protected static ?string $navigationGroup   = 'Affiliate Networks';
    protected static ?string $navigationLabel   = 'Campaigns Master';
    protected static ?int $navigationSort       =  2;
    protected static ?string $navigationIcon    = 'heroicon-o-rocket-launch';

    public static function form(Form $form): Form
    {

        return $form
            ->schema([

                Forms\Components\Section::make('Network Campaigns')
                    ->description('Network campaign details')
                    ->schema([

                        Forms\Components\Select::make('network_id')
                            ->options(AffiliateNetwork::pluck('name', 'id'))
                            ->label('Network')
                            ->preload()
                            ->searchable()
                            ->required(),

                        Forms\Components\TextInput::make('network_campaign_id')
                            ->required()
                            ->label('Network Campaign Id')
                            ->numeric()
                            ->default(0),

                        Forms\Components\TextInput::make('campaign_name')
                            ->required()
                            ->label('Campaign Name')
                            ->maxLength(255),

                        Forms\Components\TextInput::make('name')
                            ->label('Name'),

                        Forms\Components\TextInput::make('website'),

                        Forms\Components\Textarea::make('domains'),

                        Forms\Components\TextInput::make('domain_name')
                            ->label('Domain Name'),

                        Forms\Components\TextInput::make('affiliate_link')
                            ->label('Affiliate Link')
                            ->url(),

                        Forms\Components\TextInput::make('deeplink_format')
                            ->label('Deeplink Format'),

                        Forms\Components\TextInput::make('offer_id')
                            ->label("Offer Id")
                            ->maxLength(50),

                        Forms\Components\Textarea::make('restriction')
                            ->label("Restriction"),

                        Forms\Components\TextInput::make('logo'),

                        Forms\Components\TextInput::make('currency'),

                        Forms\Components\TextInput::make('country'),

                        Forms\Components\Textarea::make('countries')
                            ->columnSpanfull(),

                        Forms\Components\TextInput::make('cr'),

                        Forms\Components\TextInput::make('epc'),

                        Forms\Components\TextInput::make('campaign_status')
                            ->label("Campaign Status")
                            ->default('not_joined')
                            ->required(),

                        Forms\Components\TextInput::make('campaign_type')
                            ->label("Campaign Type")
                            ->maxLength(100),

                        Forms\Components\Toggle::make('ignored')
                            ->required()
                            ->default(false),

                        Forms\Components\Toggle::make('deeplink_allowed')
                            ->label('Deeplink Allowed'),

                        Forms\Components\Textarea::make('raw_categories')
                            ->label('Raw Categories')
                            ->columnSpanFull(),

                        Forms\Components\Radio::make('status')
                            ->options([
                                'not_joined'    =>  'Not Joined',
                                'joined'        =>    'Joined',
                                'pending'       =>  'Pending',
                                'declined'      =>  'Declined',
                            ])
                            ->inline()
                            ->columnSpanFull()
                            ->inlineLabel(false)
                            ->default('not_joined')
                            ->required(),

                    ])->columns(2)
                    ->columnSpan(2),

                Forms\Components\Section::make('Additional Information')
                    ->description('network campaign additional details')
                    ->schema([

                        Forms\Components\Textarea::make('description')
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('categories')
                            ->columnSpanFull(),

                        Forms\Components\DatePicker::make('start_date')
                            ->label('Start Date')
                            ->prefixicon('heroicon-o-calendar')
                            ->native(false),

                        Forms\Components\DatePicker::make('end_date')
                            ->label('End Date')
                            ->prefixicon('heroicon-o-calendar')
                            ->native(false),

                        Forms\Components\DatePicker::make('deleted_at')
                            ->label('Deleted At')
                            ->prefixicon('heroicon-o-calendar')
                            ->native(false),

                        Forms\Components\TextInput::make('found_batch_id')
                            ->label('Found Batch ID')
                            ->numeric(),                       

                        JsonColumn::make('extra_information')
                            ->label('Extra Information')
                            ->extraFieldWrapperAttributes([
                                // 'class' => 'category-block',
                            ])
                            ->editorHeight(300)
                            ->editorOnly(),

                        JsonColumn::make('raw_commission')
                            ->label('Raw Commission')
                            ->extraFieldWrapperAttributes([
                                // 'class' => 'category-block',
                            ])
                            ->editorHeight(300)
                            ->editorOnly(),

                        Forms\Components\Textarea::make('stats')
                            ->columnSpanFull(),

                    ])->columns(1)
                    ->columnSpan(1),

            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('network.name')
                    ->label('Network')
                    ->searchable(),

                Tables\Columns\TextColumn::make('network_campaign_id')
                    ->label(new HtmlString('<div style="width:80px; text-align:left;">Network<br>Campaign ID</div>'))
                    ->sortable(),

                Tables\Columns\TextColumn::make('campaign_name')
                    ->label('Campaign Name')
                    ->searchable(),

                Tables\Columns\TextColumn::make('campaign_status')
                    ->label('Campaign Status')
                    ->searchable(),


                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->label("Updated At")
                    ->toggleable(isToggledHiddenByDefault: false),

                Tables\Columns\SelectColumn::make('status')
                    ->options([
                        'not_joined'    =>  'Not Joined',
                        'joined'        =>    'Joined',
                        'pending'       =>  'Pending',
                        'declined'      =>  'Declined',
                    ])
                    ->alignEnd()
                    ->selectablePlaceholder(false),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'not_joined'    =>  'Not Joined',
                        'joined'        =>  'Joined',
                        'pending'       =>  'Pending',
                        'declined'      =>  'Declined',
                    ])
                    ->preload()
                    ->searchable(),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),
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
            CampaignRatesRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCampaigns::route('/'),
            'create' => Pages\CreateCampaign::route('/create'),
            'edit' => Pages\EditCampaign::route('/{record}/edit'),
            'view' => Pages\ViewCampaign::route('/{record}'),
        ];
    }
}
