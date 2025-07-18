<?php

namespace App\Filament\Affiliate\Resources\CampaignResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class GoalsRelationManager extends RelationManager
{
    protected static string $relationship = 'goals';

    public function form(Form $form): Form
    {
        return $form
            ->schema([             

                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),

                Forms\Components\TextInput::make('description')
                    ->required()
                    ->maxLength(255),

                Forms\Components\Select::make('commission_type')
                    ->required()
                    ->label('Commission Type')
                    ->options([
                        'fixed'   => 'Fixed Amount',
                        'percent' => 'Percentage',
                    ])
                    ->default('fixed'),

                Forms\Components\TextInput::make('commission_amount')
                    ->required()
                    ->label('Commission Amount')
                    ->numeric()
                    ->minValue(0),

                Forms\Components\TextInput::make('tracking_code')
                    ->label('Tracking Code')
                    ->required()
                    ->maxLength(10)
                    ->unique(ignoreRecord: true)                
                    ->helperText('Unique tracking code (up to 10 characters)'),

                Forms\Components\Radio::make('status')
                    ->required()
                    ->label('Status')
                    ->inline()
                    ->inlineLabel(false)
                    ->options([
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                    ])
                    ->default('active'),

            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([

                Tables\Columns\TextColumn::make('name')
                    ->searchable(),

                Tables\Columns\TextColumn::make('commission_type')
                    ->searchable()
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'fixed'     => 'success',
                        'percent'   => 'info',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state)),
                
                Tables\Columns\TextColumn::make('commission_amount')
                    ->searchable()
                    ->label('Commission Amount'),

                Tables\Columns\TextColumn::make('tracking_code')
                    ->searchable()
                    ->label('Tracking Code'),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->searchable()
                    ->color(fn (string $state): string => match ($state) {
                        'active'    => 'success',
                        'inactive'  => 'danger',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state)),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

            ])
            ->filters([
               
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'active'    => 'Active',
                        'inactive'  => 'Inactive',
                    ]),

                Tables\Filters\SelectFilter::make('commission_type')
                    ->label('Commission Type')
                    ->options([
                        'fixed'     => 'Fixed',
                        'percent'   => 'Percent',
                    ]),

            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->label('Add Goal'),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label('')->tooltip('Edit Goal')->size('lg'),
                // Tables\Actions\DeleteAction::make()->label('')->tooltip('Delete Goal')->size('lg'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
