<?php

namespace App;

use App\Forms\Components\CustomImageUpload;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use App\Models\Store;
// use Filament\Forms\Components\FileUpload;


use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\BaseFileUpload;
use Filament\Forms\Components\Select;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BuilderBlocks
{
    static $cardStyles = [
        'small' => "Small",
        'large_with_banner' => "Large with banner image"
    ];

    public static function myheading(): array
    {
        return [
            TextInput::make('mytitle')
                ->name('title')
                ->maxLength(500)
                ->required(),

            TextInput::make('mysub_title')
                ->maxLength(500)
                ->name('sub_title'),

            CustomImageUpload::make('myimage')
                ->disk('frontend')
                ->name('image')
                ->acceptedFileTypes(['image/*', 'application/json'])
                ->columnSpanFull(),

            Select::make('style')
                ->options([
                    'style1' => 'Style 1',
                    'style2' => 'Style 2',
                    'style3' => 'Style 3',
                ]),

            Textarea::make('mydescription_html')
                ->maxLength(5000),

            RichEditor::make('myrich_description')
                ->maxLength(5000)
                ->columnSpanFull()
                ->name('description'),

            DatePicker::make('my_date')
                ->maxDate(now()),

            Checkbox::make('my_is_admin'),

            CheckboxList::make('technologies')
                ->options([
                    'tailwind' => 'Tailwind CSS',
                    'alpine' => 'Alpine.js',
                    'laravel' => 'Laravel',
                    'livewire' => 'Laravel Livewire',
                ]),

            Radio::make('status')
                ->options([
                    'draft' => 'Draft',
                    'scheduled' => 'Scheduled',
                    'published' => 'Published'
                ]),

            Toggle::make('my_is_admin_2'),

            Repeater::make('myitems')
                ->columnSpanFull()
                ->schema([
                    TextInput::make('item_title')
                        ->maxLength(150),
                    TextInput::make('item_value')
                        ->maxLength(10),
                    Select::make('item_style')
                        ->options([
                            'item_style_1' => 'Item Style 1',
                            'item_style_2' => 'Item Style 2',
                            'item_style_3' => 'Item Style 3',
                        ]),
                ]),
        ];
    }

    public static function heroSectionWithLogin(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(150)
                ->name('title')
                ->required(),

            TextInput::make('sub_title')
                ->maxLength(150)
                ->name('sub_title'),

            CustomImageUpload::make('left_bg_image')
                ->disk('frontend')
                ->name('left_bg_image')
                ->helperText('dimension: 2676 × 1232')
                ->acceptedFileTypes(['image/*', 'application/json']),

            CustomImageUpload::make('right_bg_image')
                ->disk('frontend')
                ->name('right_bg_image')
                ->helperText('dimension: 957 × 786')
                ->acceptedFileTypes(['image/*', 'application/json']),

            CustomImageUpload::make('image')
                ->disk('frontend')
                ->name('image')
                ->acceptedFileTypes(['image/*', 'application/json']),

            Repeater::make('myitems')
                ->maxItems(4)
                ->columns()
                ->schema([
                    TextInput::make('item_title')
                        ->maxLength(150),
                    CustomImageUpload::make('image')
                        ->disk('frontend')
                        ->name('image')
                        ->acceptedFileTypes(['image/*', 'application/json']),
                ]),
        ];
    }

    public static function heroSectionWithBackground(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(150)
                ->name('title')
                ->required(),

            CustomImageUpload::make('bg_image')
                ->disk('frontend')
                ->name('bg_image')
                // ->helperText('dimension: 2676 × 1232')    
                ->acceptedFileTypes(['image/*', 'application/json']),

            CustomImageUpload::make('image')
                ->disk('frontend')
                ->name('image')
                ->acceptedFileTypes(['image/*', 'application/json']),

            Repeater::make('myitems')
                ->maxItems(3)
                ->columns()
                ->schema([
                    TextInput::make('label')
                        ->maxLength(150),
                ]),

            TextInput::make('button_text')
                ->maxLength(60),

            TextInput::make('button_link')
                ->maxLength(60),

            TextInput::make('button_text_2')
                ->maxLength(60),

            TextInput::make('button_link_2')
                ->maxLength(60),
        ];
    }

    public static function partnersCtaSection(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(150)
                ->name('title')
                ->required(),

            Repeater::make('myitems')
                ->maxItems(20)
                ->columns()
                ->schema([
                    TextInput::make('label')
                        ->maxLength(150),

                    CustomImageUpload::make('image')
                        ->disk('frontend')
                        ->name('image')
                        ->acceptedFileTypes(['image/*', 'application/json']),
                ]),
        ];
    }


    public static function leftContentRightImage(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(150)
                ->name('title')
                ->required(),

            Textarea::make('description_1')
                ->maxLength(500)
                ->name('description_1'),

            Textarea::make('description_2')
                ->maxLength(500)
                ->name('description_2'),

            CustomImageUpload::make('image')
                ->disk('frontend')
                ->name('image')
                ->acceptedFileTypes(['image/*', 'application/json']),

            TextInput::make('button_text')
                ->maxLength(60),

            TextInput::make('button_link')
                ->url(),
        ];
    }

    public static function heading(): array
    {
        return [
            TextInput::make('title')
                ->name('title')
                ->maxLength(500)
                ->required(),

            TextInput::make('sub_title')
                ->maxLength(500)
                ->name('sub_title')
        ];
    }

    public static function heroSectionWithImage(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(150)
                ->name('title')
                ->required(),

            TextInput::make('sub_title')
                ->maxLength(150)
                ->name('sub_title'),

            CustomImageUpload::make('image')
                ->disk('frontend')
                ->name('image')
                ->acceptedFileTypes(['image/*', 'application/json']),

            TextInput::make('button_text')
                ->maxLength(60),

            TextInput::make('button_link')
                ->url(),
        ];
    }
    public static function heroSectionWithMediaImage(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(150)
                ->name('title')
                ->required(),

            TextInput::make('sub_title')
                ->maxLength(150)
                ->name('sub_title'),

            CustomImageUpload::make('image')
                ->directory('block-images')
                ->disk('frontend'),

            TextInput::make('button_text')
                ->maxLength(60),

            TextInput::make('button_link')
                ->url(),
        ];
    }


    public static function statsMiniWithoutIcons(): array
    {
        return [
            Repeater::make('items')
                ->columns()
                ->grid()
                ->schema([
                    TextInput::make('title')
                        ->maxLength(150),
                    TextInput::make('value')
                        ->maxLength(10),
                ]),
        ];
    }

    public static function surveyPartners(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(150)
                ->name('title')
                ->required(),

            // FileUpload::make('icon_image')
            //     ->label(__("Icon"))
            //     ->name('icon_image')
            //     ->columnSpanFull()
            //     ->columnSpan(1)
            //     ->disk("frontend")
            //     ->visibility("public")
            //     ->acceptedFileTypes(['image/*', 'application/json'])
            //     ->helperText(__("Upload the icon image file for display. The ideal icon size is 80px width X 80px height")),

            CustomImageUpload::make('icon_image')
                ->label(__("Icon"))
                ->disk('frontend')                                     
                ->helperText(__("Upload the icon image file for display. The ideal icon size is 80px width X 80px height"))
                ->acceptedFileTypes(['image/*', 'application/json']),

            
        ];
    }

    public static function offerPartners(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(150)
                ->name('title')
                ->required(),
            Select::make('style')
            ->options([
                'all_providers' => "All providers",
                'iframe_providers' => "iFrame providers",
            ]),
            // FileUpload::make('icon_image')
            //     ->label(__("Title Icon"))
            //     ->name('icon_image')
            //     ->columnSpanFull()
            //     ->columnSpan(1)
            //     ->disk("frontend")
            //     ->visibility("public")
            //     ->acceptedFileTypes(['image/*', 'application/json'])
            //     ->helperText(__("Upload the icon image file for display. The ideal icon size is 80px width X 80px height")),

            CustomImageUpload::make('icon_image')
            ->label(__("Title Icon"))
            ->disk('frontend')                                     
            ->acceptedFileTypes(['image/*', 'application/json'])
            ->helperText(__("Upload the icon image file for display. The ideal icon size is 80px width X 80px height")),
         
        ];
    }

    public static function recommendedOffers(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),
            Select::make('style')
                ->options(static::$cardStyles),
            // FileUpload::make('icon_image')
            //     ->label(__("Title Icon"))
            //     ->name('icon_image')
            //     ->columnSpanFull()
            //     ->columnSpan(1)
            //     ->disk("frontend")
            //     ->visibility("public")
            //     ->acceptedFileTypes(['image/*', 'application/json'])
            //     ->helperText(__("Upload the icon image file for display. The ideal icon size is 80px width X 80px height")),                
            CustomImageUpload::make('icon_image')
            ->label(__("Title Icon"))
            ->disk('frontend')                                     
            ->acceptedFileTypes(['image/*', 'application/json'])
            ->helperText(__("Upload the icon image file for display. The ideal icon size is 80px width X 80px height")),
        ];
    }

    public static function vipOffers(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),
            Select::make('style')
                ->options( [
                    'small' => "Small",
                    'large_with_banner' => "Large with banner image",
                    'revenue_universe_featured_offers' => "Revenue Universe Featured Offers"
                ]),

            // FileUpload::make('icon_image')
            //     ->label(__("Title Icon"))
            //     ->name('icon_image')
            //     ->columnSpanFull()
            //     ->columnSpan(1)
            //     ->disk("frontend")
            //     ->visibility("public")
            //     ->acceptedFileTypes(['image/*', 'application/json'])
            //     ->helperText(__("Upload the icon image file for display. The ideal icon size is 80px width X 80px height")),

            CustomImageUpload::make('icon_image')
                ->label(__("Title Icon"))
                ->disk('frontend')                                     
                ->acceptedFileTypes(['image/*', 'application/json'])
                ->helperText(__("Upload the icon image file for display. The ideal icon size is 80px width X 80px height")),
            
        ];
    }

    public static function featuredOffers(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),
            Select::make('style')
                ->searchable()
                ->required()
                ->preload()
                ->options(static::$cardStyles),
            // FileUpload::make('icon_image')
            //     ->label(__("Title Icon"))
            //     ->name('icon_image')
            //     ->columnSpanFull()
            //     ->columnSpan(1)
            //     ->disk("frontend")
            //     ->visibility("public")
            //     ->acceptedFileTypes(['image/*', 'application/json'])
            //     ->helperText(__("Upload the icon image file for display. The ideal icon size is 80px width X 80px height")),
            CustomImageUpload::make('icon_image')
                ->label(__("Title Icon"))
                ->disk('frontend')                                     
                ->acceptedFileTypes(['image/*', 'application/json'])
                ->helperText(__("Upload the icon image file for display. The ideal icon size is 80px width X 80px height")),
        ];
    }

    public static function contactUsForm(): array
    {
        return [];
    }

    public static function businessInquiryForm(): array
    {
        return [];
    }

    public static function loginComponent(): array
    {
        return [];
    }

    public static function statsColWithMediaIcons(): array
    {
        return [
            Repeater::make('items')
                ->maxItems(3)
                ->columns()
                ->schema([
                    TextInput::make('title')
                        ->maxLength(150)
                        ->name('title'),

                    Textarea::make('description')
                        ->maxLength(500),

                    CustomImageUpload::make('image')
                        ->label(__("Custom Image"))
                        ->columnSpanFull()
                        ->helperText(__("Upload the banner image file for display. The ideal banner size is 1216px width X 150 to 300px height")),

                ]),
        ];
    }

    public static function statsColWithIcons(): array
    {
        return [
            Select::make('item_style')
                ->options([
                    'style_1' => 'Style 1',
                    'style_2' => 'Style 2',
                ])
                ->default('style_1'),

            Repeater::make('items')
                ->maxItems(3)
                ->columns()
                ->schema([

                    TextInput::make('title')
                        ->maxLength(150)
                        ->name('title'),

                    Textarea::make('description')
                        ->maxLength(500),

                    CustomImageUpload::make('image')
                        ->disk('frontend')
                        ->label(__("Custom Image"))
                        ->columnSpanFull()
                        ->acceptedFileTypes(['image/*', 'application/json'])
                        ->helperText(__("Upload the banner image file for display. The ideal banner size is 1216px width X 150 to 300px height")),

                    // FileUpload::make('image')
                    //     ->label(__("Custom Image"))
                    //     ->columnSpanFull()
                    //     ->columnSpan(1)
                    //     ->disk("frontend")
                    //     ->visibility("public")
                    //     ->acceptedFileTypes(['image/*', 'application/json'])
                    //     ->helperText(__("Upload the banner image file for display. The ideal banner size is 1216px width X 150 to 300px height"))

                ]),
        ];
    }

    public static function heroSectionWithMiniStats(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),

            CustomImageUpload::make('image')
                ->disk('frontend')
                ->name('image')
                ->acceptedFileTypes(['image/*', 'application/json']),

            Repeater::make('items')
                ->columns()
                ->schema([
                    TextInput::make('name')
                        ->maxLength(50),

                    TextInput::make('value')
                        ->maxLength(20),
                ]),
        ];
    }

    public static function authTabSectionWithImages(): array
    {
        return [
            Repeater::make('myitems')
                ->columns(2)
                ->columnSpanFull()
                ->maxItems(3)
                ->schema([
                    CustomImageUpload::make('image')
                        ->disk('frontend')
                        ->name('image')
                        ->acceptedFileTypes(['image/*', 'application/json']),

                    TextInput::make('link')
                        ->maxLength(500)
                        ->url(),
    
                ]),

            TextInput::make('play_store_link')
                ->maxLength(500),

            CustomImageUpload::make('play_store_image')
                ->disk('frontend')
                ->name('play_store_image')
                ->acceptedFileTypes(['image/*', 'application/json']),

            TextInput::make('app_store_link')
                ->maxLength(500),

            CustomImageUpload::make('app_store_image')
                ->disk('frontend')
                ->name('app_store_image')
                ->acceptedFileTypes(['image/*', 'application/json']),

            RichEditor::make('description')
                ->maxLength(5000)
                ->columnSpanFull()
                ->name('description'),

        ];
    }

    public static function partnerSection(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),

            Repeater::make('items')
                ->schema([
                    CustomImageUpload::make('image')
                        ->disk('frontend')
                        ->name('image')
                        ->acceptedFileTypes(['image/*', 'application/json']),
                ]),
        ];
    }

    public static function InfoCardsSection(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),

            Repeater::make('items')
                ->schema([
                    TextInput::make('title')
                        ->maxLength(500),
                    TextInput::make('featured_text')
                        ->maxLength(500),
                    TextInput::make('description')
                        ->maxLength(500),
                    RichEditor::make('rich_description')
                        ->maxLength(5000)
                        ->columnSpanFull()
                        ->name('rich_description'),
                    CustomImageUpload::make('image')
                        ->disk('frontend')
                        ->name('image')
                        ->acceptedFileTypes(['image/*', 'application/json']),
                ]),
        ];
    }

    public static function hiwRepeaterSection(): array
    {
        return [
            Repeater::make('items')
                ->schema([
                    TextInput::make('title')
                        ->maxLength(500),
                    RichEditor::make('description')
                        ->maxLength(5000)
                        ->columnSpanFull()
                        ->name('description'),

                    // FileUpload::make('icon_image')
                    //     ->label(__("Icon"))
                    //     ->name('icon_image')
                    //     ->columnSpanFull()
                    //     ->columnSpan(1)
                    //     ->disk("frontend")
                    //     ->visibility("public")
                    //     ->acceptedFileTypes(['image/*', 'application/json'])
                    //     ->helperText(__("Upload the icon image file for display. The ideal icon size is 80px width X 80px height")),

                    CustomImageUpload::make('icon_image')
                        ->label(__("Icon"))
                        ->disk('frontend')                       
                        ->helperText(__("Upload the icon image file for display. The ideal icon size is 80px width X 80px height"))
                        ->acceptedFileTypes(['image/*', 'application/json']),

                    CustomImageUpload::make('image')
                        ->label(__("Image"))
                        ->disk('frontend')                       
                        ->acceptedFileTypes(['image/*', 'application/json']),

                    // FileUpload::make('image')
                    //     ->label(__("Image"))
                    //     ->name('image')
                    //     ->columnSpanFull()
                    //     ->columnSpan(1)
                    //     ->disk("frontend")
                    //     ->visibility("public")
                    //     ->acceptedFileTypes(['image/*', 'application/json']),
                      
                ]),
        ];
    }

    public static function buttonComponent(): array
    {
        return [
            TextInput::make('label')
                ->maxLength(500),

            TextInput::make('link')
                ->maxLength(500),
        ];
    }

