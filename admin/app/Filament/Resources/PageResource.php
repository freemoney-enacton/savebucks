<?php

namespace App\Filament\Resources;

use App\BuilderBlocks;
use App\Enums\ContentStatus;
use App\Filament\Resources\PageResource\Pages\CreatePage;
use App\Filament\Resources\PageResource\Pages\EditPage;
use App\Filament\Resources\PageResource\Pages\ListPages;
use App\Models\Page;
use Closure;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Notifications\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Unique;
use Filament\Resources\Concerns\Translatable;
use Filament\Support\Enums\IconPosition;
use Illuminate\Support\Facades\Http;

class PageResource extends Resource
{
    use Translatable;

    protected static ?string $model = Page::class;

    protected static ?int $navigationSort = 5;
    protected static ?string $navigationGroup = "CMS";
    protected static ?string $navigationLabel = 'Pages';
    protected static ?string $navigationIcon = 'heroicon-o-document';
    protected static ?string $modelLabel = 'Pages';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make("General Details")
                    ->columns(2)
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required(),

                        Forms\Components\TextInput::make('title')
                            ->afterStateUpdated(function (Get $get, Set $set, ?string $state, ?Page $record) {
                                if (!$get('is_slug_changed_manually') && filled($state) && blank($record)) {
                                    $set('slug', Str::slug($state, language: config('app.locale', 'en')));
                                }
                            })
                            ->debounce('500ms')
                            ->required(),

                        Forms\Components\Hidden::make('is_slug_changed_manually')
                            ->default(false)
                            ->dehydrated(false),

                        Forms\Components\TextInput::make('slug')
                            ->unique(ignoreRecord: true, modifyRuleUsing: fn(Unique $rule, Get $get) => $rule->where('parent_id', $get('parent_id')))
                            ->afterStateUpdated(function (Set $set) {
                                $set('is_slug_changed_manually', true);
                            })
                            ->rule(function ($state) {
                                return function (string $attribute, $value, Closure $fail) use ($state) {
                                    if ($state !== '/' && (Str::startsWith($value, '/') || Str::endsWith($value, '/'))) {
                                        $fail(__('filament-fabricator::page-resource.errors.slug_starts_or_ends_with_slash'));
                                    }
                                };
                            })
                            ->disabledOn('edit'),

                        Forms\Components\Radio::make('status')
                            ->default('draft')
                            ->required()
                            ->options(ContentStatus::class)
                            ->inline()
                            ->inlineLabel(false),

                        Forms\Components\TextInput::make('meta_title')
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('meta_desc')
                            ->columnSpanFull(),

                        Forms\Components\Toggle::make('exclude_seo')
                            ->label('Exclude SEO')
                            ->default(false),

