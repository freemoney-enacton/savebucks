<?php

namespace App\Filament\Resources;

use App\Enums\ContentStatus;
use App\Filament\Resources\FaqResource\Pages;
use App\Filament\Resources\FaqResource\RelationManagers;
use App\Models\Faq;
use App\Models\FaqCategory;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

use Filament\Resources\Concerns\Translatable;

class FaqResource extends Resource
{
    use Translatable;

    protected static ?string $model = Faq::class;

    protected static ?int $navigationSort = 3;
    protected static ?string $navigationGroup = "CMS";
    protected static ?string $navigationLabel = 'Faq';
    protected static ?string $navigationIcon = 'heroicon-o-question-mark-circle';
    protected static ?string $modelLabel = 'Faq';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Faq Details')
                    ->columns(2)
                    ->schema([
                        Forms\Components\Select::make('category_code')
                            ->options(FaqCategory::get())
                            ->native(false)
                            ->searchable()
                            ->preload(),
                        Forms\Components\TextInput::make('question')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('answer')
                            ->maxLength(2500),
                        Forms\Components\TextInput::make('sort_order')
                            ->numeric(),
                        Forms\Components\Radio::make('status')
                                ->options(ContentStatus::class)->inline()->inlineLabel(false)
                                ->default('publish'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Category')
                    ->searchable(),
                Tables\Columns\TextColumn::make('question')
                    ->limit(100)
                    ->tooltip(fn($state) => $state)
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->where('question','like',"%{$search}%");
                    }),
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
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category_code')
                    ->options(FaqCategory::pluck('name','category_code'))
                    ->native(false)
                    ->label(__('Category')),
                Tables\Filters\SelectFilter::make('status')
                    ->native(false)
                    ->label(__('Status'))
                    ->options(ContentStatus::class),
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
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFaqs::route('/'),
            'create' => Pages\CreateFaq::route('/create'),
            // 'edit' => Pages\EditFaq::route('/{record}/edit'),
        ];
    }
}
