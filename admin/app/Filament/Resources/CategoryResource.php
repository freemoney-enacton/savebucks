<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CategoryResource\Pages;
use App\Filament\Resources\CategoryResource\RelationManagers;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Resources\Concerns\Translatable;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\QueryBuilder\Constraints\BooleanConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;
use Illuminate\Support\Str;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;
    use Translatable;

    protected static ?string $navigationIcon = 'heroicon-o-swatch';
    protected static ?int $navigationSort = 2;
    protected static ?string $navigationGroup = "Tasks & Survey Management";
    protected static ?string $modelLabel = 'Category';
    protected static ?string $pluralModelLabel = 'Categories';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Basic Information')
                    ->columns(2)
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->infotip("Name of the category displayed on frontend.")
                            ->live(onBlur: true, debounce: 100)
                            ->afterStateUpdated(function (string $operation, $state, Forms\Set $set) {
                                if ($operation === 'edit') {
                                    return;
                                }
                                $set('slug', Str::slug($state));
                            })
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('slug')
                            ->infotip("Slug is used for internal reference of the category across multiple places.")
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Forms\Components\FileUpload::make('icon')
                            ->image()
                            ->disk('frontend')
                            ->columnSpanFull()
                            ->default(null),

                        // Forms\Components\FileUpload::make('banner_img')
                        //     ->visible(false)
                        //     ->label('Banner Image')
                        //     ->image()
                        //     ->default(null),

                        Forms\Components\ColorPicker::make('bg_color')
                            ->default('#ffffff')
                            ->prefixicon('heroicon-o-paint-brush')
                            ->infotip("This color determines the background color of the tag displayed on offercard for category information. Add the hex code for the color. Make sure that color picked is a light color as the text for category is dark already.")
                            ->label('Background Color'),

                        Forms\Components\TextInput::make('sort_order')
                            ->label('Sort Order')
                            ->infotip("This determines how to sort the category along side other categories. Lower number means category will be placed first.")
                            ->required()
                            ->numeric()
                            ->default(100),
                        Forms\Components\Toggle::make('is_enabled')
                            ->infotip("Mark categories to show in the frontend.")
                            ->label('Is Enabled')
                            ->inlineLabel(false)
                            ->inline(false)
                            ->required(),
                        Forms\Components\Toggle::make('show_menu')
                            ->label('Show in Sidebar Menu')
                            ->infotip("This is used to show categories in sidebar menu.")
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->inlineLabel(false)
                            ->inline(false)
                            ->required(),
                    ]),
                Section::make('Advanced Information')
                    ->columns(2)
                    ->schema([
                        Forms\Components\TagsInput::make('match_keywords')
                            ->label('Match Keywords')
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('This is used during offers import. Upon getting offers information from network, the system will try to identify the applicable category based on the offer title, description and network categories.')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->required()
                            ->columnSpanFull()
                            ->separator('|'),

                        Forms\Components\TextInput::make('match_order')
                            ->label('Match Order')
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('This is used during offers import. Upon import if multiple matches are found for category identification, category with lowest match order will be applicable.')
                            ->extraFieldWrapperAttributes([
                                'class' => 'category-block',
                            ])
                            ->required()
                            ->numeric()
                            ->default(100),

                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('name')
                    ->formatStateusing(fn($state) => ucfirst($state))
                    ->searchable(),

                Tables\Columns\TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable(),

                // Tables\Columns\TextColumn::make('bg_color')->label('Background Color')
                //     // ->badge()
                //     ->formatStateUsing(function ($state) {

                //         $color =  self::getColorName($state);
                //         return '<span style="border-radius: 5px; padding: 10px 8px; background-color: ' . $state . ';">' . $color . '</span>';
                //     })->html(),

                Tables\Columns\ColorColumn::make('bg_color')
                    ->tooltip(fn($state) => $state)                 
                    ->label('Background Color'),


                Tables\Columns\TextColumn::make('match_order')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\ToggleColumn::make('is_enabled')
                    ->label('Enabled'),
                Tables\Columns\ToggleColumn::make('show_menu')
                    ->label('Show in Sidebar Menu'),
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
                Tables\Filters\TernaryFilter::make('enabled')
                    ->native(false),
                Tables\Filters\TernaryFilter::make('show_menu')
                    ->label("Show in Sidebar Menu")
                    ->native(false),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
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
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'edit' => Pages\EditCategory::route('/{record}/edit'),
        ];
    }

    public static function getColorOptions()
    {
        return [
            '#ffffff' => 'White',
            '#000000' => 'Black',
            '#f44336' => 'Red',
            '#e91e63' => 'Pink',
        ];
    }

    public static function getColorName($color)
    {
        return array_key_exists($color, self::getColorOptions()) ? self::getColorOptions()[$color] : $color;
    }
    // public static function getEloquentQuery(): Builder
    // {
    //     return parent::getEloquentQuery()
    //         ->withoutGlobalScopes([
    //             SoftDeletingScope::class,
    //         ]);
    // }
}
