<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?int $navigationSort = 1;
    protected static ?string $navigationGroup = "Super Admin Control";
    protected static ?string $navigationLabel = 'Admin Users';
    protected static ?string $navigationIcon = 'heroicon-o-user-plus';
    protected static ?string $modelLabel = 'Admin User';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make('roles')
                    ->relationship('roles', 'name')
                    ->multiple()
                    ->preload()
                    ->searchable()
                    ->columnSpanFull(),
                // Forms\Components\DateTimePicker::make('email_verified_at'),
                Forms\Components\TextInput::make('password')
                    ->hintIcon('heroicon-o-lock-closed')
                    ->hintIconTooltip('Leave blank if you do not want to change the password')
                    ->password()
                    ->revealable()
                    ->maxLength(255),
                Forms\Components\TextInput::make('password_confirmation')
                    ->hintIcon('heroicon-o-lock-closed')
                    ->hintIconTooltip('Leave blank if you do not want to change the password')
                    ->password()
                    ->same('password')
                    ->revealable()
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('roles.name'),
                Tables\Columns\TextColumn::make('email')
                    ->searchable(),
                // Tables\Columns\TextColumn::make('email_verified_at')
                //     ->dateTime()
                //     ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->label("")->tooltip("Edit")->size("xl")
                    ->mutateFormDataUsing(function ($data) {
                        if (isset($data['password']) && $data['password'] != null) {
                            $data['password'] = Hash::make($data['password']);
                        } else {
                            unset($data['password']);
                        }
                        return $data;
                    })->extraModalFooterActions(fn (): array => [
                        Tables\Actions\Action::make('delete')->icon('heroicon-o-trash')->color('danger')
                            ->requiresConfirmation()
                            ->action(function (User $record) {
                                $record->delete();
                            })
                            ->cancelParentActions()

                    ]),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageUsers::route('/'),
        ];
    }
}
