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
use Illuminate\Support\Str;

class GoalsRelationManager extends RelationManager
{
    protected static string $relationship = 'goals';

    public function form(Form $form): Form
    {
        return $form
            ->schema([

            Forms\Components\Select::make('tracking_code')
                ->label('Tracking Code')
                ->preload()
                ->searchable()
                ->disabledOn("edit")
                ->options(function (RelationManager $livewire, ?Model $record = null) {
                    // Get the parent campaign record
                    $campaign = $livewire->getOwnerRecord();
                    
                    // All possible tracking codes
                    $allCodes = [
                        'app_install'           => 'app_install',
                        'register'              => 'register', 
                        'user_transaction'      => 'user_transaction',
                    ];
                    
                    if (!$campaign) {
                        return $allCodes;
                    }
                    
                    // Get existing goals for this campaign
                    $existingGoals = $campaign->goals();
                    
                    // If we're editing, exclude the current record from the check
                    if ($record && $record->exists) {
                        $existingGoals = $existingGoals->where('id', '!=', $record->id);
                    }
                    
                    // Get used tracking codes
                    $usedCodes = $existingGoals->pluck('tracking_code')->toArray();
                    
                    // Return only available codes
                    return array_filter($allCodes, function($label, $code) use ($usedCodes) {
                        return !in_array($code, $usedCodes);
                    }, ARRAY_FILTER_USE_BOTH);
                })
                ->reactive()
                ->required()
                ->infotip('Select a unique tracking code for this goal. Choose from the available options.'), 

            Forms\Components\TextInput::make('qualification_amount')
                ->required()
                ->prefix(config('freemoney.default.default_currency'))
                ->label('Qualification Amount')
                ->numeric()
                ->default(0)
                ->visible(function($get) {
                    $tracking_code = $get('tracking_code');
                    return $tracking_code == 'user_transaction'; // Show only if 'user_transaction' is selected
                })
                ->reactive()
                ->minValue(0)
                ->infotip('Enter the amount required to qualify for this goal. This field will appear only if "User Transaction" is selected as the tracking code.'),

            Forms\Components\TextInput::make('name')
                ->placeholder("Add goal Name")
                ->required()
                ->infotip('Provide a name for the goal associated with the campaign.')
                ->maxLength(255)
                ->infotip('Goal name should be concise and descriptive.'),

            Forms\Components\TextInput::make('description')
                ->required()
                ->infotip('Provide a brief description for this campaign goal.')
                ->maxLength(255)
                ->infotip('Ensure the description clearly explains the purpose and target of the goal.'),

            Forms\Components\Hidden::make('commission_type')
                ->default('fixed')
                ->infotip('The commission type will determine how the commission amount is calculated.'),

            Forms\Components\TextInput::make('commission_amount')
                ->required()
                ->prefix(config('freemoney.default.default_currency'))
                ->label('Commission Amount')
                ->numeric()
                ->minValue(0)
                ->infotip('Enter the amount for the commission associated with this goal. A positive value is required for all active goals.'),

            Forms\Components\Radio::make('status')
                ->required()
                ->label('Status')
                ->inline()
                ->inlineLabel(false)
                ->options([
                    'active' => 'Active',
                    'inactive' => 'Inactive',
                ])
                ->default('active')
                ->infotip('Set the goal status. An "active" status will include the goal in the current campaigns, while "inactive" will exclude it.')


            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([

                Tables\Columns\TextColumn::make('name')
                    ->searchable(),

                // Tables\Columns\TextColumn::make('commission_type')
                //     ->searchable()
                //     ->badge()
                //     ->color(fn (string $state): string => match ($state) {
                //         'fixed'     => 'success',
                //         'percent'   => 'info',
                //     })
                //     ->formatStateUsing(fn (string $state): string => ucfirst($state)),

                Tables\Columns\TextColumn::make('commission_amount')
                    ->searchable()
                    ->money(config('freemoney.default.default_currency'))
                    ->label('Commission Amount'),

                Tables\Columns\TextColumn::make('qualification_amount')
                    ->searchable()
                    ->money(config('freemoney.default.default_currency'))
                    ->label('Qualification Amount'),

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

                // Tables\Filters\SelectFilter::make('commission_type')
                //     ->label('Commission Type')
                //     ->options([
                //         'fixed'     => 'Fixed',
                //         'percent'   => 'Percent',
                //     ]),

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
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
