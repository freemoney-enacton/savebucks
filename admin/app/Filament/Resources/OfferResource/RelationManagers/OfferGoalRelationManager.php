<?php

namespace App\Filament\Resources\OfferResource\RelationManagers;

use App\Models\Network;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\RelationManagers\Concerns\Translatable;

class OfferGoalRelationManager extends RelationManager
{
    protected static string $relationship = 'OfferGoal';
    use Translatable;
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('network')
                    ->required()
                    ->disabledOn('edit')
                    ->options(Network::all()->pluck('name', 'code')),
                Forms\Components\TextInput::make('network_task_id')
                    ->label('Network Task ID')
                    ->disabledOn('edit')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('network_goal_id')->disabledOn('edit')
                    ->label('Network Goal ID'),
                Forms\Components\TextInput::make('network_goal_name')
                    ->label('Network Goal Name')
                    ->disabledOn('edit'),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('description')
                    ->maxLength(255),
                Forms\Components\FileUpload::make('image')
                    ->image()
                    ->maxSize(1024),
                Forms\Components\TextInput::make('cashback')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('revenue')
                    ->numeric(),
                Forms\Components\Radio::make('status')
                    ->inline()->inlineLabel(false)
                    ->options([
                        'draft' => 'Draft',
                        'publish' => 'Publish',
                        'trash' => 'Trash',
                    ])->default('draft'),
                Forms\Components\Toggle::make('is_translated')->label('Is Translated')->visible(false),
            ]);
    }

    protected function canCreate(): bool
    {
        return true;
    }

    protected function canDeleteAny(): bool
    {
        return false;
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('name'),
                Tables\Columns\TextColumn::make('network'),
                Tables\Columns\SelectColumn::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'publish' => 'Publish',
                        'trash' => 'Trash',
                    ]),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
                Tables\Actions\LocaleSwitcher::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                // Tables\Actions\DeleteAction::make(),
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
