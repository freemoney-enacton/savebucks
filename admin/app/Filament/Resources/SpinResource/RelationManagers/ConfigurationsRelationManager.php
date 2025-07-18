<?php

namespace App\Filament\Resources\SpinResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ConfigurationsRelationManager extends RelationManager
{
    protected static string $relationship = 'configurations';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->maxLength(255)
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('icon')
                    ->image()
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('code')
                    ->maxLength(255),
                Forms\Components\TextInput::make('probability')
                    ->numeric()
                    ->minValue(0)
                    ->maxValue(100),
                Forms\Components\TextInput::make('amount')
                    ->numeric()
                    ->minValue(0)
                    ->visible(function (RelationManager $livewire): bool {
                        return $livewire->getOwnerRecord()->variable_rewards ? false : true;
                    }),
                Forms\Components\TextInput::make('max_amount')
                    ->numeric()
                    ->minValue(0)
                    ->visible(function (RelationManager $livewire): bool {
                        return $livewire->getOwnerRecord()->variable_rewards ? true : false;
                    }),
                Forms\Components\TextInput::make('min_amount')
                    ->numeric()
                    ->minValue(0)
                    ->visible(function (RelationManager $livewire): bool {
                        return $livewire->getOwnerRecord()->variable_rewards ? true : false;
                    }),
                Forms\Components\Toggle::make('enabled')
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->searchable(),
                Tables\Columns\TextColumn::make('title')
                    ->searchable(),
                Tables\Columns\ImageColumn::make('icon'),
                Tables\Columns\TextColumn::make('probability')
                    ->formatStateUsing(fn($state) => formatPercent($state)),
                Tables\Columns\TextColumn::make('amount')
                    ->state(function($record, RelationManager $livewire) {
                        if($livewire->getOwnerRecord()->variable_rewards) {
                            return formatCurrency($record->min_amount) . ' - ' . formatCurrency($record->max_amount);
                        } else {
                            return formatCurrency($record->amount);
                        }
                    }),
                Tables\Columns\ToggleColumn::make('enabled'),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('enabled')
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([]);
    }
}
