<?php

namespace App\Filament\Resources\StoreResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\Concerns\Translatable;
use Filament\Resources\RelationManagers\RelationManager;
use Livewire\Attributes\Reactive;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Actions\LocaleSwitcher;
use Filament\Actions;


class StoreCashbackRelationManager extends RelationManager
{
    use Translatable;

    #[Reactive]
    public ?string $activeLocale = null;
    protected static bool $isLazy = false;

    protected static string $relationship = 'storeCashback';

    public function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Cashback Details')->schema([

                    Forms\Components\TextInput::make('title')
                        ->label('Title')
                        ->maxLength(255)
                        ->required(),

                    Forms\Components\TextInput::make('description')
                        ->label('Description')
                        ->maxLength(255),

                    // Forms\Components\Select::make('store_id')
                    //     ->label('Store')
                    //     ->relationship('store', 'name')
                    //     ->required(),

                    Forms\Components\Select::make('rate_type')
                        ->label('Rate Type')
                        ->options([
                            "percent" => "Percent",
                            "fixed" => "Fixed",
                        ])
                        ->default("percent")
                        ->required(),

                    Forms\Components\TextInput::make('commission')
                        ->label('Commission')
                        ->numeric()
                        ->default(0.00)
                        ->required(),

                    Forms\Components\TextInput::make('cashback')
                        ->label('Cashback')
                        ->numeric()
                        ->required(),

                    Forms\Components\Toggle::make('enabled')
                        ->default(true)
                        ->required()
                        ->label('Enabled'),

                    Forms\Components\Toggle::make('is_manual')
                        ->required()
                        ->label('Manual'),

                    Forms\Components\Toggle::make('lock_title')
                        ->required()
                        ->label('Lock Title'),

                ])

            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')

            ->columns([

                // Tables\Columns\TextColumn::make('store.name')
                //     ->label('Store')
                //     ->searchable()
                //     ->sortable(),

                Tables\Columns\TextColumn::make('title')
                    ->label('Title')
                    ->tooltip(fn($state) => $state)
                    ->limit(20)
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('rate_type')
                    ->label('Rate Type')
                    ->searchable(),

                Tables\Columns\TextColumn::make('commission')
                    ->label('Commission')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('cashback')
                    ->label('Cashback')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\ToggleColumn::make('enabled')
                    ->label('Enabled'),

                Tables\Columns\ToggleColumn::make('is_manual')
                    ->label('Manual'),

                Tables\Columns\ToggleColumn::make('lock_title')
                    ->label('Lock Title'),

            ])
            ->filters([

                Tables\Filters\TernaryFilter::make('enabled')
                    ->placeholder('All'),

                Tables\Filters\TernaryFilter::make('is_manual')
                    ->label('Manual')
                    ->placeholder('All'),

                Tables\Filters\TernaryFilter::make('lock_title')
                    ->label('Lock Title')
                    ->placeholder('All'),

                Tables\Filters\SelectFilter::make('rate_type')
                    ->options([
                        "percent" => "Percent",
                        "fixed" => "Fixed",
                    ])
                    ->placeholder('All'),


            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->size("xl")->tooltip('Edit'),
                Tables\Actions\DeleteAction::make()->label("")->size("xl")->tooltip('Delete'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),


                ]),
            ]);
    }
}
