<?php

namespace App\Filament\Affiliate\Resources;

use App\Filament\Affiliate\Resources\ClickResource\Pages;
use App\Filament\Affiliate\Resources\ClickResource\RelationManagers;
use App\Models\Affiliate\Click;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use ValentinMorice\FilamentJsonColumn\JsonColumn;
use Carbon\Carbon;

class ClickResource extends Resource
{
    protected static ?string $model = Click::class;
    protected static ?int $navigationSort       = 2;
    protected static ?string $navigationGroup   = "Clicks & Conversions";
    protected static ?string $navigationLabel   = 'Users Clicks';
    protected static ?string $navigationIcon    = 'heroicon-o-cursor-arrow-rays';
    protected static ?string $modelLabel        = 'User Clicks';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Affiliate & Campaign Information')
                    ->columns(2)
                    ->schema([
                        Forms\Components\Select::make('affiliate_id')
                            ->label('Affiliate')
                            ->relationship('affiliate', 'email')
                            ->preload()
                            ->searchable()
                            ->required(),

                        Forms\Components\Select::make('campaign_id')
                            ->label('Campaign')
                            ->relationship('campaign', 'name')
                            ->preload()
                            ->searchable()
                            ->required(),

                        Forms\Components\Select::make('affiliate_link_id')
                            ->relationship('affiliateLink', 'destination_url')
                            ->preload()
                            ->searchable()
                            ->required()
                            ->label('Affiliate Link')
                            ->columnSpanFull(),

                        Forms\Components\DateTimePicker::make('clicked_at')
                            ->required()
                            ->native(false)
                            ->prefixIcon('heroicon-m-calendar')
                            ->label('Clicked At'),

                        Forms\Components\TextInput::make('click_code')
                            ->required()
                            ->maxLength(255)
                            ->label('Click Code'),

                        Forms\Components\Toggle::make('is_converted')
                            ->required()
                            ->default(false)
                            ->label('Is Converted'),
                    ])->columnSpan(2),

                
                Forms\Components\Section::make('Basic Information')
                    ->columns(2)
                    ->schema([
                        Forms\Components\TextInput::make('ip_address')
                            ->required()
                            ->maxLength(255)
                            ->label('IP Address'),

                        // Forms\Components\TextInput::make('country')
                        //     ->maxLength(255)
                        //     ->label('Country'),

                        // Forms\Components\TextInput::make('city')
                        //     ->maxLength(255)
                        //     ->label('City'),

                        Forms\Components\TextInput::make('device_type')
                            ->maxLength(255)
                            ->label('Device Type'),

                        // Forms\Components\TextInput::make('referrer')
                        //     ->maxLength(255)
                        //     ->label('Referrer'),

                        Forms\Components\TextInput::make('sub1')
                            ->maxLength(255)
                            ->label('Sub 1'),

                        Forms\Components\TextInput::make('sub2')
                            ->maxLength(255)
                            ->label('Sub 2'),

                        Forms\Components\TextInput::make('sub3')
                            ->maxLength(255)
                            ->label('Sub 3'),

                        Forms\Components\TextInput::make('user_agent')
                            ->required()
                            ->maxLength(1000)
                            ->label('User Agent')
                            ->columnSpanFull(),

                        JsonColumn::make('campaign_goals')->viewerOnly(),
                        
                    ])->columnSpan(2),

            ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('affiliate.name')
                    ->label('Affiliate')
                    ->description(fn($record) => $record->affiliate->email)
                    ->numeric()
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('campaign.name')
                    ->numeric()
                    ->searchable()
                    ->sortable(),

                // Tables\Columns\TextColumn::make('affiliate_link_id')
                //     ->numeric()
                //     ->sortable(),

                Tables\Columns\IconColumn::make('affiliateLink.destination_url')
                    ->label('Affiliate Url')
                    ->url(fn($record): string => $record->affiliateLink->destination_url)   
                    ->tooltip(fn($record): string => $record->affiliateLink->destination_url)       
                    ->openUrlInNewTab()
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->searchable(),                               

                Tables\Columns\TextColumn::make('click_code')
                    ->searchable(),

                // Tables\Columns\TextColumn::make('ip_address')
                //     ->searchable(),
                
                Tables\Columns\IconColumn::make('is_converted')
                    ->label('Is Converted')
                    ->boolean(),

                Tables\Columns\TextColumn::make('clicked_at')
                    ->label('Clicked At')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([

                Tables\Filters\SelectFilter::make('campaign_id')
                    ->label("Filter By Campaign")
                    ->relationship('campaign', 'name')
                    ->searchable()
                    ->preload(),

                Tables\Filters\SelectFilter::make('affiliate_id')
                    ->label("Filter By Affiliate")
                    ->relationship('affiliate', 'email')
                    ->searchable()
                    ->preload(),
                
                Tables\Filters\TernaryFilter::make('is_converted')
                    ->label("Is Converted")
                    ->trueLabel('Converted')
                    ->falseLabel('Not Converted')
                    ->placeholder("All"),

                Tables\Filters\Filter::make('clicked_at')
                    ->form([
                        Forms\Components\DatePicker::make('from')->native(false)->label("Click Date from")->columnSpan(1)->icon('heroicon-s-calendar'),
                        Forms\Components\DatePicker::make('until')->native(false)->label("Click Date To")->columnSpan(1)->icon('heroicon-s-calendar'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('clicked_at', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('clicked_at', '<=', $data['until']));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                
                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'Click Date from ' . Carbon::parse($data['from'])->toFormattedDateString();
                        }
                
                        if ($data['until'] ?? null) {
                            $indicators['until'] = 'Click Date To ' . Carbon::parse($data['until'])->toFormattedDateString();
                        }
                
                        return $indicators;
                }),
               
            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip("View")->size("lg"),
                // Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("lg"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Tables\Actions\DeleteBulkAction::make(),
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
            'index' => Pages\ListClicks::route('/'),
            'create' => Pages\CreateClick::route('/create'),
            'view' => Pages\ViewClick::route('/{record}'),
            'edit' => Pages\EditClick::route('/{record}/edit'),
        ];
    }
}
