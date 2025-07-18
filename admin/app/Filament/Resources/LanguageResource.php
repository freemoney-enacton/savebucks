<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LanguageResource\Pages;
use App\Filament\Resources\LanguageResource\RelationManagers;
use App\Jobs\GenerateSettingsConfig;
use App\Models\Language;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Http;

class LanguageResource extends Resource
{
    protected static ?string $model = Language::class;

    protected static ?int $navigationSort       = 5;
    protected static ?string $navigationGroup   = "Settings";
    protected static ?string $navigationLabel   = 'Languages';
    protected static ?string $navigationIcon    = 'heroicon-o-language';
    protected static ?string $modelLabel        = 'Language';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('code')
                    ->required()
                    ->maxLength(4),
                Forms\Components\FileUpload::make('flag')
                    ->image()
                    ->disk('frontend'),
                Forms\Components\Toggle::make('is_enabled')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\ImageColumn::make('flag')
                    ->size(30)  
                    ->grow(false)              
                    ->label(''),

                Tables\Columns\TextColumn::make('name') 
                ->grow(false)                              
                    ->searchable(),

                Tables\Columns\TextColumn::make('code')
                    ->searchable(),

                Tables\Columns\ToggleColumn::make('is_enabled')
                    ->label('Enabled'),

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
                Tables\Filters\TernaryFilter::make('is_enabled')
                    ->label('Enabled')
            ])
            ->actions([

                Tables\Actions\EditAction::make()
                    ->mutateRecordDataUsing(function (array $data): array {

                        if (isset($data['flag'])) {
                            $data['flag'] = pathinfo(parse_url($data['flag'], PHP_URL_PATH), PATHINFO_BASENAME);
                        }
                        return $data;

                    })
                    ->mutateFormDataUsing(function (array $data): array {

                        if (isset($data['flag'])) {
                            $filename = $data['flag'];
                            $data['flag'] =  \Illuminate\Support\Facades\Storage::disk('frontend')->url($filename);
                        }
                        return $data;
                    })
                    ->after(function () {

                        GenerateSettingsConfig::dispatch();
                        Http::get(config('app.api_url') . '/api/v1/cache/settings');

                    })->label('')->tooltip('Edit')->size('xl'),

                Tables\Actions\DeleteAction::make()->label('')->tooltip('View')->size('xl'),
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
            'index' => Pages\ManageLanguages::route('/'),
        ];
    }
}