                        Forms\Components\Select::make('parent_slug')
                            ->searchable()
                            ->visible(false)
                            ->preload()
                            ->reactive()
                            ->suffixAction(
                                fn($get, $context) => Forms\Components\Actions\Action::make($context . '-parent')
                                    ->icon('heroicon-o-arrow-top-right-on-square')
                                    ->url(fn() => PageResource::getUrl($context, ['record' => $get('parent_slug')]))
                                    ->openUrlInNewTab()
                                    ->visible(fn() => filled($get('parent_slug')))
                            )
                            ->relationship(
                                'parent',
                                'title',
                                function (Builder $query, ?Page $record) {
                                    if (filled($record)) {
                                        $query->where('id', '!=', $record->id);
                                    }
                                }
                            ),
                    ]),

                Forms\Components\Section::make("Content")
                    ->schema([
                        Forms\Components\Builder::make('blocks')
                            ->hiddenLabel()
                            ->blockNumbers(false)
                            ->blockPickerColumns(3)
                            ->collapsible()
                            ->blocks([
                                Forms\Components\Builder\Block::make('myheading')
                                    ->schema(BuilderBlocks::myheading())
                                    ->columns(2),

                                Forms\Components\Builder\Block::make('hero-section-with-login')
                                    ->schema(BuilderBlocks::heroSectionWithLogin())
                                    ->columns(1),

                                Forms\Components\Builder\Block::make('left-content-right-image')
                                    ->schema(BuilderBlocks::leftContentRightImage())
                                    ->columns(1),

                                Forms\Components\Builder\Block::make('heading')
                                    ->schema(BuilderBlocks::heading())
                                    ->columns(2),

                                Forms\Components\Builder\Block::make('hero-section-with-mini-stats')
                                    ->schema(BuilderBlocks::heroSectionWithMiniStats())
                                    ->columns(2),

                                Forms\Components\Builder\Block::make('auth-tab-section-with-images')
                                    ->schema(BuilderBlocks::authTabSectionWithImages())
                                    ->columns(2),

                                Forms\Components\Builder\Block::make('partner-section')
                                    ->schema(BuilderBlocks::partnerSection())
                                    ->columns(1),

                                Forms\Components\Builder\Block::make('hiw-repeater-section')
                                    ->schema(BuilderBlocks::hiwRepeaterSection())
                                    ->columns(1),

                                Forms\Components\Builder\Block::make('info-cards-section')
                                    ->schema(BuilderBlocks::InfoCardsSection())
                                    ->columns(1),

                                Forms\Components\Builder\Block::make('button-component')
                                    ->schema(BuilderBlocks::buttonComponent())
                                    ->columns(2),

                                Forms\Components\Builder\Block::make('stats-mini-without-icons')
                                    ->label('Stats Mini Without Icons')
                                    ->schema(BuilderBlocks::statsMiniWithoutIcons()),

                                Forms\Components\Builder\Block::make('survey-partners')
                                    ->schema(BuilderBlocks::surveyPartners()),

                                Forms\Components\Builder\Block::make('offer-partners')
                                    ->schema(BuilderBlocks::offerPartners()),

                                Forms\Components\Builder\Block::make('recommended-offers')
                                    ->schema(BuilderBlocks::recommendedOffers()),

                                Forms\Components\Builder\Block::make('featured-offers')
                                    ->schema(BuilderBlocks::featuredOffers()),

                                Forms\Components\Builder\Block::make('vip-offers')
                                    ->schema(BuilderBlocks::vipOffers()),

                                // Forms\Components\Builder\Block::make('featured-stores')
                                //     ->schema(BuilderBlocks::featuredStores()),

                                Forms\Components\Builder\Block::make('contact-us-form')
                                    ->schema(BuilderBlocks::contactUsForm()),

                                Forms\Components\Builder\Block::make('business-inquiry-form')
                                    ->schema(BuilderBlocks::businessInquiryForm()),

                                Forms\Components\Builder\Block::make('login-component')
                                    ->schema(BuilderBlocks::loginComponent()),

                                Forms\Components\Builder\Block::make('stats-col-with-icons')
                                    ->label('Stats Col With Icons')
                                    ->schema(BuilderBlocks::statsColWithIcons()),

                                Forms\Components\Builder\Block::make('info-box-col')
                                    ->label('Info Box Col')
                                    ->schema(BuilderBlocks::infoBoxCol()),

                                Forms\Components\Builder\Block::make('hiw-cards-with-left-image')
                                    ->label('How It Works Cards With Left Image')
                                    ->schema(BuilderBlocks::howItWorksCardsWithLeftImage()),

                                Forms\Components\Builder\Block::make('info-box-with-cta')
                                    ->label('Info Box With CTA')
                                    ->schema(BuilderBlocks::infoBoxWithCTA())
                                    ->columns(2),

                                Forms\Components\Builder\Block::make('review-component')
                                    ->label('Review Component')
                                    ->schema(BuilderBlocks::reviewComponent())
                                    ->columns(2),

                                Forms\Components\Builder\Block::make('faqs-component')
                                    ->label('FAQs Component')
                                    ->schema(BuilderBlocks::faqsComponent()),

                                Forms\Components\Builder\Block::make('sign-up-cta')
                                    ->label('Sign Up CTA')
                                    ->schema(BuilderBlocks::signUpCta()),

                                Forms\Components\Builder\Block::make('testimonials')
                                    ->label('Testimonials')
                                    ->schema(BuilderBlocks::testimonials())
                                    ->columns(2),

                                Forms\Components\Builder\Block::make('info-box-with-bg-image-and-cta')
                                    ->label('Info Box With CTA')
                                    ->schema(BuilderBlocks::infoBoxWithBgImageAndCTA()),

                                Forms\Components\Builder\Block::make('sign-up-cta-with-bg-image')
                                    ->label('Sign Up CTA With Background Image')
                                    ->schema(BuilderBlocks::signUpCtaWithBgImage()),

                                Forms\Components\Builder\Block::make('hero-section-with-image')
                                    ->label('Hero Section With Image')
                                    ->schema(BuilderBlocks::heroSectionWithImage()),
                                Forms\Components\Builder\Block::make('hero-section-with-right-image')
                                    ->label('Hero Section With Right Image')
                                    ->schema(BuilderBlocks::heroSectionWithImage()),

                                Forms\Components\Builder\Block::make('payment-options')
                                    ->label('Payment Options')
                                    ->schema(BuilderBlocks::paymentOptions()),

                                Forms\Components\Builder\Block::make('how-it-works-wothout-image')
                                    ->label('How It Works Without Image')
                                    ->schema(BuilderBlocks::howItWorksWithoutImage()),

                                Forms\Components\Builder\Block::make('teams-and-conditions')
                                    ->label('Teams And Conditions')
                                    ->schema(BuilderBlocks::teamsAndConditions()),

                                Forms\Components\Builder\Block::make('rich-editor')
                                    ->label('Rich Editor')
                                    ->schema(BuilderBlocks::richTextEditor()),

                                Forms\Components\Builder\Block::make('top-stores')
                                    ->label('Top Stores')
                                    ->schema(BuilderBlocks::topStores()),
                            ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('slug')
                    ->searchable()
                    ->url(fn($record): string => (config('app.web_url') . '/' . $record->slug))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->iconPosition(IconPosition::After)
                    ->openUrlInNewTab(),

                Tables\Columns\TextColumn::make('status')
                    ->badge(),

                Tables\Columns\ToggleColumn::make('exclude_seo'),

                Tables\Columns\TextColumn::make('parent.title')
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->formatStateUsing(fn($state) => $state ?? '-')
                    ->url(fn(?Page $record) => filled($record->parent_slug) ? PageResource::getUrl('edit', ['record' => $record->parent_slug]) : null),
            ])
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
            ])
            ->bulkActions([]);
    }

    protected function afterSave(): void
    {
        $response = Http::get('https://freemoney-api.enactweb.com/api/v1/cache/pages');
        if (json_decode($response)->success == true) {
            Notification::make()
                ->success()
                ->title('Page cache cleared successfully')
                ->send();
        }
    }

    public static function getPages(): array
    {
        return array_filter([
            'index' => ListPages::route('/'),
            'create' => CreatePage::route('/create'),
            'edit' => EditPage::route('/{record}/edit'),
        ]);
    }
}
