<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AffiliateNetworkResource\Pages;
use App\Filament\Resources\AffiliateNetworkResource\RelationManagers;
use App\Models\AffiliateNetwork;
use App\Models\Currency;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use App\Models\Store;
use Filament\Resources\Concerns\Translatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use ValentinMorice\FilamentJsonColumn\JsonColumn;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\HtmlString;


class AffiliateNetworkResource extends Resource
{
    use Translatable;
    protected static ?string $model             = AffiliateNetwork::class;
    protected static ?string $navigationGroup   = 'Affiliate Networks';
    protected static ?int $navigationSort       =  2;
    protected static ?string $navigationIcon    = 'heroicon-o-globe-asia-australia';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Affiliate Network')
                    ->description('Network campaign details')
                    ->schema([

                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(150)
                            ->label('Network Name'),

                        Forms\Components\TextInput::make('shortname')
                            ->maxLength(3)
                            ->label('Short Name'),

                        Forms\Components\TextInput::make('namespace')
                            ->maxLength(255)
                            ->label('Namespace'),

                        Forms\Components\TextInput::make('affiliate_id')
                            ->maxLength(50)
                            ->label('Affiliate ID'),

                        Forms\Components\TextInput::make('website_id')
                            ->maxLength(50)
                            ->label('Website ID'),

                        Forms\Components\TextInput::make('confirm_days')
                            ->required()
                            ->numeric()
                            ->default(90)
                            ->infotip("After this many days, Sale will be mark as CONFIRMED without depending on network status. keep it 90+ Days")
                            ->label('Confirm Days'),

                        Forms\Components\TextInput::make('confirm_duration')
                            ->required()
                            ->maxLength(100)
                            ->default('+90 days')
                            ->infotip("This is used to show the confirm days on front end  for on store page as a fallback, when the value is not available as store level or at a setting level")
                            ->label('Confirm Duration (For front-end)'),

                        Forms\Components\Select::make('currency')
                            ->options(Currency::where('enabled', true)->pluck('iso_code', 'iso_code'))
                            ->searchable()
                            ->preload()
                            ->label('Currency'),

                        Forms\Components\TextInput::make('network_platform')
                            ->maxLength(50)
                            ->label('Network Platform'),

                        Forms\Components\TextInput::make('network_unique_key')
                            ->maxLength(255)
                            ->label('Network Unique Key'),

                        Forms\Components\Toggle::make('enabled')
                            ->required()
                            ->default(true)
                            ->label('Enabled'),

                    ])->columns(2)
                    ->columnSpan(2),

                Forms\Components\Section::make('Additional Information')
                    ->description('Fill in additional affiliate network details')
                    ->schema([

                        JsonColumn::make('columns_update')
                            ->label('Columns Update')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->editorHeight(300)
                            ->editorOnly(),

                            JsonColumn::make('campaign_statuses')
                            ->label('Campaign Statuses')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->editorHeight(300)
                            ->editorOnly(),

                            JsonColumn::make('sale_statuses')
                            ->label('Sale Statuses')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->editorHeight(300)
                            ->editorOnly(),

                            JsonColumn::make('auth_tokens')
                            ->label('Auth Tokens')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->editorHeight(300)
                            ->editorOnly(),

                        Forms\Components\Textarea::make('credentials')
                            ->label('Credentials'),

                        Forms\Components\TextInput::make('api_key')
                            ->maxLength(500)
                            ->label('API Key'),

                        Forms\Components\Select::make('direct_merchant')
                            ->options(Store::pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->label('Direct Merchant'),

                    ])->columns(2)
                    ->columnSpan(2),

            ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('name')
                    ->searchable(),

                Tables\Columns\TextColumn::make('affiliate_id')
                    ->label('Affiliate ID')
                    ->searchable(),

                Tables\Columns\TextColumn::make('confirm_days')
                    ->label('Confirm Days')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\ToggleColumn::make('enabled'),

                Tables\Columns\TextColumn::make('currency')
                    ->label(new HtmlString('<div style="width:80px; text-align:left; white-space:normal;">Default<br>Currency</div>'))
                    ->searchable(),

                Tables\Columns\TextColumn::make('updated_at')
                    ->date()
                    ->label('Updated At')
                    ->tooltip(fn($state) => $state)
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: false),

            ])
            ->filters([

                Tables\Filters\TernaryFilter::make('enabled'),

                Tables\Filters\SelectFilter::make('currency')
                    ->options(Currency::pluck('iso_code', 'iso_code'))
                    ->preload()
                    ->searchable()
                    ->label('Currency'),
                
                Tables\Filters\SelectFilter::make('direct_merchant')
                    ->options(Store::pluck('name', 'id'))
                    ->preload()
                    ->searchable()
                    ->label('Direct Merchant'),

            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([

                    Tables\Actions\DeleteBulkAction::make(),

                    ...collect([
                        [
                            'name' => 'is_enabled',
                            'label' => 'Set As Enable',
                            'icon' => 'heroicon-o-check-badge',
                            'value' => 1,
                            'field' => 'enabled',
                        ],
                        [
                            'name' => 'is_disabled',
                            'label' => 'Set As Disable',
                            'icon' => 'heroicon-o-x-circle',
                            'value' => 0,
                            'field' => 'enabled',
                        ],
                    ])->map(function ($action) {

                        return Tables\Actions\BulkAction::make($action['name'])
                            ->label($action['label'])
                            ->icon($action['icon'])
                            ->action(function (Collection $records) use ($action) {
                                AffiliateNetwork::whereIn('id', $records->pluck('id'))->update([$action['field'] => $action['value']]);
                            })
                            ->deselectRecordsAfterCompletion();
                    })->toArray(),


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
            'index' => Pages\ListAffiliateNetworks::route('/'),
            'create' => Pages\CreateAffiliateNetwork::route('/create'),
            'edit' => Pages\EditAffiliateNetwork::route('/{record}/edit'),
            'view' => Pages\ViewAffiliateNetwork::route('/{record}'),
        ];
    }
}
