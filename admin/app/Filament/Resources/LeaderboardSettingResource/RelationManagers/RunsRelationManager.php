<?php

namespace App\Filament\Resources\LeaderboardSettingResource\RelationManagers;

use App\Enums\LeaderboardRunStatus;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\Concerns\Translatable;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Livewire\Attributes\Reactive;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Http;
use App\Models\LeaderboardRun;
use Carbon\Carbon;

class RunsRelationManager extends RelationManager
{
    use Translatable;

    #[Reactive]
    public ?string $activeLocale = null;

    protected static string $relationship = 'runs';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\DatePicker::make('start_date')
                    ->required(),
                Forms\Components\DatePicker::make('end_date')
                    ->required(),
                Forms\Components\TextInput::make('prize')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('users')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('name'),
                Tables\Columns\TextColumn::make('start_date'),
                Tables\Columns\TextColumn::make('end_date'),
                Tables\Columns\TextColumn::make('prize')
                    ->formatStateUsing(fn($state) => formatCurrency($state)),
                Tables\Columns\TextColumn::make('users')
                    ->formatStateUsing(fn($state) => formatNumber($state)),
                Tables\Columns\TextColumn::make('status')
                    ->badge(),
                Tables\Columns\TextColumn::make('awarded_at'),
                Tables\Columns\TextColumn::make('created_at')
            ])
            ->defaultSort('id','desc')
            ->filters([

                Tables\Filters\SelectFilter::make('status')
                    ->native(false)
                    ->columnSpanFull()
                    ->label(__('Status'))
                    ->options(LeaderboardRunStatus::class),

                Tables\Filters\Filter::make('start_date')
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("Start Date From")->columnSpan(1)->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("Start Date Until")->columnSpan(1)->icon('heroicon-s-calendar'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('start_date', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('start_date', '<=', $data['until']));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];

                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'Start Date From ' . Carbon::parse($data['from'])->toFormattedDateString();
                        }

                        if ($data['until'] ?? null) {
                            $indicators['until'] = 'Start Date Until ' . Carbon::parse($data['until'])->toFormattedDateString();
                        }

                        return $indicators;
                }),

                Tables\Filters\Filter::make('end_date')
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("End Date From")->columnSpan(1)->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("End Date Until")->columnSpan(1)->icon('heroicon-s-calendar'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('end_date', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('end_date', '<=', $data['until']));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];

                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'End Date From ' . Carbon::parse($data['from'])->toFormattedDateString();
                        }

                        if ($data['until'] ?? null) {
                            $indicators['until'] = 'End Date Until ' . Carbon::parse($data['until'])->toFormattedDateString();
                        }

                        return $indicators;
                }),

                Tables\Filters\Filter::make('awarded_at')
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("Awarded Date From")->columnSpan(1)->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("Awarded Date Until")->columnSpan(1)->icon('heroicon-s-calendar'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('awarded_at', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('awarded_at', '<=', $data['until']));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];

                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'Awarded Date From ' . Carbon::parse($data['from'])->toFormattedDateString();
                        }

                        if ($data['until'] ?? null) {
                            $indicators['until'] = 'Awarded Date Until ' . Carbon::parse($data['until'])->toFormattedDateString();
                        }

                        return $indicators;
                }),

                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("Created Date From")->columnSpan(1)->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("Created Date Until")->columnSpan(1)->icon('heroicon-s-calendar'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('created_at', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('created_at', '<=', $data['until']));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];

                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'Created Date From ' . Carbon::parse($data['from'])->toFormattedDateString();
                        }

                        if ($data['until'] ?? null) {
                            $indicators['until'] = 'Created Date Until ' . Carbon::parse($data['until'])->toFormattedDateString();
                        }

                        return $indicators;
                }),

            ])->filtersFormColumns(2)
            ->headerActions([
                // Add your header actions here
                Tables\Actions\Action::make('start_leaderboard')
                    ->action(function() {
                        $leaderboadCode = $this->getOwnerRecord()->code;

                        $leaderboardStartUrl = config('app.api_url') . '/api/v1/leaderboards/initialize/' . $leaderboadCode;

                        $res = Http::withHeaders([
                            'token' => config('app.api_admin_token')
                        ])->get($leaderboardStartUrl);

                        $leaderboardRecalculateUrl = config('app.api_url') . '/api/v1/leaderboards/calculate/' . $leaderboadCode;

                        $res = Http::withHeaders([
                            'token' => config('app.api_admin_token')
                        ])->get($leaderboardRecalculateUrl);

                        Notification::make()
                            ->title('Leaderboard started successfully!')
                            ->info()
                            ->send();
                    })
                    ->visible(function() {
                        $leaderboadCode = $this->getOwnerRecord()->code;

                        $runningLeaderboard = LeaderboardRun::where('code', $leaderboadCode)
                            ->where("status", "running")
                            ->first();

                        return !$runningLeaderboard;
                    })
                    ->color('info'),

                Tables\Actions\Action::make('recalculate_leaderboard')
                    ->action(function() {
                        $leaderboadCode = $this->getOwnerRecord()->code;

                        $leaderboardRecalculateUrl = config('app.api_url') . '/api/v1/leaderboards/calculate/' . $leaderboadCode;

                        $res = Http::withHeaders([
                            'token' => config('app.api_admin_token')
                        ])->get($leaderboardRecalculateUrl);

                        Notification::make()
                            ->title('Leaderboard calculated successfully!')
                            ->success()
                            ->send();
                    })
                    ->visible(function() {
                        $leaderboadCode = $this->getOwnerRecord()->code;

                        $runningLeaderboard = LeaderboardRun::where('code', $leaderboadCode)
                            ->where("status", "running")
                            ->first();

                        return $runningLeaderboard;
                    })
                    ->color('success'),

                Tables\Actions\Action::make('end_leaderboard')
                    ->action(function() {
                        $leaderboadCode = $this->getOwnerRecord()->code;

                        $leaderboardEndUrl = config('app.api_url') . '/api/v1/leaderboards/end/' . $leaderboadCode;

                        $res = Http::withHeaders([
                            'token' => config('app.api_admin_token')
                        ])->get($leaderboardEndUrl);

                        Notification::make()
                            ->title('Leaderboard ended successfully!')
                            ->danger()
                            ->send();
                    })
                    ->visible(function() {
                        $leaderboadCode = $this->getOwnerRecord()->code;

                        $runningLeaderboard = LeaderboardRun::where('code', $leaderboadCode)
                            ->where("status", "running")
                            ->first();

                        return $runningLeaderboard;
                    })
                    ->color('danger'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([]);
    }
}
