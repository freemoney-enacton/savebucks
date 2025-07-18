<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GiftCardBrandResource\Pages;
use App\Filament\Resources\GiftCardBrandResource\RelationManagers;
use App\Models\GiftCardBrand;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Resources\Concerns\Translatable;
use Filament\Tables\Actions\BulkAction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use ValentinMorice\FilamentJsonColumn\JsonColumn;
use App\Models\Country;



class GiftCardBrandResource extends Resource
{
    use Translatable;

    protected static ?string $model             = GiftCardBrand::class;
    protected static ?string $modelLabel        = "Tango Cards";
    protected static ?string $navigationIcon    = 'heroicon-o-gift';
    protected static ?string $navigationGroup   = "Stores & Offers";
    protected static ?int    $navigationSort       =  4;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Tango Cards Details')
                    ->schema([

                    Forms\Components\TextInput::make('vendor')
                        ->required()
                        ->maxLength(25),

                    Forms\Components\TextInput::make('sku')
                        ->label('SKU')
                        ->required()
                        ->maxLength(50),

                    Forms\Components\TextInput::make('name')
                        ->maxLength(500),

                    Forms\Components\Textarea::make('description')
                        ->columnSpanFull(),

                    Forms\Components\FileUpload::make('image')
                        ->label('Image')
                        ->imageEditor()
                        ->disk('frontend')
                        ->directory('gift-card/tgc/')
                        ->nullable()
                        ->visibility('public')
                        ->maxSize(2048)
                        ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/jpg'])
                        // ->getUploadedFileNameForStorageUsing(function ($file, $get): string {
                        //     $extension = $file->getClientOriginalExtension() ?: 'png';
                        //     return $get('slug') . '-logo-' . uniqid() . '.' . $extension;
                        // })
                        ->helperText('Recommended: max size 2MB,(.jpg, .png)')
                        ->image(),

                    Forms\Components\Select::make('countries')
                        ->label("Countries")
                        ->multiple()
                        ->searchable()
                        ->preload()
                        ->options(Country::all()->pluck('name', 'code')),

                    Forms\Components\Textarea::make('items')
                        ->formatStateUsing(function ($state) {
                            if (is_string($state)) {
                                $decoded = json_decode($state, true);
                                return $decoded ? json_encode($decoded, JSON_PRETTY_PRINT) : $state;
                            }
                            return is_array($state) ? json_encode($state, JSON_PRETTY_PRINT) : $state;
                        })
                        ->rows(8)
                        ->label('Items'),

                    Forms\Components\TextInput::make('card_status')
                        ->label("Card Status")
                        ->required()
                        ->maxLength(100),

                    Forms\Components\Radio::make('status')
                        ->options([
                            'draft'     => "Draft",
                            'publish'   => "Publish",
                            'trash'     => "Trash",
                        ])
                        ->inline()
                        ->inlineLabel(false)
                        ->default('draft')
                        ->required(),

                ])->columnSpan(1),

                Forms\Components\Section::make('Additional Information')
                ->description('')
                ->schema([

                    Forms\Components\TextInput::make('terms'),

                    Forms\Components\Toggle::make('active')->disabled()->helperText('Status received from provider'),                    

                    Forms\Components\TagsInput::make('denomination')
                        ->label('Denomination')
                        ->nestedRecursiveRules(['numeric'])
                        ->afterStateHydrated(function ($state, $component) {

                            $state = $state ?? [];
                            if (is_array($state)) {
                                $component->state(array_map('intval', $state));
                            }else{
                                $component->state([]);
                            }
                        })
                        ->dehydrateStateUsing(function ($state) {
                            return array_map('intval', $state ?? []);
                        }),

                    Forms\Components\Textarea::make('extra_information')
                        ->label('Extra Information')
                         ->formatStateUsing(function ($state) {
                            if (is_string($state)) {
                                $decoded = json_decode($state, true);
                                return $decoded ? json_encode($decoded, JSON_PRETTY_PRINT) : $state;
                            }
                            return is_array($state) ? json_encode($state, JSON_PRETTY_PRINT) : $state;
                        })
                        ->rows(8),


                    Forms\Components\DateTimePicker::make('last_updated_at')
                        ->label("Last Updated At")
                        ->native(false)
                        ->prefixIcon('heroicon-o-calendar'),

                ])->columnSpan(1),

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('vendor')
                    ->formatStateUsing(fn(string $state): string => ucwords($state))
                    ->searchable(),

                Tables\Columns\TextColumn::make('name')
                    ->searchable(),

                Tables\Columns\TextColumn::make('sku')
                    ->label('SKU')
                    ->searchable(),

                Tables\Columns\TextColumn::make('last_updated_at')
                    ->label("Last Updated At")
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\ToggleColumn::make('active')->disabled(),
                  
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->formatstateUsing(fn(string $state): string => ucwords($state))
                    ->color(fn(string $state): string => match ($state) {
                        'draft'     => "warning",
                        'publish'   => "success",
                        'trash'     => "danger",
                        default   => 'gray',
                    }),

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

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft'     => "Draft",
                        'publish'   => "Publish",
                        'trash'     => "Trash",
                    ])
                    ->preload()
                    ->searchable(),

                Tables\Filters\TernaryFilter::make('active')->label("Filter by Active Flag")->trueLabel("Active")->falseLabel("Inactive"),

            ])
            ->actions([
                Tables\Actions\EditAction::make()->label('')->tooltip('Edit')->size("xl"),
                Tables\Actions\ViewAction::make()->label('')->tooltip('View')->size("xl"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),

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
                    GiftCardBrand::whereIn('id', $records->pluck('id'))->update(['status' => $data['status']]);
                })
                ->deselectRecordsAfterCompletion()
                ->button(),
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
            'index' => Pages\ListGiftCardBrands::route('/'),
            'create' => Pages\CreateGiftCardBrand::route('/create'),
            'edit' => Pages\EditGiftCardBrand::route('/{record}/edit'),
        ];
    }
}
