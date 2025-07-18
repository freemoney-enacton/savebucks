<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NetworkRunResource\Pages;
use App\Filament\Resources\NetworkRunResource\RelationManagers;
use App\Models\NetworkRun;
use App\Models\AffiliateNetwork;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class NetworkRunResource extends Resource
{
    protected static ?string $model = NetworkRun::class;
    protected static ?string $navigationGroup  = 'Affiliate Networks';
    protected static ?int $navigationSort      =  3;
    protected static ?string $navigationIcon = 'heroicon-o-signal';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Network Run')
                    ->description('Fill out network run details')
                    ->schema([

                        Forms\Components\Radio::make('type')
                            ->options([
                                'campaign'      =>  'Campaign',
                                'coupon'        =>  'Coupon',
                                'sale'          =>  'Sale',
                                'merchant'      =>  'Merchant',
                                'campaign_rate' =>  'Campaign Rate',
                            ])
                            ->inline()
                            ->columnSpanFull()
                            ->inlineLabel(false)
                            ->required(),

                        Forms\Components\TextInput::make('network')
                            ->required()
                            ->maxLength(50),

                        Forms\Components\Select::make('network_id')
                            ->options(AffiliateNetwork::pluck('name', 'id'))
                            ->label('Network Id')
                            ->preload()
                            ->searchable(),

                        Forms\Components\Textarea::make('parameter')
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('entries')
                            ->numeric(),

                        Forms\Components\DateTimePicker::make('start_time')
                            ->label('Start Time')
                            ->native(false)
                            ->prefixicon('heroicon-o-calendar')
                            ->default(now()->format('Y-m-d H:i:s'))
                            ->required(),

                        Forms\Components\DateTimePicker::make('end_time')
                            ->label('End Time')
                            ->format('Y-m-d H:i:s')
                            ->prefixicon('heroicon-o-calendar')
                            ->native(false),

                    ])->columns(2)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('network')
                    ->label('Network')
                    ->searchable(),

                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->searchable()
                    ->color(fn(string $state): string => match ($state) {
                        'campaign'      => 'primary',
                        'coupon'        => 'info',
                        'sale'          => 'success',
                        'merchant'      => 'warning',
                        'campaign_rate' => 'danger',
                    }),

                Tables\Columns\TextColumn::make('entries')
                    ->numeric()
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('start_time')
                    ->label('Start Time')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('end_time')
                    ->dateTime()
                    ->label('End Time')
                    ->sortable(),
            ])
            ->filters([

                Tables\Filters\SelectFilter::make('network_id')
                    ->label('Network')
                    ->options(AffiliateNetwork::all()->pluck('name', 'id'))
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'campaign'      => 'Campaign',
                        'coupon'        => 'Coupon',
                        'sale'          => 'Sale',
                        'merchant'      => 'Merchant',
                        'campaign_rate' => 'Campaign Rate',
                    ])
                    ->selectablePlaceholder(false)
                    ->label('Filter by Type')
                    ->preload()
                    ->searchable(),

            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),

                Tables\Actions\BulkAction::make('change_type')
                    ->label('Change Type')
                    ->modalWidth('lg')
                    ->form([
                        Forms\Components\Select::make('type')
                            ->label('Select Type')
                            ->options([
                                'campaign'      => 'Campaign',
                                'coupon'        => 'Coupon',
                                'sale'          => 'Sale',
                                'merchant'      => 'Merchant',
                                'campaign_rate' => 'Campaign Rate',
                            ])
                            ->required(),
                    ])
                    ->action(function (Collection $records, array $data) {
                        NetworkRun::whereIn('id', $records->pluck('id'))->update(['type' => $data['type']]);
                    })
                    ->deselectRecordsAfterCompletion()
                    ->button(),

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
            'index' => Pages\ListNetworkRuns::route('/'),
            'create' => Pages\CreateNetworkRun::route('/create'),
            'edit' => Pages\EditNetworkRun::route('/{record}/edit'),
        ];
    }
}
