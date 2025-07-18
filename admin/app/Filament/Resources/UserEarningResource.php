<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserEarningResource\Pages;
use App\Filament\Resources\UserEarningResource\RelationManagers;
use App\Models\UserEarning;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\HtmlString;
use Filament\Tables\Actions\ExportAction;
use App\Filament\Exports\UserEarningExporter;
use Filament\Actions\Exports\Enums\ExportFormat;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserEarningResource extends Resource
{
    protected static ?string $model             = UserEarning::class;
    protected static ?string $navigationIcon    = 'heroicon-o-user-plus';
    protected static ?string $navigationLabel   = 'User Cashback Earnings Report';
    protected static ?string $navigationGroup   = 'Reports & Logs';
    protected static ?int $navigationSort       = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('user_id')
                    ->required()
                    ->label("User Id")
                    ->numeric()
                    ->default(0),

                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),

                Forms\Components\TextInput::make('email')
                    ->email()
                    ->maxLength(255),

                Forms\Components\TextInput::make('provider_type')
                    ->label("Provider Type")
                    ->maxLength(255),

                Forms\Components\TextInput::make('phone_no')
                    ->tel()
                    ->maxLength(255),

                Forms\Components\TextInput::make('active')
                    ->required(),

                Forms\Components\Toggle::make('banned')
                    ->required(),

                Forms\Components\TextInput::make('lang')
                    ->maxLength(255),

                Forms\Components\TextInput::make('pending_cashback')
                    ->required()
                    ->numeric()
                    ->default(0.00),

                Forms\Components\TextInput::make('confirmed_cashback')
                    ->required()
                    ->numeric()
                    ->default(0.00),
                Forms\Components\TextInput::make('declined_cashback')
                    ->required()
                    ->numeric()
                    ->default(0.00),
                Forms\Components\TextInput::make('available_cashback')
                    ->required()
                    ->numeric()
                    ->default(0.00),
                Forms\Components\TextInput::make('pending_bonus')
                    ->required()
                    ->numeric()
                    ->default(0.00),
                Forms\Components\TextInput::make('confirmed_bonus')
                    ->required()
                    ->numeric()
                    ->default(0.00),
                Forms\Components\TextInput::make('declined_bonus')
                    ->required()
                    ->numeric()
                    ->default(0.00),
                Forms\Components\TextInput::make('available_bonus')
                    ->required()
                    ->numeric()
                    ->default(0.00),
                Forms\Components\TextInput::make('pending_referral')
                    ->required()
                    ->numeric()
                    ->default(0.00),
                Forms\Components\TextInput::make('confirmed_referral')
                    ->required()
                    ->numeric()
                    ->default(0.00),
                Forms\Components\TextInput::make('declined_referral')
                    ->required()
                    ->numeric()
                    ->default(0.00),
                Forms\Components\TextInput::make('available_referral')
                    ->required()
                    ->numeric()
                    ->default(0.00),
                Forms\Components\TextInput::make('paid_cashback')
                    ->required()
                    ->numeric()
                    ->default(0),
                Forms\Components\TextInput::make('paid_total')
                    ->required()
                    ->numeric()
                    ->default(0),
                Forms\Components\TextInput::make('paid_reward')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('user_id', 'desc')
            ->columns([

                Tables\Columns\TextColumn::make('user_id')
                    ->label("User Id")
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->description(fn($record) => $record->email),

                Tables\Columns\TextColumn::make('provider_type')
                    ->label("Provider Type")
                    ->searchable(),

                Tables\Columns\TextColumn::make('active'),

                Tables\Columns\IconColumn::make('banned')
                    ->boolean(),

                Tables\Columns\TextColumn::make('pending_cashback')
                    ->label(new HtmlString('<div style="width:70px; text-align:left; white-space:normal;">Pending<br>Cashback</div>'))
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('confirmed_cashback')
                    ->numeric()
                    ->label(new HtmlString('<div style="width:70px; text-align:left; white-space:normal;">Confirmed<br>Cashback</div>'))
                    ->sortable(),

            ])
            ->filters([])
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),
            ])
            ->headerActions([
             
            ])
            ->bulkActions([]);
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
            'index' => Pages\ListUserEarnings::route('/'),
            // 'create' => Pages\CreateUserEarning::route('/create'),
            // 'edit' => Pages\EditUserEarning::route('/{record}/edit'),
        ];
    }
}
