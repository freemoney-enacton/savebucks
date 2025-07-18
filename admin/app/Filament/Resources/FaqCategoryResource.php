<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FaqCategoryResource\Pages;
use App\Filament\Resources\FaqCategoryResource\RelationManagers;
use App\Filament\Resources\FaqCategoryResource\RelationManagers\FaqsRelationManager;
use App\Models\FaqCategory;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class FaqCategoryResource extends Resource
{
    protected static ?string $model = FaqCategory::class;

    protected static ?int $navigationSort = 4;
    protected static ?string $navigationGroup = "CMS";
    protected static ?string $navigationLabel = 'Faq Categories';
    protected static ?string $navigationIcon = 'heroicon-o-queue-list';
    protected static ?string $modelLabel = 'Faq Categories';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make("Faq Category Details")
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->label('Category Name')
                            ->live(onBlur: true, debounce: 200)
                            ->afterStateUpdated(function (string $operation, $state, Forms\Set $set) {
                                if ($operation === 'edit') {
                                    return;
                                }
                                $set('category_code', Str::slug($state));
                            })
                            ->maxLength(255),
                        Forms\Components\TextInput::make('category_code')
                            ->label('Category Code')
                            ->required()
                            ->hintIcon('heroicon-o-question-mark-circle')
                            ->hintIconTooltip('without spaces or special characters and must be unique')
                            ->disabledOn('edit')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('sort_order')
                            ->label('Sort Order')
                            ->required()
                            ->numeric()
                            ->default(100)
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Category Name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('category_code')
                    ->label('Category Code')
                    ->searchable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Sort Order')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('faqs_counts')
                    ->counts('faqs')
                    ->state(function (FaqCategory $record) {
                        return $record->faqs_count;
                    })
                    ->label('Number of FAQs'),
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
                //
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

    public static function getRelations(): array
    {
        return [
            FaqsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFaqCategories::route('/'),
            'create' => Pages\CreateFaqCategory::route('/create'),
            'edit' => Pages\EditFaqCategory::route('/{record}/edit'),
        ];
    }
}
