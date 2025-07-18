<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StoreCategoryResource\Pages;
use App\Filament\Resources\StoreCategoryResource\RelationManagers;
use App\Models\StoreCategory;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\Concerns\Translatable;
use Illuminate\Database\Eloquent\Collection;

class StoreCategoryResource extends Resource
{
    use Translatable;
    protected static ?string $model = StoreCategory::class;
    protected static ?int $navigationSort = 2;
    protected static ?string $navigationGroup = "Stores & Offers";
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Stores')
                    ->description('Store general details')
                    ->schema([

                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->minLength(2),
                            // ->live(debounce: 800)
                            // ->afterStateUpdated(function ($state, callable $set, $get) {
                            //     $recordId = $get('id');
                            //     if (!$recordId) {
                            //         $slug = Str::slug($state);
                            //         $set('slug', $slug);
                            //     }
                            // }),

                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)             
                            ->regex('/^[a-z0-9_-]+$/')
                            ->unique(ignoreRecord: true)
                            ->infotip('Only lowercase letters, numbers, hyphens, and underscores are allowed. Max length is 255 characters.'),

                        Forms\Components\Select::make('parent_id')
                            // ->relationship('parent', 'name', ignoreRecord: true)
                            ->options(StoreCategory::where('parent_id', null)->pluck('name', 'id'))
                            ->label('Parent Category')
                            ->preload()
                            ->searchable()
                            ->nullable(),

                        Forms\Components\RichEditor::make('description')
                            ->nullable()
                            ->columnSpanFull()
                            ->fileAttachmentsVisibility('public')
                            ->fileAttachmentsDisk('frontend')
                            ->fileAttachmentsDirectory('stores')
                            ->maxLength(1000),

                        // Forms\Components\FileUpload::make('icon')
                        //     ->image()
                        //     ->maxSize(2048)
                        //     ->label('Icon')
                        //     ->imageEditor()
                        //     ->disk('frontend')
                        //     ->directory('stores')
                        //     ->visibility('public')
                        //     ->maxSize(2048)
                        //     ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/jpg'])
                        //     ->getUploadedFileNameForStorageUsing(function ($file, $get): string {
                        //         $extension = $file->getClientOriginalExtension() ?: 'png';
                        //         return $get('slug') . '-category-icon-' . uniqid() . '.' . $extension;
                        //     })
                        //     ->helperText('Recommended max size 2MB,(.jpg, .png)'),

                        // Forms\Components\FileUpload::make('header_image')
                        //     ->image()
                        //     ->maxSize(2048)
                        //     ->label('Header Image')
                        //     ->imageEditor()
                        //     ->disk('frontend')
                        //     ->directory('stores')
                        //     ->visibility('public')
                        //     ->maxSize(2048)
                        //     ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/jpg'])
                        //     ->getUploadedFileNameForStorageUsing(function ($file, $get): string {
                        //         $extension = $file->getClientOriginalExtension() ?: 'png';
                        //         return $get('slug') . '-category-header-' . uniqid() . '.' . $extension;
                        //     })
                        //     ->helperText('Recommended max size 2MB,(.jpg, .png)'),

                        Forms\Components\Toggle::make('is_featured')
                            ->default(0),

                    ])->columns(2)
                    ->columnSpan(2),

                Forms\Components\Section::make('Stores')
                    ->description('Store general details')
                    ->schema([

                        Forms\Components\TextInput::make('h1'),

                        Forms\Components\TextInput::make('h2'),

                        Forms\Components\TextInput::make('meta_title')
                            ->label('Meta Title'),

                        Forms\Components\TextInput::make('meta_desc')
                            ->label('Meta Description'),

                    ])->columns(1)
                    ->columnSpan(1),

            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('name')
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

                Tables\Columns\TextColumn::make('parent.name')
                    ->label('Parent Category'),

                Tables\Columns\ToggleColumn::make('is_featured')
                    ->label('Is Featured'),

                Tables\Columns\TextColumn::make('visits')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('store_count')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Updated At')
                    ->toggleable(isToggledHiddenByDefault: false),
            ])
            ->filters([

                Tables\Filters\TernaryFilter::make('is_featured')
                    ->placeholder("All")
                    ->label('Featured'),
            
                Tables\Filters\SelectFilter::make('parent_id')
                    ->label('Parent Category')
                    ->options(StoreCategory::where('parent_id', null)->pluck('name', 'id'))
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

                    ...collect([
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
                                StoreCategory::whereIn('id', $records->pluck('id'))->update([$action['field'] => $action['value']]);
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
            'index' => Pages\ListStoreCategories::route('/'),
            'create' => Pages\CreateStoreCategory::route('/create'),
            'edit' => Pages\EditStoreCategory::route('/{record}/edit'),
        ];
    }
}
