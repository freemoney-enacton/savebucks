<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactFormEntryResource\Pages;
use App\Filament\Resources\ContactFormEntryResource\RelationManagers;
use App\Models\ContactFormEntry;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ContactFormEntryResource extends Resource
{
    protected static ?string $model = ContactFormEntry::class;


    protected static ?int $navigationSort = 5;
    protected static ?string $navigationGroup = "Reports & Logs";
    protected static ?string $navigationLabel = 'Contact Form Entries';
    protected static ?string $navigationIcon = 'heroicon-o-bars-arrow-up';
    protected static ?string $modelLabel = 'Contact Form Entries';

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
                Forms\Components\TextInput::make('reason')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('message')
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('reason')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make()->size("xl")->label("")->tooltip("View"),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageContactFormEntries::route('/'),
        ];
    }
}
