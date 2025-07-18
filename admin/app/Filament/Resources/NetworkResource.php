<?php

namespace App\Filament\Resources;

use App\Enums\NetworkType;
use App\Filament\Resources\NetworkResource\Pages;
use App\Filament\Resources\NetworkResource\RelationManagers;
use App\Models\Category;
use App\Models\Country;
use App\Models\Network;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Forms\Form;
use Filament\Forms\FormsComponent;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\QueryBuilder\Constraints\BooleanConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\SelectConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use ValentinMorice\FilamentJsonColumn\JsonColumn;
use Filament\Resources\Concerns\Translatable;

class NetworkResource extends Resource
{
    protected static ?string $model = Network::class;
    protected static ?int $navigationSort = 1;
    protected static ?string $navigationGroup = "Tasks & Survey Management";
    protected static ?string $navigationIcon = 'heroicon-o-server-stack';
    protected static ?string $modelLabel = 'Network';
    use Translatable;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Basic Information')
                    ->columns(2)
                    ->schema([

                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->infotip("Name of the network displayed on the frontend and across the application"),

                        Forms\Components\TextInput::make('code')
                            ->required()
                            ->live(true)
                            ->maxLength(50)
                            ->infotip("This code is used to reference the network across the application internaly."),

                        Forms\Components\Radio::make('render_type')
                            ->name("Surveys Render Type")
                            ->infotip("Wether to open the survey iframe in a popup, new tab or same tab.")
                            ->default('popup')
                            ->options([
                                'popup' => 'Popup',
                                'new_tab' => 'New Tab',
                                'same_tab' => 'Same Tab',
                            ])->inline()->inlineLabel(false),

                        Forms\Components\Radio::make('type')
                            ->infotip("Wether this network is for surveys or tasks.")
                            ->options(NetworkType::class)->inline()->inlineLabel(false)
                            ->live()
                            ->default('tasks')
                            ->required(),

                        Forms\Components\FileUpload::make('icon')
                            ->label('Icon')
                            ->disk('frontend')
                            ->maxSize(2048)
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('This is used on smaller places like tables. Size should be less than 2MB and should jpg, jpeg, png or svg')
                            ->columnSpanFull()
                            ->image(),

                        Forms\Components\FileUpload::make('logo')
                            ->label('Logo')
                            ->disk('frontend')
                            ->maxSize(2048)
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('This is the main logo for network. Size should be less than 2MB and should jpg, jpeg, png or svg')
                            ->columnSpanFull()
                            ->image(),

                        Forms\Components\FileUpload::make('background_image')
                            ->label('Background Image')
                            ->disk('frontend')
                            ->maxSize(2048)
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('This is the background image for provider card. Size should be less than 2MB and should jpg, jpeg, png or svg')
                            ->columnSpanFull()
                            ->image(),

                        Forms\Components\TextInput::make('rating')
                            ->numeric()
                            ->suffixIcon('heroicon-o-star')
                            ->minValue(0.00)
                            ->maxValue(5.00)
                            ->default(0.00),

                        Forms\Components\TextInput::make('cashback_percent')
                            ->label('Cashback Percent')
                            ->numeric()
                            ->suffixIcon('heroicon-o-percent-badge')
                            ->minValue(0.00)
                            ->maxValue(100.00)
                            ->default(0.00),

                        Forms\Components\TextInput::make('sort_order')
                            ->label('Sort Order')
                            ->numeric()
                            ->suffixIcon('heroicon-o-bars-3-bottom-right')                                     
                            ->default(0)
                            ->minValue(0),                            

                        Forms\Components\Toggle::make('task_iframe_only')->inline(),

                        Forms\Components\Toggle::make('open_task_external_browser')
                            ->inline()
                            ->label("Open Offer In External Browser (App)")
                            ->infotip("When enabled, offers open in the external browser. When disabled, offers open in the in-app browser.")
                            ->default(false),

                        Forms\Components\Toggle::make('enabled')->inline(),
                        
                        Forms\Components\Toggle::make('is_featured')->inline(),
                    ]),
                    Section::make('Integration Details')
                    ->schema([
                        Forms\Components\TextInput::make('survey_url')
                            ->activeUrl()
                            ->label('Survey Url')
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('The url to be used for displaying network surveys in iframe. Make sure to add #USER_ID as a macro for replacing appropriate user id.')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->maxLength(255)
                            ->visible(function (\Filament\Forms\Get $get): bool {
                                return $get('type') === 'surveys';
                            })
                            ->default(null),

                        Forms\Components\TextInput::make('offer_url')
                            ->activeUrl()
                            ->label('Offer Url')
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('The url to be used for displaying network offers in iframe. Make sure to add #USER_ID as a macro for replacing appropriate user id.')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->maxLength(255)
                            // ->visible(fn ($record) => !empty($record->offer_url))
                            ->default(null),

                        Forms\Components\TextInput::make('support_url')
                            ->activeUrl()
                            ->label('Support Url')
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('This is the url through which users would be able to reachout to networks directly. These are used to open support ticket links in active tasks. If the network offers only email, add a mailto: before the email. Also add #USER_ID for the macro of User id.')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ]),

