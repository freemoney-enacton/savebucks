<?php

namespace App\Filament\Affiliate\Resources;

use App\Filament\Affiliate\Resources\ViewConversionResource\Pages;
use App\Filament\Affiliate\Resources\ViewConversionResource\RelationManagers;
use App\Models\Affiliate\ViewConversion;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class ViewConversionResource extends Resource
{
    protected static ?string $model             = ViewConversion::class;
    protected static ?string $navigationIcon    = 'heroicon-o-check-badge';
    protected static ?string $navigationGroup   = "Clicks & Conversions";
    protected static ?string $navigationLabel   = 'Conversions';
    protected static ?string $modelLabel        = 'Conversions';
    protected static ?int $navigationSort       = 3;

public static function form(Form $form): Form
{
    return $form
        ->schema([


            // Affiliate Information Section
            Forms\Components\Section::make('Affiliate Information')
                ->description('Information about the affiliate who generated this conversion')
                ->icon('heroicon-o-user-group')
                ->schema([
            
                    Forms\Components\TextInput::make('affiliate_id')
                        ->label('Affiliate ID')
                        ->numeric()
                        ->disabled(),
                    
                    Forms\Components\TextInput::make('affiliate_name')
                        ->label('Affiliate Name')
                        ->maxLength(255)
                        ->disabled(),                   
            
            
                    Forms\Components\TextInput::make('affiliate_email')
                        ->label('Affiliate Email')
                        ->email()
                        ->maxLength(255)
                        ->disabled(),
                    
                    Forms\Components\TextInput::make('affiliate_status')
                        ->label('Affiliate Status')
                        ->maxLength(255)
                        ->disabled(),
                        
                ])->columns(2)
                ->collapsible(),


            // Conversion Details Section
            Forms\Components\Section::make('Conversion Details')
                ->description('Information about the conversion transaction and its status')
                ->icon('heroicon-o-currency-dollar')
                ->schema([

                            Forms\Components\TextInput::make('transaction_id')
                                ->label('Transaction ID')                                
                                ->maxLength(255)
                                ->disabled(),

                            Forms\Components\TextInput::make('postback_log_id')
                                ->label('Postback Log ID')
                                ->maxLength(255)
                                ->disabled(),
                            
                            Forms\Components\TextInput::make('click_code')
                                ->label('Click Code')
                                ->maxLength(255)
                                ->disabled(),
                  
                            Forms\Components\TextInput::make('conversion_value')
                                ->label('Conversion Value')
                                ->prefix(config('freemoney.default.default_currency'))
                                ->numeric()
                                // ->prefix('$')
                                ->disabled(),
                            
                            Forms\Components\TextInput::make('commission')
                                ->label('Commission Amount')
                                ->prefix(config('freemoney.default.default_currency'))
                                ->numeric()                         
                                ->disabled(),
                            
                            Forms\Components\TextInput::make('conversion_status')
                                ->label('Conversion Status')
                                ->maxLength(255)
                                ->disabled(),
                  
                            Forms\Components\DateTimePicker::make('converted_at')
                                ->label('Converted At')
                                ->disabled(),
                            
                            Forms\Components\DateTimePicker::make('conversion_created_at')
                                ->label('Conversion Created At')
                                ->disabled(),                 
                    
             
                            Forms\Components\TextInput::make('conversion_sub1')
                                ->label('Conversion Sub 1')
                                ->maxLength(255)
                                ->disabled(),
                            
                            Forms\Components\TextInput::make('conversion_sub2')
                                ->label('Conversion Sub 2')
                                ->maxLength(255)
                                ->disabled(),
                            
                            Forms\Components\TextInput::make('conversion_sub3')
                                ->label('Conversion Sub 3')
                                ->maxLength(255)
                                ->disabled(),
                        // ]),
                    
                    // Forms\Components\Grid::make(2)
                    //     ->schema([
                            Forms\Components\TextInput::make('admin_notes')
                                ->label('Admin Notes')
                                ->maxLength(500)
                                ->columnSpanFull()
                                ->disabled(),
                            
                            Forms\Components\TextInput::make('payout_id')
                                ->label('Payout ID')
                                ->numeric()
                                ->disabled(),
                        // ]),
                ])->columns(2)
                ->collapsible(),

            // Campaign & Goal Information Section
            Forms\Components\Section::make('Campaign & Goal Information')
                ->description('Details about the campaign and goal associated with this conversion')
                ->icon('heroicon-o-megaphone')
                ->schema([
                
                            Forms\Components\TextInput::make('campaign_id')
                                ->label('Campaign ID')
                                ->numeric()
                                ->disabled(),
                            
                            Forms\Components\TextInput::make('campaign_name')
                                ->label('Campaign Name')
                                ->maxLength(255)
                                ->disabled(),
               
                    
               
                            Forms\Components\TextInput::make('campaign_type')
                                ->label('Campaign Type')
                                ->maxLength(255)
                                ->disabled(),
                            
                            Forms\Components\TextInput::make('campaign_status')
                                ->label('Campaign Status')
                                ->maxLength(255)
                                ->disabled(),                
    
                 
                            Forms\Components\TextInput::make('campaign_goal_id')
                                ->label('Campaign Goal ID')
                                ->numeric()
                                ->disabled(),
                            
                            Forms\Components\TextInput::make('goal_name')
                                ->label('Goal Name')
                                ->maxLength(255)
                                ->disabled(),
                      
            
                            Forms\Components\TextInput::make('commission_type')
                                ->label('Commission Type')
                                ->maxLength(255)
                                ->disabled(),
                            
                            Forms\Components\TextInput::make('goal_commission_amount')
                                ->label('Goal Commission Amount')
                                ->prefix(config('freemoney.default.default_currency'))
                                ->numeric()                   
                                ->disabled(),
                            
                            Forms\Components\TextInput::make('goal_status')
                                ->label('Goal Status')
                                ->maxLength(255)
                                ->disabled(),
                     
                    
                    Forms\Components\TextInput::make('tracking_code')
                        ->label('Tracking Code')
                        ->maxLength(10)
                        ->disabled(),
                ])->columns(2)
                ->collapsible(),

            // Affiliate Link Information Section
            Forms\Components\Section::make('Affiliate Link Information')
                ->description('Details about the affiliate link used for this conversion')
                ->icon('heroicon-o-link')
                ->schema([
                   
                    Forms\Components\TextInput::make('affiliate_link_id')
                        ->label('Affiliate Link ID')
                        ->numeric()
                        ->disabled(),
                    
                    Forms\Components\TextInput::make('link_slug')
                        ->label('Link Slug')
                        ->maxLength(255)
                        ->disabled(),
                     
                    Forms\Components\TextInput::make('destination_url')
                        ->label('Destination URL')
                        ->maxLength(1000)
                        ->columnSpanFull()
                        ->disabled(),                    
                  
                    Forms\Components\TextInput::make('link_status')
                        ->label('Link Status')
                        ->maxLength(255)
                        ->disabled(),
            
            
                    Forms\Components\TextInput::make('link_sub1')
                        ->label('Link Sub 1')
                        ->maxLength(255)
                        ->disabled(),
                    
                    Forms\Components\TextInput::make('link_sub2')
                        ->label('Link Sub 2')
                        ->maxLength(255)
                        ->disabled(),
                    
                    Forms\Components\TextInput::make('link_sub3')
                        ->label('Link Sub 3')
                        ->maxLength(255)
                        ->disabled(),
                
                ])->columns(2)
                ->collapsible(),

            // Click Information Section
            Forms\Components\Section::make('Click Information')
                ->description('Details about the click that led to this conversion')
                ->icon('heroicon-o-cursor-arrow-rays')
                ->schema([
                   
                    Forms\Components\TextInput::make('click_id')
                        ->label('Click ID')
                        ->numeric()
                        ->disabled(),
                    
                    Forms\Components\DateTimePicker::make('clicked_at')
                        ->label('Clicked At')
                        ->disabled(),
                           
                    Forms\Components\TextInput::make('ip_address')
                        ->label('IP Address')
                        ->maxLength(255)
                        ->disabled(),
                    
                    Forms\Components\TextInput::make('country')
                        ->label('Country')
                        ->maxLength(255)
                        ->disabled(),
                    
                    Forms\Components\TextInput::make('city')
                        ->label('City')
                        ->maxLength(255)
                        ->disabled(),              
            
                    Forms\Components\TextInput::make('device_type')
                        ->label('Device Type')
                        ->maxLength(255)
                        ->disabled(),
                    
                    Forms\Components\TextInput::make('referrer')
                        ->label('Referrer')
                        ->maxLength(255)
                        ->disabled(),
                
                    Forms\Components\TextInput::make('click_sub1')
                        ->label('Click Sub 1')
                        ->maxLength(255)
                        ->disabled(),
                    
                    Forms\Components\TextInput::make('click_sub2')
                        ->label('Click Sub 2')
                        ->maxLength(255)
                        ->disabled(),
                    
                    Forms\Components\TextInput::make('click_sub3')
                        ->label('Click Sub 3')
                        ->maxLength(255)
                        ->disabled(),
                       
                ])->columns(2)
                ->collapsible(),

            // Analytics & Metrics Section
            Forms\Components\Section::make('Analytics & Metrics')
                ->description('Conversion analytics and performance metrics')
                ->icon('heroicon-o-chart-bar')
                ->schema([
                    Forms\Components\Grid::make(2)
                        ->schema([
                            Forms\Components\TextInput::make('hours_to_conversion')
                                ->label('Hours To Conversion')
                                ->numeric()
                                ->suffix('hours')
                                ->disabled(),
                            
                            Forms\Components\DateTimePicker::make('conversion_year')
                                ->label('Conversion Year')
                                ->disabled(),
                        ]),
                ])
                ->collapsible(),
        ]);
}

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('converted_at', 'desc') 
            ->columns([            

                // Tables\Columns\TextColumn::make('conversion_id')
                //     ->searchable()
                //     ->label('ID')
                //     ->numeric()
                //     ->sortable(),

                Tables\Columns\TextColumn::make('affiliate_name')
                    ->description(fn($record) => $record->affiliate->email)
                    ->label('Affiliate Name')
                    ->searchable(),

                Tables\Columns\TextColumn::make('transaction_id')
                    ->label('Transaction ID')
                    ->limit(18)
                    ->tooltip(fn($record)=>$record->transaction_id)
                    ->searchable(),   
                    
                Tables\Columns\TextColumn::make('goal_name')
                    ->label('Goal')
                    ->searchable(), 
                    
                    

                // Tables\Columns\TextColumn::make('conversion_value')
                //     ->label('Conversion Value')
                //     ->numeric()
                //     ->sortable(),      
                    
                Tables\Columns\TextColumn::make('campaign_name')
                    ->label('Campaign Name')
                    ->searchable(),

                // Tables\Columns\TextColumn::make('click_code')
                //     ->label('Click Code')
                //     ->searchable(),
             
                Tables\Columns\TextColumn::make('commission')
                    ->numeric()
                    ->money(config('freemoney.default.default_currency'))
                    ->sortable(),

                Tables\Columns\TextColumn::make('conversion_status')
                    ->label('Conversion Status')
                    ->badge()
                    ->formatStateUsing(fn($state) => Str::ucfirst($state))
                    ->color(fn($state) => match ($state) {                    
                        'pending'   => 'warning',
                        'approved'  => 'success',
                        'declined'  => 'danger',
                        'paid'      => 'success',
                    })
                    ->searchable(),

                Tables\Columns\TextColumn::make('converted_at')
                    ->date()
                    ->tooltip(fn ($state) => $state)
                    ->sortable(),

                // Tables\Columns\TextColumn::make('conversion_created_at')
                //     ->dateTime()
                //     ->sortable(),
                // Tables\Columns\TextColumn::make('payout_id')
                //     ->label('Payout ID')
                //     ->numeric()
                //     ->sortable(),
                // Tables\Columns\TextColumn::make('conversion_sub1')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('conversion_sub2')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('conversion_sub3')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('admin_notes')
                //     ->searchable(),
           
                // Tables\Columns\TextColumn::make('campaign_id')
                //     ->numeric()
                //     ->sortable(),
         
                // Tables\Columns\TextColumn::make('campaign_type')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('campaign_status')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('campaign_goal_id')
                //     ->numeric()
                //     ->sortable(),
                // Tables\Columns\TextColumn::make('goal_name')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('commission_type')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('goal_commission_amount')
                //     ->numeric()
                //     ->sortable(),
                // Tables\Columns\TextColumn::make('tracking_code')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('goal_status')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('affiliate_id')
                //     ->numeric()
                //     ->sortable(),
               
                // Tables\Columns\TextColumn::make('affiliate_email')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('affiliate_status')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('affiliate_link_id')
                //     ->numeric()
                //     ->sortable(),
                // Tables\Columns\TextColumn::make('link_slug')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('destination_url')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('link_status')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('link_sub1')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('link_sub2')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('link_sub3')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('click_id')
                //     ->numeric()
                //     ->sortable(),
                // Tables\Columns\TextColumn::make('ip_address')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('country')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('city')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('device_type')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('referrer')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('clicked_at')
                //     ->dateTime()
                //     ->sortable(),
                // Tables\Columns\TextColumn::make('click_sub1')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('click_sub2')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('click_sub3')
                //     ->searchable(),
                // Tables\Columns\TextColumn::make('hours_to_conversion')
                //     ->numeric()
                //     ->sortable(),
                // Tables\Columns\TextColumn::make('conversion_year')
                //     ->dateTime()
                //     ->sortable(),
            ])
            ->filters([
                 Tables\Filters\SelectFilter::make('conversion_status')
                    ->options([
                        'pending'   => 'Pending',
                        'approved'  => 'Approved',
                        'declined'  => 'Declined',
                        'paid'      => 'Paid',           
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
                    ->relationship('affiliate', 'email')
                    ->preload()
                    ->searchable()
                    ->label('Filter By Affiliate'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label("")->tooltip("View")->size("lg"),
                // Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Tables\Actions\DeleteBulkAction::make(),/
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
            'index' => Pages\ListViewConversions::route('/'),
            // 'create' => Pages\CreateViewConversion::route('/create'),
            'view' => Pages\ViewViewConversion::route('/{record}'),
            // 'edit' => Pages\EditViewConversion::route('/{record}/edit'),
        ];
    }
}
