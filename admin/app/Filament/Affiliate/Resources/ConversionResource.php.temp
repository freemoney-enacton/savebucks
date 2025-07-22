<?php

namespace App\Filament\Affiliate\Resources;

use App\Filament\Affiliate\Resources\ConversionResource\Pages;
use App\Filament\Affiliate\Resources\ConversionResource\RelationManagers;
use App\Models\Affiliate\Conversion;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class ConversionResource extends Resource
{
    protected static ?string $model = Conversion::class;
    protected static ?string $navigationIcon = 'heroicon-o-check-badge';
    protected static ?string $navigationGroup  = "Payout";
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Basic Information')
                    ->description("Basic Conversion Information")
                    ->columns(2)
                    ->schema([

                    Forms\Components\Select::make('campaign_id')
                        ->label('Campaign')
                        ->relationship('campaign', 'name')
                        ->preload()
                        ->searchable()
                        ->reactive()
                        ->afterStateUpdated(fn (callable $set) => $set('campaign_goal_id', null))
                        ->required(),

                    Forms\Components\Select::make('postback_log_id')
                        ->label('Postback Log')
                        ->relationship('postbackLog', 'id')
                        ->preload()
                        ->searchable()
                        ->required(),                  

                    Forms\Components\TextInput::make('click_code')
                        ->required()
                        ->maxLength(255),

                    Forms\Components\Select::make('campaign_goal_id')
                        ->label('Campaign Goal')
                        ->options(function (callable $get) {
                            $campaignId = $get('campaign_id');

                            if (!$campaignId) {
                                return [];
                            }

                            return \App\Models\Affiliate\CampaignGoal::where('status', 'active')
                                ->where('campaign_id', $campaignId)
                                ->pluck('name', 'id');
                        })
                        ->preload()
                        ->searchable()
                        ->reactive()
                        ->disabled(fn (callable $get) => !$get('campaign_id')),

                    Forms\Components\Select::make('affiliate_id')
                        ->label('affiliate')
                        ->relationship('affiliate', 'name')
                        ->preload()
                        ->searchable()
                        ->required()                            
                        ->label("Affiliate"),

                    Forms\Components\TextInput::make('transaction_id')
                        ->required()
                        ->maxLength(255)
                        ->label("Transaction Id"),

                    Forms\Components\TextInput::make('conversion_value')
                        ->required()
                        ->numeric()
                        ->label("Conversion Value"),

                    Forms\Components\TextInput::make('commission')
                        ->required()
                        ->numeric()
                        ->label("Commission"),

                    Forms\Components\TextInput::make('user_earned')
                        ->numeric()
                        ->label('User Earned')
                        ->default(0),

                    Forms\Components\TextInput::make('sub1')
                        ->maxLength(255)
                        ->label("Sub 1"),

                    Forms\Components\TextInput::make('sub2')
                        ->maxLength(255),

                    Forms\Components\TextInput::make('sub3')
                        ->maxLength(255),

                    Forms\Components\Radio::make('status')
                        ->options([
                            'pending'   => 'Pending',
                            'approved'  => 'Approved',
                            'declined'  => 'Declined',
                            'paid'      => 'Paid',
                            'untracked' => 'Untracked',
                        ])
                        ->required()
                        ->inline()
                        ->inlineLabel(false)
                        ->default('pending'),            

                    Forms\Components\Select::make('payout_id')
                        ->label('Payout Id')
                        ->relationship('payout', 'id')
                        ->preload()
                        ->searchable()
                        ->required(),                 

                    Forms\Components\TextInput::make('admin_notes')
                        ->label("Admin Notes")
                        ->maxLength(500),
                        
                    Forms\Components\DateTimePicker::make('converted_at')
                        ->label("Converted At")
                        ->required()
                        ->native(false)
                        ->prefixIcon('heroicon-o-calendar-days'),
                   

                ])

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('campaign.name')
                    ->label('Campaign')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('click_code')
                    ->label('Click Code')
                    ->searchable(),

                Tables\Columns\TextColumn::make('affiliate.name')
                    ->label('Affiliate')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('transaction_id')
                    ->label("Transaction Id")
                    ->searchable(),

                Tables\Columns\TextColumn::make('commission')
                    ->numeric()
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('user_earned')
                    ->numeric()
                    ->label('User Earned')
                    ->sortable(),

                // Tables\Columns\TextColumn::make('status')
                //     ->formatStateUsing(fn($state) => Str::ucfirst($state))
                //     ->badge()
                //     ->color(fn ($state): string => match ($state) {
                //         'pending'   => 'warning',
                //         'approved'  => 'info',
                //         'declined'  => 'danger',
                //         'paid'      => 'success',
                //         default     => 'gray',
                //     })
                //     ->searchable(),

                Tables\Columns\SelectColumn::make('status')
                    ->searchable()
                    ->options([
                        'pending'   => 'Pending',
                        'approved'  => 'Approved',
                        'declined'  => 'Declined',
                        'paid'      => 'Paid',
                        'untracked' => 'Untracked',
                    ]),

                Tables\Columns\TextColumn::make('payout_id')
                    ->label("Payout Id")
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('converted_at')
                    ->label("Converted At")
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending'   => 'Pending',
                        'approved'  => 'Approved',
                        'declined'  => 'Declined',
                        'paid'      => 'Paid',
                        'untracked' => 'Untracked',
                    ])
                    ->preload()
                    ->searchable()
                    ->label('Status'),

                Tables\Filters\SelectFilter::make('campaign_id')
                    ->relationship('campaign', 'name')
                    ->preload()
                    ->searchable()
                    ->label('Filter By Campaign'),

                Tables\Filters\SelectFilter::make('affiliate_id')
                    ->relationship('affiliate', 'name')
                    ->preload()
                    ->searchable()
                    ->label('Filter By Affiliate'),

            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip("View")->size("lg"),
                // Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("lg"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
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
            'index' => Pages\ListConversions::route('/'),
            'create' => Pages\CreateConversion::route('/create'),
            'view' => Pages\ViewConversion::route('/{record}'),
            'edit' => Pages\EditConversion::route('/{record}/edit'),
        ];
    }
}
