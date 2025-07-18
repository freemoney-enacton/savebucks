<?php

namespace App\Filament\Resources\FaqCategoryResource\RelationManagers;

use App\Models\Faq;
use Filament\Forms;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\RelationManagers\Concerns\Translatable;

class FaqsRelationManager extends RelationManager
{
    protected static string $relationship = 'faqs';
    use Translatable;
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('question')->required()->columnSpanFull(),
                Textarea::make('answer')->required()->columnSpanFull(),
                TextInput::make('sort_order')->numeric()->default(100),

            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('category_code')
            ->columns([
                // Tables\Columns\TextColumn::make('category_code'),
                Tables\Columns\TextColumn::make('question')->limit(20),
                Tables\Columns\TextColumn::make('answer')->limit(20),
                Tables\Columns\TextColumn::make('sort_order'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
                Tables\Actions\LocaleSwitcher::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->extraModalFooterActions(fn (): array => [
                        Tables\Actions\Action::make('delete')->icon('heroicon-o-trash')->color('danger')
                            ->requiresConfirmation()
                            ->action(function (Faq $record) {
                                $record->delete();
                            })
                            ->cancelParentActions()

                    ]),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
