<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserTaskUploadResource\Pages;
use App\Filament\Resources\UserTaskUploadResource\RelationManagers;
use App\Models\UserTaskUpload;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\ImageEntry;
use App\Models\AffiliateNetwork;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserTaskUploadResource extends Resource
{
    protected static ?string $model = UserTaskUpload::class;

    protected static ?string $navigationIcon    = 'heroicon-o-rectangle-stack';
    protected static ?int $navigationSort       = 4;
    protected static ?string $navigationGroup   = "Tasks & Survey Management";
    protected ?string $subheading               = 'Manage Offers here.';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make("Task Offer Upload")
                    ->schema([
                    
                    Forms\Components\TextInput::make('network')
                        ->required()
                        ->maxLength(255),

                    Forms\Components\TextInput::make('offer_id')
                        ->required()
                        ->label("Offer Id")
                        ->maxLength(255),

                    Forms\Components\TextInput::make('platform')
                        ->required()
                        ->maxLength(255),

                    Forms\Components\TextInput::make('task_offer_id')
                        ->label("Task Offer Id")
                        ->required()
                        ->maxLength(255),

                    Forms\Components\TextInput::make('user_id')
                        ->label("User Id")
                        ->required()
                        ->numeric(),

                    Forms\Components\TextInput::make('upload_path')
                        ->label("Uploaded Image")
                        ->required()
                        ->maxLength(1000),
                        
                ])->columns(2),

            ]);
    }


    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([

                Infolists\Components\Section::make('Details')
                    ->description('User task upload details')
                    ->schema([

                        TextEntry::make('network')
                            ->label('Network'),

                        TextEntry::make('platform')
                            ->label('Platform'),

                        TextEntry::make('offer_id')
                            ->label('Offer Id'),

                        TextEntry::make('task_offer_id')
                            ->label('Task Offer ID'),

                        TextEntry::make('created_at')
                            ->label('Created At')
                            ->dateTime(),

                        ImageEntry::make('upload_path')
                            ->label('Uploaded File')
                            ->columnSpanFull(),

                    ])->columns(2)

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordUrl("")
            ->columns([
                Tables\Columns\TextColumn::make('network')
                    ->searchable(),
                    
                Tables\Columns\TextColumn::make('offer_id')
                    ->label("Offer Id")
                    ->searchable(),

                Tables\Columns\TextColumn::make('platform')
                    ->searchable(),

                Tables\Columns\TextColumn::make('task_offer_id')
                    ->label("Task Offer Id")
                    ->searchable(),

                Tables\Columns\TextColumn::make('user_id')
                    ->label("User Id")
                    ->numeric()
                    ->sortable(),

                Tables\Columns\ImageColumn::make('upload_path')
                    ->label("Upload Image")
                    ->url(function ($record) {
                        return $record->upload_path;
                    })
                    ->openUrlInNewTab()
                    ->size(30),
                   
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

                // Tables\Filters\SelectFilter::make('network')
                // ->options(AffiliateNetwork::pluck('name', 'name'))
                // ->label('Filter by Network')
                // ->selectablePlaceholder(false)
                // ->preload()
                // ->query(function (Builder $query, array $data): Builder {
                //     // dd($data);
                //     if (isset($data['value']) && $data['value'] !== '') {
                //         return $query->where('network', $data['value']);
                //     }
            
                //     return $query;
                // })
                // ->searchable(),

            ])
            ->actions([
                // Tables\Actions\EditAction::make()->label("")->tooltip("Edit")->size("xl"),
                Tables\Actions\ViewAction::make()->label("")->tooltip("View")->size("xl"),
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
            'index' => Pages\ListUserTaskUploads::route('/'),
            'create' => Pages\CreateUserTaskUpload::route('/create'),
            'edit' => Pages\EditUserTaskUpload::route('/{record}/edit'),
        ];
    }
}
