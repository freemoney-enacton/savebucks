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

class ClickResource extends Resource
{
    protected static ?string $model = Click::class;
    protected static ?int $navigationSort       = 2;
    protected static ?string $navigationGroup   = "Logs & Reports";
    protected static ?string $navigationLabel   = 'Users Clicks';
    protected static ?string $navigationIcon    = 'heroicon-o-cursor-arrow-rays';
    protected static ?string $modelLabel        = 'User Clicks';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                  Forms\Components\Section::make('User click information')
                    ->columns(2)
                    ->schema([

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
                            ->label("Affiliate Link"),

                        Forms\Components\Select::make('affiliate_id')
                            ->label('affiliate')
                            ->relationship('affiliate', 'name')
                            ->preload()
                            ->searchable()
                            ->required()                            
                            ->label("Affiliate"),

                        Forms\Components\TextInput::make('click_code')
                            ->required()
                            ->maxLength(255)
                            ->label("Click Code"),

                        Forms\Components\TextInput::make('ip_address')
                            ->required()
                            ->maxLength(255)
                            ->label("IP Address"),

                        Forms\Components\TextInput::make('user_agent')
                            ->required()
                            ->maxLength(1000)
                            ->label("User Agent"),

                        Forms\Components\TextInput::make('referrer')
                            ->maxLength(255)
                            ->label("Referrer"),

                        Forms\Components\TextInput::make('country')
                            ->maxLength(255)
                            ->label("Country"),

                        Forms\Components\TextInput::make('city')
                            ->maxLength(255)
                            ->label("City"),

                        Forms\Components\TextInput::make('device_type')
                            ->maxLength(255)
                            ->label("Device Type"),

                        Forms\Components\TextInput::make('sub1')
                            ->maxLength(255)
                            ->label("Sub 1"),

                        Forms\Components\TextInput::make('sub2')
                            ->maxLength(255)
                            ->label("Sub 2"),

                        Forms\Components\TextInput::make('sub3')
                            ->maxLength(255)
                            ->label("Sub 3"),

                        Forms\Components\Toggle::make('is_converted')
                            ->required()
                            ->default(false)
                            ->label("Is Converted"),

                        Forms\Components\DateTimePicker::make('clicked_at')
                            ->required()
                            ->native(false)
                            ->prefixIcon('heroicon-m-calendar')
                            ->label("Clicked At"),


                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
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
                    
                Tables\Columns\TextColumn::make('affiliate.name')
                    ->numeric()
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('click_code')
                    ->searchable(),

                // Tables\Columns\TextColumn::make('ip_address')
                //     ->searchable(),
                
                Tables\Columns\IconColumn::make('is_converted')
                    ->boolean(),

                Tables\Columns\TextColumn::make('clicked_at')
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
                    ->relationship('affiliate', 'name')
                    ->searchable()
                    ->preload(),
                
                Tables\Filters\TernaryFilter::make('is_converted')
                 ->label("Is Converted")
                 ->placeholder("All"),
               
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
