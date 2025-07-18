<?php

namespace App\Filament\Affiliate\Resources\AffiliateResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Filament\Affiliate\Resources\PayoutResource;

class PayoutsRelationManager extends RelationManager
{
    protected static string $relationship = 'payouts';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('affiliate_id')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('affiliate_id')
            ->columns([

                // Tables\Columns\TextColumn::make('affiliate_id'),

                Tables\Columns\TextColumn::make('requested_amount')
                    ->searchable()
                    ->money(config('freemoney.default.default_currency'))
                    ->label('Amount')
                    ->sortable(),               

                Tables\Columns\TextColumn::make('payment_method')
                    ->label('Payment Method')
                    ->searchable(),

                Tables\Columns\TextColumn::make('transaction_id')
                    ->label('Transaction ID')
                    ->searchable(),

                Tables\Columns\TextColumn::make('paid_at')
                    ->label('Paid At')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn($state) => ucfirst($state))
                    ->color(fn($state) => match ($state) {                    
                       'pending'     => 'warning', 
                       'processing' => 'info', 
                       'paid'       => 'success', 
                       'rejected'  => 'danger',
                        default    => "gray",
                    })
                    ->searchable(),
            ])
            ->filters([

                 Tables\Filters\SelectFilter::make('status')
                    ->label("Filter by Status")
                    ->options([
                       'pending'    => 'Pending', 
                       'processing' => 'Processing', 
                       'paid'       => 'Paid', 
                       'rejected'   => 'Rejected',
                    ]),

            ])
            ->headerActions([
                // Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                // Tables\Actions\EditAction::make(),
                // Tables\Actions\DeleteAction::make(),
                Tables\Actions\Action::make('view_record')
                    ->label('')
                    ->tooltip('View Payout')
                    ->icon('heroicon-o-eye')  // Example: eye icon
                    ->url(fn ($record) => PayoutResource::getUrl('view', ['record' => $record->getKey()]))
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