                        Forms\Components\Select::make('countries')
                            ->label('Import Countries')
                            ->infotip('Countries selected here will be used when importing offers. Offers that are enabled in the selected countries above will be imported.')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->options(Country::get()->pluck('code', 'code'))
                            ->multiple(),

                        Forms\Components\Select::make('categories')
                            ->label('Import Categories')
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('Categories selected here will be used when importing offers. Offers that have the selected countries above will be imported.')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->options(Category::get()->pluck('name', 'name'))->multiple(),
                    ]),

                Section::make('Integration Secrets')
                    ->schema([
                        Forms\Components\TextInput::make('postback_validation_key')
                            ->label('Postback Validation Key')
                            ->password()
                            ->revealable()
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('This is an internal validation key used by the platform to validate the incomming postback. It is required when sending any postback to the system and should match this value.')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->maxLength(255)
                            ->default(null),

                        Forms\Components\TextInput::make('pub_id')
                            ->password()
                            ->revealable()
                            ->label('Publisher Id')
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('Publisher id specific to the publisher in network dashboard. Varies from network to network. Used in api for offers import.')
                            ->maxLength(255)
                            ->default(null),
                        Forms\Components\TextInput::make('app_id')
                            ->label('Application Id')
                            ->password()
                            ->revealable()
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('Application id specific to the application in network dashboard. Varies from network to network. Used in api for offers import.')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->maxLength(255)
                            ->default(null),
                        Forms\Components\TextInput::make('api_key')
                            ->label('API Key')
                            ->password()
                            ->revealable()
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('API key for importing offers. Varies from network to network. Used in api for offers import.')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->maxLength(255)
                            ->default(null),

                        Forms\Components\TextInput::make('postback_key')
                            ->label('Postback Secret')
                            ->password()
                            ->revealable()
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('Postback Secret is used to validate the postback from the networks side. Network hash the content of the postback params sent to the system and this key is used to validate that hash. Can be found in network dashboard. Varies from netowrk to network.')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->maxLength(255)
                            ->columnSpanFull()
                            ->default(null),

                        JsonColumn::make('config_params')
                            ->label('Config Parameters')
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('Additional configuration parameters required for integration can be configured here.')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->editorOnly()
                            ->columnSpanFull(),
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->formatStateUsing(fn (string $state): string => ucwords($state))
                    ->searchable(),
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->searchable(),
                Tables\Columns\ImageColumn::make('logo')
                    ->label('icon'),
                Tables\Columns\ToggleColumn::make('enabled'),
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
                Tables\Filters\SelectFilter::make('type')
                    ->native(false)
                    ->label(__('Network Type'))
                    ->options(NetworkType::class),
                Tables\Filters\TernaryFilter::make('enabled')
                    ->native(false),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("xl"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNetworks::route('/'),
            'create' => Pages\CreateNetwork::route('/create'),
            'edit' => Pages\EditNetwork::route('/{record}/edit'),
        ];
    }
}
