<?php

namespace App\Filament\Affiliate\Resources\PayoutResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use ValentinMorice\FilamentJsonColumn\JsonColumn;
use Illuminate\Database\Eloquent\Model;



class PaymentLogsRelationManager extends RelationManager
{
    protected static string $relationship = 'paymentLogs';

    public function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Payout Log Details')
                    ->description("Payout Log Information")
                    ->columns(2)
                    ->schema([
               
                // Forms\Components\TextInput::make('id')
                //     ->required()
                //     ->maxLength(255),

                Forms\Components\TextInput::make('payment_id')
                    ->label("Payout Id")
                    ->required()
                    ->maxLength(255),

                Forms\Components\TextInput::make('request_type')
                    ->label("Request Type")
                    ->required()
                    ->maxLength(255),

                Forms\Components\Textarea::make('error_message')->label("Error Message"),

                Forms\Components\TextInput::make('paypal_batch_id')->label("Payment Batch Id"),
                
                Forms\Components\TextInput::make('ip_address')->label("IP Address"),

                Forms\Components\TextInput::make('status_code')
                    ->label("Status Code")
                    ->required()
                    ->maxLength(255), 
                    
                Forms\Components\TextInput::make('log_type')
                    ->label("Log Type")
                    ->required()
                    ->maxLength(255), 

                Forms\Components\Toggle::make('success'),

                JsonColumn::make('request_payload')
                    ->label('Request Payload')
                    ->viewerOnly(),                      
        
                JsonColumn::make('response_payload')
                    ->label('Response Payload')
                    ->viewerOnly(),

                ]),
                
                    
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            // ->recordTitleAttribute('payment_id')
            ->columns([
                // Tables\Columns\TextColumn::make('id'),
                Tables\Columns\TextColumn::make('payment_id')->label("Payment Id"),

                Tables\Columns\TextColumn::make('request_type')->label("Request Type")
                            ->formatStateUsing(fn (string $state): string => str_replace("_", " ", ucwords($state))),  

                Tables\Columns\IconColumn::make('success')->label("Success"),

                Tables\Columns\TextColumn::make('paypal_batch_id')->label("Payment Batch Id"),

                Tables\Columns\TextColumn::make('log_type')
                            ->label("Log Type")
                            ->formatStateUsing(fn (string $state): string => ucwords($state)),

                Tables\Columns\TextColumn::make('created_at'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                // Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                // Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make()->label("")->tooltip("View"),
                // Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function canViewForRecord(Model $ownerRecord, string $pageClass): bool
    {
        return $ownerRecord->payment_method === 'paypal';
    }
}
