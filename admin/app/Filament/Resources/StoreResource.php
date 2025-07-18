<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StoreResource\Pages;
use App\Enums\OfferStatus;
use App\Filament\Resources\StoreResource\RelationManagers\StoreCashbackRelationManager;
use App\Models\Store;
use App\Models\StoreCategory;
use App\Models\AffiliateNetwork;
use App\Models\Country;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\Section;
use Illuminate\Support\Str;
use Filament\Resources\Concerns\Translatable;
use Filament\Resources\RelationManagers\RelationGroup;
use Filament\Tables\Actions\BulkAction;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Facades\Config;

class StoreResource extends Resource
{
    use Translatable;
    protected static ?string $model             = Store::class;
    protected static ?string $navigationIcon    = 'heroicon-o-building-storefront';
    protected static ?string $navigationGroup   = "Stores & Offers";
    protected static ?int $navigationSort       =  1;


    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Section::make('Stores')
                    ->description('Store general details')
                    ->schema([

                        Forms\Components\TextInput::make('name')
                            ->minLength(1)
                            ->maxLength(100)
                            ->required(),

                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->minLength(1)
                            ->maxLength(120)
                            ->regex('/^[a-z_-]+$/'),

                        Forms\Components\FileUpload::make('logo')
                            ->label('Logo')
                            ->columnSpanFull()
                            ->placeholder('Upload store logo')
                            ->imageEditor()                
                            ->disk('frontend')
                            ->directory('stores')
                            ->nullable()
                            ->visibility('public')
                            ->maxSize(2048)
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/jpg'])
                            ->getUploadedFileNameForStorageUsing(function ($file, $get): string {
                                $extension = $file->getClientOriginalExtension() ?: 'png';
                                return $get('slug') . '-logo-' . uniqid() . '.' . $extension;
                            })
                            ->helperText('Recommended: max size 2MB,(.jpg, .png)'),

                        Forms\Components\FileUpload::make('banner_image')
                            ->label('Banner Image')
                            ->placeholder('Upload banner image')
                            ->imageEditor()
                            ->columnSpanFull()
                            ->disk('frontend')
                            ->directory('stores')
                            ->nullable()
                            ->visibility('public')
                            ->maxSize(2048)                                              
                            ->acceptedFileTypes(['image/jpeg', 'image/png'])
                            ->getUploadedFileNameForStorageUsing(function ($file, $get): string {
                                $extension = $file->getClientOriginalExtension() ?: 'png';
                                return $get('slug') . '-banner-' . uniqid() . '.' . $extension;
                            })
                            ->helperText('Recommended: max size 2MB,(.jpg, .png)'),

                        Forms\Components\TextInput::make('homepage')
                            ->required()
                            ->columnSpanFull()
                            ->url()
                            ->infotip("enter website homepage url")
                            ->minLength(1)
                            ->maxLength(500),

                        Forms\Components\TextInput::make('domain_name')
                            ->label('Domain Name')
                            ->infotip("enter website name without https:// or www, required for the app, extention")
                            ->minlength(1)
                            ->maxLength(255),

                        Forms\Components\Select::make('cats')
                            ->label('Categories')
                            ->options(StoreCategory::all()->pluck('name', 'id'))
                            ->multiple()
                            ->searchable()
                            ->preload(),

                        Forms\Components\TextInput::make('deeplink')
                            ->required()
                            ->minLength(1)
                            ->infotip("Use sub Id as MYCBCLKID, CLICKID, Enter #ULINK for dynamic affiliate link in case of encoded links or #LINK for simple link"),

                        Forms\Components\TextInput::make('cashback_percent')
                            ->required()
                            ->label('Cashback Percentage')
                            ->numeric()
                            ->maxValue(100)
                            ->infotip("Enable the % of your commision earning you wish to passon to your users. i.e. 50.00")
                            ->default(0.00),

                        Forms\Components\Select::make('cashback_type')
                            ->required()
                            ->label('Cashback Type')
                            ->options([
                                'cashback' => 'Cashback',
                                'reward'   => 'Rewards',
                            ])
                            ->label('Cashback Type')
                            ->infotip("Keep cashback, unless for some Merchants who doen't allow cashback, you can set rewards")
                            ->selectablePlaceholder(false)
                            ->default('cashback'),

                        Forms\Components\TextInput::make('tracking_speed')
                            ->label('Tracking Speed')
                            ->infotip("Enter Value like 1 Hour, 1 Day etc"),

                        Forms\Components\TextInput::make('confirm_duration')
                            ->label('Confirm Duration')
                            ->infotip("Days required to mark transaction confirmed, Must be in PHP strtotime supoorted text +1 month")
                            ->default('90 Days'),

                        Forms\Components\Select::make('network_id')
                            ->options(AffiliateNetwork::where('enabled', 1)->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->label('Network'),

                        Forms\Components\TextInput::make('network_campaign_id')
                            ->required()
                            ->label('Network Campaign Id'),

                        Forms\Components\TextInput::make('discount')
                            ->nullable(),

                        Forms\Components\Toggle::make('cashback_enabled')
                            ->label('Cashback Enabled')
                            ->default(1)
                            ->infotip("Enable if you wish to passon the cashback to the user")
                            ->required(),

                        Forms\Components\Toggle::make('is_claimable')
                            ->label('Is Claimable')
                            ->default(1)
                            ->infotip("Whether the cashback can be claimed by honourded netwrok/merchant")
                            ->required(),

                        // Forms\Components\Toggle::make('is_shareable')
                        //     ->label('Is Shareable')
                        //     ->default(1)
                        //     ->infotip("Can user create sharable link from share & earn, Required only if you opted for the share & earn addon")
                        //     ->required(),

                        Forms\Components\Toggle::make('ghost')
                            ->label('Ghost')
                            ->infotip("Required if you do not want to keep this store visible anywhere on the website, but going to share URLwith some specific customers")
                            ->default(0)
                            ->required(),

                        Forms\Components\Toggle::make('is_featured')
                            ->label('Is Featured')
                            ->default(0)
                            ->required(),

                        // Forms\Components\Toggle::make('exclude_sitemap')
                        //     ->label('Exclude Sitemap')
                        //     ->default(0)
                        //     ->required(),

                    ])->columns(2)
                    ->columnSpan(3),


                Section::make('Aditional Details')
                    ->description('Store aditional details')
                    ->schema([

                        Forms\Components\TextInput::make('h1')
                            ->infotip("Default is from SEO settings, you can override from here.")
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('h2')
                            ->infotip("Default is from SEO settings, you can override from here.")
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('meta_title')
                            ->label("Meta Title")
                            ->infotip("Default is from SEO settings, you can override from here.")
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('meta_desc')
                            ->label("Meta Description")
                            ->infotip("Default is from SEO settings, you can override from here.")
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('meta_kw')
                            ->label("Meta Kw")
                            ->columnSpanFull(),

                        Forms\Components\RichEditor::make('terms_todo')
                            ->infotip("Default do's are from content block, you can override here by terms specific to this store.")
                            ->label('Terms Todo')
                            ->fileAttachmentsVisibility('public')
                            ->fileAttachmentsDisk('frontend')
                            ->fileAttachmentsDirectory('stores')
                            ->columnSpanFull(),

                        Forms\Components\RichEditor::make('terms_not_todo')
                            ->label('Terms Not Todo')
                            ->fileAttachmentsVisibility('public')
                            ->fileAttachmentsDisk('frontend')
                            ->fileAttachmentsDirectory('stores')
                            ->infotip("Default dont's are from content block, you can override here by terms specific to this store.")
                            ->columnSpanFull(),

                        Forms\Components\RichEditor::make('about')
                            ->infotip("Text for SEO related keywords and content, showup at the bottom of the store page.")
                            ->fileAttachmentsVisibility('public')
                            ->fileAttachmentsDisk('frontend')
                            ->fileAttachmentsDirectory('stores')
                            ->columnSpanFull(),

                        Forms\Components\Select::make('country_tenancy')
                            ->label("Country Tenancy")
                            ->searchable()
                            ->preload()
                            ->options(Country::all()->pluck('name', 'code')),

                        Forms\Components\Select::make('status')
                            ->options([
                                'publish'   => 'Publish',
                                'draft'     => 'Draft',
                                'trash'     => 'Trash',
                            ])
                            ->preload()
                            ->default('draft')
                            ->searchable(),

                    ])->columns(1)
                    ->columnSpan(2),

            ])->columns(5);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('id', 'desc')
            ->recordUrl(null)
            ->columns([

                Tables\Columns\TextColumn::make('name')
                    ->limit(25)
                    ->tooltip(fn($state) => $state)
                    ->url(fn($record) => $record->homepage ?? "#")
                    ->openUrlInNewTab()
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->searchable(
                        query: function ($query, $search) {
                            try {
                                $languages = collect(config('freemoney.languages.keys', ['en']));
                                if ($languages->isEmpty()) {
                                    $languages = collect(['en']);
                                }

                                return $query->where(function ($query) use ($search, $languages) {

                                    foreach ($languages as $lang) {
                                        $query->orWhereRaw("LOWER(JSON_EXTRACT(name, '$.\"{$lang}\"')) LIKE ?", ['%' . strtolower($search) . '%']);
                                    }

                                    $query->orWhere('slug', 'LIKE', '%' . $search . '%');
                                    $query->orWhere('name', 'LIKE', '%' . $search . '%');
                                });
                            } catch (\Exception $e) {

                                return $query->where('name', 'LIKE', '%' . $search . '%')
                                    ->orWhere('slug', 'LIKE', '%' . $search . '%');
                            }
                        }
                    ),

                Tables\Columns\ToggleColumn::make('cashback_enabled')
                    ->label(new HtmlString('<div style="width:75px; text-align:left; white-space:normal;">Cashback<br>Enabled</div>')),

                Tables\Columns\TextColumn::make('cashback_percent')
                    ->numeric()
                    ->searchable()
                    ->label('Cashback Percentage')
                    ->label(new HtmlString('<div style="width:75px; text-align:left; white-space:normal;">Cashback<br>Percentage</div>'))
                    ->sortable(),

                Tables\Columns\ToggleColumn::make('is_featured')
                    ->label('Featured'),

                Tables\Columns\TextColumn::make('visits')
                    ->numeric()
                    ->label('Visits')
                    ->sortable(),

                Tables\Columns\TextColumn::make('clicks')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('network.name')
                    ->label('Network')
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->whereHas('network', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        });
                    }),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),


                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->formatstateUsing(fn(string $state): string => ucwords($state))
                    ->color(fn(string $state): string => match ($state) {
                        'publish' => 'success',
                        'draft'   => 'warning',
                        'trash'   => 'danger',
                        default   => 'gray',
                    })
                    ->alignEnd()

            ])
            ->filters([

                Tables\Filters\SelectFilter::make('network_id')
                    ->label('Network')
                    ->options(AffiliateNetwork::all()->pluck('name', 'id'))
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('cats')
                    ->label('Category')
                    ->options(StoreCategory::all()->pluck('name', 'id'))
                    ->query(function (Builder $query, array $data): Builder {
                        if (isset($data['value']) && !empty($data['value'])) {                           
                            $query->whereJsonContains('cats', $data['value']);                          
                        }
                        return $query;
                    })
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('status')
                    ->options(OfferStatus::class),

                Tables\Filters\SelectFilter::make('country_tenancy')
                    ->options(Country::pluck('name', 'code'))
                    ->searchable()
                    ->preload(),

                Tables\Filters\SelectFilter::make('cashback_type')
                    ->options([
                        'cashback' => 'Cashback',
                        'reward'   => 'Rewards',
                    ])
                    ->searchable()
                    ->preload(),

                Tables\Filters\TernaryFilter::make('is_featured')
                    ->placeholder('All')
                    ->label('Featured'),

                Tables\Filters\TernaryFilter::make('cashback_enabled')
                    ->placeholder('All')
                    ->label('Cashback Enabled'),

                Tables\Filters\TernaryFilter::make('is_claimable')
                    ->placeholder('All')
                    ->label('Is Claimable'),

                // Tables\Filters\TernaryFilter::make('is_shareable')
                //     ->placeholder('All')
                //     ->label('Is Shareable'),

                // Tables\Filters\TernaryFilter::make('is_promoted')
                //     ->placeholder('All')
                //     ->label('Is Promoted'),

                Tables\Filters\TernaryFilter::make('ghost')
                    ->placeholder('All')
                    ->label('Is Ghost'),

                // Tables\Filters\TernaryFilter::make('exclude_sitemap')
                //     ->placeholder('All')
                //     ->label('Exclude From Sitemap'),

                    Tables\Filters\Filter::make('cashback_percent')
                    ->form([
                        Forms\Components\TextInput::make('cashback_percent')
                            ->label('Cashback Percentage')
                            ->prefix('%')
                            ->numeric()
                            ->placeholder("Enter Cashback Percentage"),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query->when(
                            filled($data['cashback_percent']),
                            fn ($q) => $q->where('cashback_percent', $data['cashback_percent'])
                        );
                    })
                    ->indicateUsing(function (array $data): array {
                        if (filled($data['cashback_percent'])) {
                            return ['Cashback is ' . $data['cashback_percent'] . '%'];
                        }
                
                        return [];
                    })
                

            ])
            ->filtersFormColumns(2)
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),
                // Tables\Actions\DeleteAction::make()->label("")->tooltip('Delete')->size("xl"),
                    
            ])
            ->bulkActions([

                Tables\Actions\BulkActionGroup::make([

                    // Tables\Actions\DeleteBulkAction::make(),
                        // ->dd(),

                    ...collect([
                        [
                            'name' => 'cashback_enabled',
                            'label' => 'Set Cashback Enabled',
                            'icon' => 'heroicon-o-check-circle',
                            'value' => 1,
                            'field' => 'cashback_enabled',
                        ],
                        [
                            'name' => 'cashback_disabled',
                            'label' => 'Set Cashback Disabled',
                            'icon' => 'heroicon-o-no-symbol',
                            'value' => 0,
                            'field' => 'cashback_enabled',
                        ],
                        [
                            'name' => 'is_featured',
                            'label' => 'Set As Featured',
                            'icon' => 'heroicon-o-check-badge',
                            'value' => 1,
                            'field' => 'is_featured',
                        ],
                        [
                            'name' => 'is_unfeatured',
                            'label' => 'Set As Unfeatured',
                            'icon' => 'heroicon-o-x-circle',
                            'value' => 0,
                            'field' => 'is_featured',
                        ],
                    ])->map(function ($action) {
                        return Tables\Actions\BulkAction::make($action['name'])
                            ->label($action['label'])
                            ->icon($action['icon'])
                            ->action(function (Collection $records) use ($action) {
                                Store::whereIn('id', $records->pluck('id'))->update([$action['field'] => $action['value']]);
                            })
                            ->deselectRecordsAfterCompletion();
                    })->toArray(),


                ])->label('Bulk Actions'),

                BulkAction::make('change_status')
                    ->label('Change Status')
                    ->modalWidth('lg')
                    ->form([
                        Forms\Components\Select::make('status')
                            ->label('Select Status')
                            ->options([
                                'publish'   => 'Publish',
                                'draft'     => 'Draft',
                                'trash'     => 'Trash',
                            ])
                            ->required(),
                    ])
                    ->action(function (Collection $records, array $data) {
                        Store::whereIn('id', $records->pluck('id'))->update(['status' => $data['status']]);
                    })
                    ->deselectRecordsAfterCompletion()
                    ->button(),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            StoreCashbackRelationManager::class,
        ];
    }
    public static function getPages(): array
    {
        return [
            'index'     => Pages\ListStores::route('/'),
            'create'    => Pages\CreateStore::route('/create'),
            'edit'      => Pages\EditStore::route('/{record}/edit'),
            'view'      => Pages\ViewStore::route('/{record}'),
        ];
    }
}