/*************  ✨ Windsurf Command ⭐  *************/
    /**
/*******  3949edce-bcdb-49d5-8af2-660a17bd90f8  *******/    public static function infoBoxCol(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),

            Repeater::make('items')
                ->columns()
                ->schema([
                    CustomImageUpload::make('image')
                        ->disk('frontend')
                        ->name('image')
                        ->acceptedFileTypes(['image/*', 'application/json']),

                    TextInput::make('title')
                        ->maxLength(500)
                        ->name('title'),

                    RichEditor::make('description')
                        ->maxLength(5000)
                        ->columnSpanFull()
                        ->name('description'),
                ]),
        ];
    }

    public static function hiwCardsWithIframe(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),

            TextInput::make('iframe_url')
                ->maxLength(500),

            Repeater::make('items')
                ->schema([
                    CustomImageUpload::make('image')
                        ->disk('frontend')
                        ->name('image')
                        ->acceptedFileTypes(['image/*', 'application/json']),

                    TextInput::make('title')
                        ->maxLength(500),

                    RichEditor::make('content')
                        ->maxLength(1500),
                ]),
        ];
    }

    public static function howItWorksCardsWithLeftImage(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),

            CustomImageUpload::make('image')
                ->disk('frontend')
                ->name('image')
                ->acceptedFileTypes(['image/*', 'application/json']),

            Select::make('item_style')
                ->options([
                    'item_style_1' => 'Item Style 1',
                    'item_style_2' => 'Item Style 2',
                ])
                ->default('item_style_1'),

            Repeater::make('items')
                ->schema([
                    CustomImageUpload::make('image')
                        ->disk('frontend')
                        ->name('image')
                        ->acceptedFileTypes(['image/*', 'application/json']),

                    TextInput::make('title')
                        ->maxLength(500),

                    RichEditor::make('content')
                        ->maxLength(1500),
                ]),
        ];
    }

    public static function providerPartnerSection(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),

            TextInput::make('sub_title')
                ->maxLength(500),

            CustomImageUpload::make('subtitle_icon_image')
                ->disk('frontend')
                ->name('image')
                ->acceptedFileTypes(['image/*', 'application/json']),

            Repeater::make('items')
                ->columnSpanFull()
                ->grid()
                ->schema([
                    CustomImageUpload::make('image')
                        ->disk('frontend')
                        ->name('image')
                        ->acceptedFileTypes(['image/*', 'application/json']),
                ]),
        ];
    }

    public static function topStores(): array
    {
        return [

            Grid::make()->schema([

                Section::make()->schema([

                    TextInput::make('title')
                        ->label('Title')
                        ->nullable()
                        ->minLength(2)
                        ->maxLength(255)
                        ->placeholder('Enter title here'),

                    Textarea::make('description')
                        ->nullable()
                        ->minLength(5)
                        ->maxLength(255)
                        ->placeholder('Enter short description 5 to 255 letters')
                        ->rows(2),

                    // FileUpload::make('icon_image')
                    //     ->label(__("Title Icon"))
                    //     ->name('icon_image')
                    //     ->columnSpanFull()
                    //     ->columnSpan(1)
                    //     ->disk("frontend")
                    //     ->visibility("public")
                    //     ->preserveFilenames() 
                    //     // ->getUploadedFileNameUsing(function ($file) {
                    //     //     return $file->getClientOriginalName();
                    //     // })
                    //     ->acceptedFileTypes(['image/*', 'application/json']),
                       

                    CustomImageUpload::make('icon_image')
                        ->label(__("Title Icon"))
                        ->disk('frontend')                                      
                        ->name('image')
                        ->helperText(__("Upload the icon image file for display. The ideal icon size is 80px width X 80px height"))
                        ->acceptedFileTypes(['image/*', 'application/json']),

                    Select::make('store_listing_logic')
                        ->label('Store Listing Logic')
                        ->required()
                        ->options([
                            'popular'       => 'Popular',
                            'latest'        => 'Latest',
                            'featured'      => 'Featured',
                            'hand_picked'   => 'Hand Picked',
                        ])
                        ->preload()
                        ->searchable()
                        ->live(),

                    Select::make('stores')
                        ->label('Store')
                        ->options(Store::where('status', 'publish')->pluck('name', 'id'))
                        ->preload()
                        ->searchable()
                        ->live()
                        ->multiple()
                        ->required(fn($get) => $get('store_listing_logic') === 'hand_picked')
                        ->hidden(fn($get) => $get('store_listing_logic') !== 'hand_picked'),

                    TextInput::make('count')
                        ->label('Count')
                        ->nullable()
                        ->numeric()
                        ->minValue(1)
                        ->maxValue(100)
                        ->placeholder('Enter store count to display'),

                    Select::make('style')
                        ->label('Style')
                        ->nullable()
                        ->default('simple_grid_view')
                        ->options([
                            'simple_grid_view'  => 'Simple Grid View',
                        ])
                        ->preload()
                        ->searchable(),

                ])->columnSpan(1)

            ])->columns(2)

        ];
    }

    public static function linkCardSection(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),

            Repeater::make('items')
                ->columnSpanFull()
                ->grid()
                ->schema([
                    TextInput::make('title')
                        ->maxLength(500),

                    TextInput::make('link')
                        ->maxLength(500),

                    RichEditor::make('description')
                        ->maxLength(500),

                    CustomImageUpload::make('background_image')
                        ->disk('frontend')
                        ->name('background_image')
                        ->acceptedFileTypes(['image/*', 'application/json']),
                ]),
        ];
    }

    public static function infoBoxWithCTA(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),
            TextInput::make('sub_title')
                ->maxLength(500),
            TextInput::make('button_text')
                ->maxLength(60),
            TextInput::make('button_link'),
            Repeater::make('items')
                ->columnSpanFull()
                ->grid()
                ->schema([
                    TextInput::make('title')
                        ->maxLength(500),

                    RichEditor::make('content')
                        ->maxLength(500),

                    CustomImageUpload::make('image')
                        ->disk('frontend')
                        ->name('image')
                        ->acceptedFileTypes(['image/*', 'application/json']),
                ]),
        ];
    }

    public static function reviewComponent(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),

            TextInput::make('sub_title')
                ->maxLength(500),

            CustomImageUpload::make('image')
                ->disk('frontend')
                ->name('image')
                ->acceptedFileTypes(['image/*', 'application/json']),

            TextInput::make('button_text')
                ->maxLength(60),

            TextInput::make('button_link')
                ->url(),

            Select::make('style')
                ->options([
                    'style1' => 'Style 1',
                ])
                ->default('item_style_1'),


            Repeater::make('items')
                ->columnSpanFull()
                ->grid()
                ->schema([
                    TextInput::make('title')
                        ->maxLength(500),

                    Textarea::make('description')
                        ->maxLength(500),

                    TextInput::make('rating')
                        ->numeric()
                        ->minValue(0)
                        ->maxValue(5),

                    CustomImageUpload::make('image')
                        ->disk('frontend')
                        ->name('image')
                        ->acceptedFileTypes(['image/*', 'application/json']),

                    TextInput::make('user_name'),

                    DatePicker::make('date')
                        ->maxDate(now()),
                ]),
        ];
    }

    public static function faqsComponent(): array
    {
        return [
            TextInput::make('title'),
        ];
    }

    public static function signUpCta(): array
    {
        return [];
    }

    public static function testimonials(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),

            Repeater::make('items')
                ->schema([
                    TextInput::make('name')
                        ->required()
                        ->name('name')
                        ->maxLength(500),

                    TextInput::make('sequence')
                        ->required()
                        ->maxLength(3),

                    TextInput::make('profession')
                        ->required()
                        ->maxLength(25),

                    Textarea::make('feedback')
                        ->required()
                        ->maxLength(500),
                ])
        ];
    }

    public static function infoBoxWithBgImageAndCTA(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),

            TextInput::make('button_text')
                ->maxLength(500),

            TextInput::make('button_link'),

            CustomImageUpload::make('image')
                ->disk('frontend')
                ->name('image')
                ->acceptedFileTypes(['image/*', 'application/json']),

            Repeater::make('items')
                ->schema([
                    TextInput::make('title')
                        ->maxLength(500),

                    RichEditor::make('content')
                        ->maxLength(500),

                    CustomImageUpload::make('image')
                        ->disk('frontend')
                        ->name('image')
                        ->acceptedFileTypes(['image/*', 'application/json']),
                ]),
        ];
    }

    public static function signUpCtaWithBgImage(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),

            RichEditor::make('description')
                ->maxLength(500),

            CustomImageUpload::make('image')
                ->disk('frontend')
                ->name('image')
                ->acceptedFileTypes(['image/*', 'application/json']),

            TextInput::make('button_text')
                ->maxLength(500),
        ];
    }

    public static function paymentOptions(): array
    {
        return [];
    }

    public static function howItWorksWithoutImage(): array
    {
        return [
            Repeater::make('items')
                ->schema([
                    TextInput::make('title')
                        ->maxLength(500),

                    Textarea::make('content')
                        ->maxLength(500),

                    CustomImageUpload::make('image')
                        ->disk('frontend')
                        ->acceptedFileTypes(['image/*', 'application/json']),
                ]),
        ];
    }

    public static function teamsAndConditions(): array
    {
        return [
            TextInput::make('title')
                ->maxLength(500),

            RichEditor::make('description')
                ->maxLength(500),
        ];
    }

    public static function richTextEditor(): array
    {
        return [
            RichEditor::make('content'),
        ];
    }
}
