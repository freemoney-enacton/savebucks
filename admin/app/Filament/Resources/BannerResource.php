<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BannerResource\Pages;
use App\Filament\Resources\BannerResource\RelationManagers;
use App\Models\Banner;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
// use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\Concerns\Translatable;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\QueryBuilder\Constraints\SelectConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;

class BannerResource extends Resource
{
    protected static ?string $model = Banner::class;
    use Translatable;

    protected static ?int $navigationSort = 1;
    protected static ?string $navigationGroup = "CMS";
    protected static ?string $navigationLabel = 'Banners';
    protected static ?string $navigationIcon = 'heroicon-o-photo';
    protected static ?string $modelLabel = 'Banners';

    protected static bool $shouldRegisterNavigation = false;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('link')
                    ->required()
                    ->activeUrl()
                    ->maxLength(255),
                Forms\Components\TextInput::make('btn_link')
                    ->required()
                    ->activeUrl()
                    ->maxLength(255),
                Forms\Components\TextInput::make('btn_text')
                    ->alpha()
                    ->required()
                    ->maxLength(255),
                Forms\Components\Radio::make('status')
                    ->options([
                        "draft" => "Draft",
                        "publish" => "Publish",
                        "trash" => "Trash",
                    ])->inline()->inlineLabel(false)
                    ->required(),
                Forms\Components\Toggle::make('have_content')->inline()->inlineLabel(false),
                Forms\Components\FileUpload::make('desktop_img')
                    ->disk('frontend')
                    ->image()
                    ->required(),
                Forms\Components\FileUpload::make('mobile_img')
                    ->image()
                    ->required(),
                Forms\Components\Textarea::make('description')
                    ->required()
                    ->maxLength(255)
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\ImageColumn::make('desktop_img'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => ucwords($state))
                    ->badge()->color(fn (string $state): string => match ($state) {
                        'publish' => 'success',
                        'draft' => 'warning',
                        'trash' => 'danger',
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
                // Tables\Filters\TrashedFilter::make(),
                Tables\Filters\QueryBuilder::make()
                    ->constraints([
                        TextConstraint::make('title'),
                        SelectConstraint::make('status')
                            ->options([
                                "draft" => "Draft",
                                "publish" => "Publish",
                                "trash" => "Trash",
                            ]),
                    ])
            ], layout: FiltersLayout::AboveContentCollapsible)
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
            'index' => Pages\ListBanners::route('/'),
            'create' => Pages\CreateBanner::route('/create'),
            'edit' => Pages\EditBanner::route('/{record}/edit'),
        ];
    }

    // public static function getEloquentQuery(): Builder
    // {
    //     return parent::getEloquentQuery()
    //         ->withoutGlobalScopes([
    //             SoftDeletingScope::class,
    //         ]);
    // }
}
