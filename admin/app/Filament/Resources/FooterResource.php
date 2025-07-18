<?php

namespace App\Filament\Resources;

use App\Enums\ContentStatus;
use App\Enums\FooterTypes;
use App\Filament\Resources\FooterResource\Pages;
use App\Filament\Resources\FooterResource\RelationManagers;
use App\Models\Footer;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\Concerns\Translatable;

class FooterResource extends Resource
{
    use Translatable;

    protected static ?string $model = Footer::class;

    protected static ?int $navigationSort = 5;
    protected static ?string $navigationGroup = "CMS";
    protected static ?string $navigationLabel = 'Footers';
    protected static ?string $navigationIcon = 'heroicon-o-computer-desktop';
    protected static ?string $modelLabel = 'Footers';

    // protected static bool $shouldRegisterNavigation = false;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make("Footer Details")
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Radio::make('footer_type')
                            ->options(FooterTypes::class)
                            ->inline()
                            ->inlineLabel(false)
                            ->required()
                            ->live(),
                        // Forms\Components\RichEditor::make('footer_value')
                        //     ->columnSpanFull()
                        //     ->visible(fn(Get $get) => $get('footer_type') == FooterTypes::HTML->value),
                        Forms\Components\Repeater::make('footer_value')
                            ->schema([
                                Forms\Components\TextInput::make('label')
                                    ->required(),
                                Forms\Components\TextInput::make('url')
                                    ->required(),
                                Forms\Components\Toggle::make('open_newtab')
                                    ->inline(false)
                                    ->inlineLabel(false),
                            ])
                            ->columns(3)
                            ->visible(fn(Get $get) => in_array($get('footer_type'), [FooterTypes::Links->value, FooterTypes::BottomLinks->value])),
                        Forms\Components\TextInput::make('sort_order')
                            ->required()
                            ->numeric()
                            ->default(100),
                        Forms\Components\Radio::make('status')
                            ->options(ContentStatus::class)
                            ->required()
                            ->default('publish')
                            ->inline()
                            ->inlineLabel(false),
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable(),
                Tables\Columns\TextColumn::make('footer_type')
                    ->badge()
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->native(false)
                    ->label(__('Status'))
                    ->options(ContentStatus::class),
                Tables\Filters\SelectFilter::make('footer_type')
                    ->native(false)
                    ->label(__('Footer Type'))
                    ->options(FooterTypes::class),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("xl"),
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFooters::route('/'),
            'create' => Pages\CreateFooter::route('/create'),
            'edit' => Pages\EditFooter::route('/{record}/edit'),
        ];
    }
}
