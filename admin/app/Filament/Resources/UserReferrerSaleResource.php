<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserReferrerSaleResource\Pages;
use App\Filament\Resources\UserReferrerSaleResource\RelationManagers;
use App\Models\UserReferrerSale;
use App\Models\User;
use App\Models\Store;
use App\Models\AppUser;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\HtmlString;


class UserReferrerSaleResource extends Resource
{
    protected static ?string $model             = UserReferrerSale::class;
    protected static ?string $modelLabel        = "Referral Transactions";
    protected static ?int $navigationSort       = 3;
    protected static ?string $navigationGroup   = "Sales & Cashback";
    protected static ?string $navigationIcon    = 'heroicon-o-banknotes';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Section::make('Network Sale Transactions')
                    ->description('General sales transaction fields')
                    ->schema([

                        Forms\Components\TextInput::make('sales_id')
                            ->required()
                            ->label('Sales ID')
                            ->numeric()
                            ->disabled(),

                        Forms\Components\Select::make('user_id')
                            ->label('User')
                            ->options(AppUser::pluck('email', 'id'))
                            ->searchable()
                            ->disabledon('edit')
                            ->preload()
                            ->required(),

                        Forms\Components\Select::make('shopper_id')
                            ->label('Shopper')
                            ->options(AppUser::pluck('email', 'id'))
                            ->searchable()
                            ->disabledon('edit')
                            ->preload()
                            ->required(),

                        Forms\Components\TextInput::make('order_amount')
                            ->label('Order Amount')
                            ->required()
                            ->numeric(),

                        Forms\Components\DateTimePicker::make('transaction_time')
                            ->native(false)
                            ->prefixicon('heroicon-o-calendar')
                            ->label('Transaction Time')
                            ->required(),

                        Forms\Components\TextInput::make('admin_note')
                            ->label('Admin Note')
                            ->maxLength(500),

                    ])->columnSpan(2),

                Forms\Components\Section::make('Additional Information')
                    ->description('Additional Transaction Information')
                    ->schema([

                        Forms\Components\Select::make('store_id')
                            ->label('Store')
                            ->options(Store::pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->disabledon('edit')
                            ->required(),

                        Forms\Components\TextInput::make('referral_amount')
                            ->required()
                            ->label('Referral Amount')
                            ->numeric(),

                        Forms\Components\TextInput::make('currency')
                            ->required()
                            ->maxLength(3),

                        Forms\Components\Radio::make('status')
                            ->options([
                                'pending'   => 'Pending',
                                'confirmed' => 'Confirmed',
                                'declined'  => 'Declined',
                            ])
                            ->default('pending')
                            ->inline(true)
                            ->inlinelabel(false)
                            ->required(),

                        Forms\Components\Toggle::make('mail_sent')
                            ->label('Mail Sent')
                            ->default(false)
                            ->required(),

                    ])->columnSpan(2)

            ])->columns(4);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                Tables\Columns\TextColumn::make('sales_id')
                    ->numeric()
                    ->label('Sales ID')
                    ->sortable(),

                Tables\Columns\TextColumn::make('user.email')
                    ->limit(20)
                    ->tooltip(fn($state) => $state)
                    ->label('User')
                    ->searchable(),

                Tables\Columns\TextColumn::make('shopper.email')
                    ->tooltip(fn($state) => $state)
                    ->limit(20)
                    ->label('Shopper')
                    ->searchable(),

                Tables\Columns\TextColumn::make('store.name')
                    ->label('Store')
                    ->searchable(),

                Tables\Columns\TextColumn::make('referral_amount')
                    ->label(new HtmlString('<div style="width:60px; text-align:left; white-space:normal;">Referral<br>Amount</div>'))
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('updated_at')
                    ->date()
                    ->sortable()
                    ->tooltip(fn($state) => $state)
                    ->toggleable(isToggledHiddenByDefault: false),

                Tables\Columns\SelectColumn::make('status')
                    ->options([
                        'pending'   => 'Pending',
                        'confirmed' => 'Confirmed',
                        'declined'  => 'Declined',
                    ])
                    ->extraAttributes([
                        'class' => 'min-w-[150px]',
                        'style' => 'width: 150px; min-width: 150px;'
                    ])
                    ->alignEnd()
                    ->selectablePlaceholder(false),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

            ])
            ->filters([

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending'   => 'Pending',
                        'confirmed' => 'Confirmed',
                        'declined'  => 'Declined',
                    ])
                    ->selectablePlaceholder(false)
                    ->label('Filter by Status')
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('store_id')
                    ->options(Store::pluck('name', 'id'))
                    ->label('Filter by Store')
                    ->selectablePlaceholder(false)
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('user_id')
                    ->options(AppUser::pluck('email', 'id'))
                    ->label('Filter by User')
                    ->selectablePlaceholder(false)
                    ->preload()
                    ->searchable(),

                Tables\Filters\SelectFilter::make('shopper_id')
                    ->options(AppUser::pluck('email', 'id'))
                    ->label('Filter by Shopper')
                    ->selectablePlaceholder(false)
                    ->preload()
                    ->searchable(),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label("")->tooltip('Edit')->size("xl"),
                Tables\Actions\ViewAction::make()->label("")->tooltip('View')->size("xl"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),

                Tables\Actions\BulkAction::make('change_status')
                    ->label('Change Status')
                    ->modalWidth('lg')
                    ->form([
                        Forms\Components\Select::make('status')
                            ->label('Select Status')
                            ->options([
                                'pending'   => 'Pending',
                                'confirmed' => 'Confirmed',
                                'declined'  => 'Declined',
                            ])
                            ->required(),
                    ])
                    ->action(function (Collection $records, array $data) {
                        UserReferrerSale::whereIn('id', $records->pluck('id'))->update(['status' => $data['status']]);
                    })
                    ->deselectRecordsAfterCompletion()
                    ->button(),
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
            'index' => Pages\ListUserReferrerSales::route('/'),
            'create' => Pages\CreateUserReferrerSale::route('/create'),
            'edit' => Pages\EditUserReferrerSale::route('/{record}/edit'),
        ];
    }
}
