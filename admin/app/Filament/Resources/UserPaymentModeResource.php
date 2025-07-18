<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserPaymentModeResource\Pages;
use App\Filament\Resources\UserPaymentModeResource\RelationManagers;
use App\Models\FrontUser;
use App\Models\PaymentType;
use App\Models\UserPaymentMode;
use Filament\Forms;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use ValentinMorice\FilamentJsonColumn\FilamentJsonColumn;

class UserPaymentModeResource extends Resource
{
    protected static ?string $model = UserPaymentMode::class;

    protected static ?int $navigationSort = 6;
    protected static ?string $navigationGroup = "Manage Users";
    protected static ?string $navigationLabel = 'Users Payout Modes';
    protected static ?string $navigationIcon = 'heroicon-o-user';
    protected static ?string $modelLabel = 'Users Payout Modes';

    protected static bool $shouldRegisterNavigation = false;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('user_id')->options(FrontUser::where('status', 'active')->pluck('name', 'id')->toArray())->required(),
                TextInput::make('name'),
                Select::make('payment_method_code')->options(PaymentType::where('enabled', 1)->pluck('code', 'code')->toArray()),
                TextInput::make('account'),
                FilamentJsonColumn::make('payment_inputs'),
                TextInput::make('verify_code')->required(),
                DatePicker::make('verified_at'),
                Textarea::make('admin_note'),
                Toggle::make('enabled')->default(1),

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name'),
                Tables\Columns\TextColumn::make('name'),
                Tables\Columns\TextColumn::make('payment_method_code'),
                Tables\Columns\ToggleColumn::make('enabled'),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
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
            'index' => Pages\ListUserPaymentModes::route('/'),
            'create' => Pages\CreateUserPaymentMode::route('/create'),
            'edit' => Pages\EditUserPaymentMode::route('/{record}/edit'),
        ];
    }
}
