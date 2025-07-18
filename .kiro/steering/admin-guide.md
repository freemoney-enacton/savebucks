# Laravel Filament Admin Panel Development Guide

## Architecture Overview

The admin panel is built with Laravel 10.x and Filament 3.2, following Laravel's MVC pattern with additional service layers for complex business logic. It now includes comprehensive affiliate management capabilities alongside the existing user and offer management features.

### Core Principles
- **Single Responsibility**: Each class should have one reason to change
- **Dependency Injection**: Use Laravel's container for all dependencies
- **Policy-Based Authorization**: All access control through Filament policies
- **Queue-Based Processing**: Heavy operations should be queued
- **Event-Driven Architecture**: Use observers and events for side effects

## File Structure & Organization

### Models (`app/Models/`)
All models should extend Laravel's base Model and follow these conventions:

#### Core Business Models

**`app/Models/Offer.php`**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\OfferStatus;

class Offer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'reward_amount',
        'status',
        'network_id',
        'category_id',
    ];

    protected $casts = [
        'status' => OfferStatus::class,
        'reward_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function network(): BelongsTo
    {
        return $this->belongsTo(Network::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function userOffers(): HasMany
    {
        return $this->hasMany(UserOffer::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', OfferStatus::ACTIVE);
    }

    // Accessors/Mutators
    public function getFormattedRewardAttribute(): string
    {
        return '$' . number_format($this->reward_amount, 2);
    }
}
```

#### Affiliate Management Models

**`app/Models/Affiliate.php`**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\ApprovalStatus;

class Affiliate extends Model
{
    use SoftDeletes;

    protected $connection = 'pgsql'; // PostgreSQL connection

    protected $fillable = [
        'name',
        'email',
        'password_hash',
        'approval_status',
        'paypal_address',
        'bank_details',
        'address',
        'tax_id',
        'is_email_verified',
        'email_verified_at',
    ];

    protected $casts = [
        'approval_status' => ApprovalStatus::class,
        'bank_details' => 'array',
        'address' => 'array',
        'is_email_verified' => 'boolean',
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'password_hash',
    ];

    // Relationships
    public function affiliateLinks(): HasMany
    {
        return $this->hasMany(AffiliateLink::class);
    }

    public function conversions(): HasMany
    {
        return $this->hasMany(Conversion::class);
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(AffiliatePayout::class);
    }

    public function campaigns(): BelongsToMany
    {
        return $this->belongsToMany(Campaign::class, 'affiliate_campaign_goals')
            ->withPivot('custom_commission_rate')
            ->withTimestamps();
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('approval_status', ApprovalStatus::APPROVED);
    }

    public function scopePending($query)
    {
        return $query->where('approval_status', ApprovalStatus::PENDING);
    }

    // Accessors
    public function getTotalEarningsAttribute(): float
    {
        return $this->conversions()
            ->where('status', 'approved')
            ->sum('commission');
    }

    public function getPendingEarningsAttribute(): float
    {
        return $this->conversions()
            ->where('status', 'pending')
            ->sum('commission');
    }
}
```

**`app/Models/Campaign.php`**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Enums\CampaignStatus;

class Campaign extends Model
{
    protected $connection = 'pgsql';

    protected $fillable = [
        'name',
        'description',
        'logo_url',
        'campaign_type',
        'status',
        'terms_and_conditions',
        'terms_and_condition_url',
        'min_payout_amount',
    ];

    protected $casts = [
        'status' => CampaignStatus::class,
        'min_payout_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function campaignGoals(): HasMany
    {
        return $this->hasMany(CampaignGoal::class);
    }

    public function affiliateLinks(): HasMany
    {
        return $this->hasMany(AffiliateLink::class);
    }

    public function affiliates(): BelongsToMany
    {
        return $this->belongsToMany(Affiliate::class, 'affiliate_campaign_goals')
            ->withPivot('custom_commission_rate')
            ->withTimestamps();
    }

    public function conversions(): HasMany
    {
        return $this->hasMany(Conversion::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', CampaignStatus::ACTIVE);
    }

    // Accessors
    public function getTotalClicksAttribute(): int
    {
        return $this->affiliateLinks()->sum('total_clicks');
    }

    public function getTotalConversionsAttribute(): int
    {
        return $this->conversions()->count();
    }
}
```

**`app/Models/Conversion.php`**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Enums\ConversionStatus;

class Conversion extends Model
{
    protected $connection = 'pgsql';

    protected $fillable = [
        'campaign_id',
        'postback_log_id',
        'click_code',
        'campaign_goal_id',
        'affiliate_id',
        'transaction_id',
        'conversion_value',
        'commission',
        'sub1',
        'sub2',
        'sub3',
        'status',
        'payout_id',
        'admin_notes',
        'converted_at',
    ];

    protected $casts = [
        'status' => ConversionStatus::class,
        'conversion_value' => 'decimal:2',
        'commission' => 'decimal:2',
        'converted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function affiliate(): BelongsTo
    {
        return $this->belongsTo(Affiliate::class);
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function campaignGoal(): BelongsTo
    {
        return $this->belongsTo(CampaignGoal::class);
    }

    public function payout(): BelongsTo
    {
        return $this->belongsTo(AffiliatePayout::class, 'payout_id');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', ConversionStatus::PENDING);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', ConversionStatus::APPROVED);
    }

    // Accessors
    public function getFormattedCommissionAttribute(): string
    {
        return '$' . number_format($this->commission, 2);
    }
}
```

**Model Rules:**
- Always use `$fillable` instead of `$guarded`
- Cast enum fields to proper enum classes
- Use proper relationship return types
- Include scopes for common queries
- Use accessors for formatted data display

### Filament Resources (`app/Filament/Resources/`)

#### Affiliate Management Resources

**`app/Filament/Resources/AffiliateResource.php`**
```php
<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AffiliateResource\Pages;
use App\Models\Affiliate;
use App\Enums\ApprovalStatus;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Notifications\Notification;

class AffiliateResource extends Resource
{
    protected static ?string $model = Affiliate::class;
    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $navigationGroup = 'Affiliate Management';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        
                        Forms\Components\TextInput::make('paypal_address')
                            ->email()
                            ->label('PayPal Email')
                            ->maxLength(255),
                        
                        Forms\Components\TextInput::make('tax_id')
                            ->label('Tax ID')
                            ->maxLength(255),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Status & Approval')
                    ->schema([
                        Forms\Components\Select::make('approval_status')
                            ->options(ApprovalStatus::class)
                            ->required()
                            ->default(ApprovalStatus::PENDING)
                            ->live()
                            ->afterStateUpdated(function ($state, $record) {
                                if ($record && $state === ApprovalStatus::APPROVED->value) {
                                    // Send approval notification
                                    Notification::make()
                                        ->title('Affiliate Approved')
                                        ->success()
                                        ->send();
                                }
                            }),
                        
                        Forms\Components\Toggle::make('is_email_verified')
                            ->label('Email Verified')
                            ->disabled(),
                        
                        Forms\Components\DateTimePicker::make('email_verified_at')
                            ->label('Email Verified At')
                            ->disabled(),
                    ])
                    ->columns(3),

                Forms\Components\Section::make('Address Information')
                    ->schema([
                        Forms\Components\Textarea::make('address')
                            ->label('Address')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Bank Details')
                    ->schema([
                        Forms\Components\KeyValue::make('bank_details')
                            ->label('Bank Account Details')
                            ->keyLabel('Field')
                            ->valueLabel('Value')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\BadgeColumn::make('approval_status')
                    ->colors([
                        'danger' => ApprovalStatus::REJECTED,
                        'warning' => ApprovalStatus::PENDING,
                        'success' => ApprovalStatus::APPROVED,
                        'secondary' => ApprovalStatus::SUSPENDED,
                    ]),
                
                Tables\Columns\IconColumn::make('is_email_verified')
                    ->label('Email Verified')
                    ->boolean(),
                
                Tables\Columns\TextColumn::make('total_earnings')
                    ->label('Total Earnings')
                    ->money('USD')
                    ->getStateUsing(function ($record) {
                        return $record->conversions()->where('status', 'approved')->sum('commission');
                    }),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('approval_status')
                    ->options(ApprovalStatus::class),
                
                Tables\Filters\TernaryFilter::make('is_email_verified')
                    ->label('Email Verified'),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn ($record) => $record->approval_status === ApprovalStatus::PENDING)
                    ->action(function ($record) {
                        $record->update(['approval_status' => ApprovalStatus::APPROVED]);
                        Notification::make()
                            ->title('Affiliate approved successfully')
                            ->success()
                            ->send();
                    }),
                
                Tables\Actions\Action::make('reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn ($record) => $record->approval_status === ApprovalStatus::PENDING)
                    ->action(function ($record) {
                        $record->update(['approval_status' => ApprovalStatus::REJECTED]);
                        Notification::make()
                            ->title('Affiliate rejected')
                            ->warning()
                            ->send();
                    }),
                
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    
                    Tables\Actions\BulkAction::make('approve_selected')
                        ->label('Approve Selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->action(function ($records) {
                            $records->each(function ($record) {
                                $record->update(['approval_status' => ApprovalStatus::APPROVED]);
                            });
                            Notification::make()
                                ->title('Selected affiliates approved')
                                ->success()
                                ->send();
                        }),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAffiliates::route('/'),
            'create' => Pages\CreateAffiliate::route('/create'),
            'view' => Pages\ViewAffiliate::route('/{record}'),
            'edit' => Pages\EditAffiliate::route('/{record}/edit'),
        ];
    }
}
```

**`app/Filament/Resources/CampaignResource.php`**
```php
<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CampaignResource\Pages;
use App\Models\Campaign;
use App\Enums\CampaignStatus;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class CampaignResource extends Resource
{
    protected static ?string $model = Campaign::class;
    protected static ?string $navigationIcon = 'heroicon-o-megaphone';
    protected static ?string $navigationGroup = 'Affiliate Management';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Campaign Details')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        
                        Forms\Components\Textarea::make('description')
                            ->required()
                            ->rows(3),
                        
                        Forms\Components\FileUpload::make('logo_url')
                            ->label('Campaign Logo')
                            ->image()
                            ->directory('campaigns'),
                        
                        Forms\Components\TextInput::make('campaign_type')
                            ->required()
                            ->maxLength(255),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Configuration')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->options(CampaignStatus::class)
                            ->required()
                            ->default(CampaignStatus::ACTIVE),
                        
                        Forms\Components\TextInput::make('min_payout_amount')
                            ->label('Minimum Payout Amount')
                            ->numeric()
                            ->prefix('$')
                            ->step(0.01)
                            ->default(0.00),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Terms & Conditions')
                    ->schema([
                        Forms\Components\RichEditor::make('terms_and_conditions')
                            ->label('Terms and Conditions')
                            ->columnSpanFull(),
                        
                        Forms\Components\TextInput::make('terms_and_condition_url')
                            ->label('Terms and Conditions URL')
                            ->url()
                            ->maxLength(1000),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('logo_url')
                    ->label('Logo')
                    ->circular(),
                
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('campaign_type')
                    ->label('Type')
                    ->badge(),
                
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'success' => CampaignStatus::ACTIVE,
                        'warning' => CampaignStatus::PAUSED,
                        'danger' => CampaignStatus::ENDED,
                    ]),
                
                Tables\Columns\TextColumn::make('min_payout_amount')
                    ->label('Min Payout')
                    ->money('USD'),
                
                Tables\Columns\TextColumn::make('affiliates_count')
                    ->label('Affiliates')
                    ->counts('affiliates'),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(CampaignStatus::class),
                
                Tables\Filters\SelectFilter::make('campaign_type'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),
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
            'index' => Pages\ListCampaigns::route('/'),
            'create' => Pages\CreateCampaign::route('/create'),
            'view' => Pages\ViewCampaign::route('/{record}'),
            'edit' => Pages\EditCampaign::route('/{record}/edit'),
        ];
    }
}
```

#### Core Platform Resources

**`app/Filament/Resources/OfferResource.php`**
```php
<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OfferResource\Pages;
use App\Models\Offer;
use App\Enums\OfferStatus;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class OfferResource extends Resource
{
    protected static ?string $model = Offer::class;
    protected static ?string $navigationIcon = 'heroicon-o-gift';
    protected static ?string $navigationGroup = 'Offers Management';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) => 
                                $set('slug', Str::slug($state))
                            ),
                        
                        Forms\Components\Textarea::make('description')
                            ->required()
                            ->rows(3),
                        
                        Forms\Components\TextInput::make('reward_amount')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->step(0.01),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Configuration')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->options(OfferStatus::class)
                            ->required()
                            ->default(OfferStatus::DRAFT),
                        
                        Forms\Components\Select::make('network_id')
                            ->relationship('network', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        Forms\Components\Select::make('category_id')
                            ->relationship('category', 'name')
                            ->required()
                            ->searchable(),
                    ])
                    ->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('network.name')
                    ->sortable()
                    ->toggleable(),
                
                Tables\Columns\TextColumn::make('formatted_reward')
                    ->label('Reward')
                    ->sortable('reward_amount'),
                
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'danger' => OfferStatus::INACTIVE,
                        'warning' => OfferStatus::DRAFT,
                        'success' => OfferStatus::ACTIVE,
                    ]),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(OfferStatus::class),
                
                Tables\Filters\SelectFilter::make('network')
                    ->relationship('network', 'name'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListOffers::route('/'),
            'create' => Pages\CreateOffer::route('/create'),
            'edit' => Pages\EditOffer::route('/{record}/edit'),
        ];
    }
}
```

**Filament Resource Rules:**
- Group related resources with `$navigationGroup`
- Use proper icons from Heroicons
- Implement comprehensive filters and search
- Use sections to organize form fields
- Always include bulk actions for list management
- Use relationship selectors with preloading for performance

### Services (`app/Services/`)

```php
<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserPayment;
use App\Enums\PaymentStatus;
use App\Jobs\ProcessUserPaypalPayoutRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PayoutService
{
    public function __construct(
        private PayPalPayoutService $paypalService
    ) {}

    public function processPayoutRequest(UserPayment $payment): bool
    {
        DB::beginTransaction();
        
        try {
            // Validate user eligibility
            if (!$this->validateUserEligibility($payment->user)) {
                throw new \Exception('User not eligible for payout');
            }

            // Update payment status
            $payment->update(['status' => PaymentStatus::PROCESSING]);

            // Queue the actual payout job
            ProcessUserPaypalPayoutRequest::dispatch($payment);

            DB::commit();
            
            Log::info('Payout request queued', [
                'payment_id' => $payment->id,
                'user_id' => $payment->user_id,
                'amount' => $payment->amount
            ]);

            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            
            $payment->update([
                'status' => PaymentStatus::FAILED,
                'failure_reason' => $e->getMessage()
            ]);

            Log::error('Payout request failed', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }

    private function validateUserEligibility(User $user): bool
    {
        // Check minimum balance
        if ($user->balance < config('app.minimum_payout_amount')) {
            return false;
        }

        // Check for pending payments
        if ($user->payments()->where('status', PaymentStatus::PROCESSING)->exists()) {
            return false;
        }

        return true;
    }
}
```

#### Affiliate Management Services

**`app/Services/AffiliateService.php`**
```php
<?php

namespace App\Services;

use App\Models\Affiliate;
use App\Models\Conversion;
use App\Models\AffiliatePayout;
use App\Enums\ApprovalStatus;
use App\Enums\PayoutStatus;
use App\Jobs\ProcessAffiliatePayoutRequest;
use App\Mail\AffiliateApprovalNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AffiliateService
{
    public function __construct(
        private PayPalPayoutService $paypalService
    ) {}

    public function approveAffiliate(Affiliate $affiliate): bool
    {
        DB::beginTransaction();
        
        try {
            $affiliate->update([
                'approval_status' => ApprovalStatus::APPROVED,
                'approved_at' => now()
            ]);

            // Send approval email
            Mail::to($affiliate->email)->send(
                new AffiliateApprovalNotification($affiliate)
            );

            DB::commit();
            
            Log::info('Affiliate approved', [
                'affiliate_id' => $affiliate->id,
                'email' => $affiliate->email
            ]);

            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Affiliate approval failed', [
                'affiliate_id' => $affiliate->id,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }

    public function processAffiliatePayout(AffiliatePayout $payout): bool
    {
        DB::beginTransaction();
        
        try {
            // Validate affiliate eligibility
            if (!$this->validateAffiliatePayoutEligibility($payout->affiliate, $payout->requested_amount)) {
                throw new \Exception('Affiliate not eligible for payout');
            }

            // Update payout status
            $payout->update(['status' => PayoutStatus::PROCESSING]);

            // Queue the actual payout job
            ProcessAffiliatePayoutRequest::dispatch($payout);

            DB::commit();
            
            Log::info('Affiliate payout request queued', [
                'payout_id' => $payout->id,
                'affiliate_id' => $payout->affiliate_id,
                'amount' => $payout->requested_amount
            ]);

            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            
            $payout->update([
                'status' => PayoutStatus::REJECTED,
                'admin_notes' => $e->getMessage()
            ]);

            Log::error('Affiliate payout request failed', [
                'payout_id' => $payout->id,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }

    private function validateAffiliatePayoutEligibility(Affiliate $affiliate, float $amount): bool
    {
        // Check if affiliate is approved
        if ($affiliate->approval_status !== ApprovalStatus::APPROVED) {
            return false;
        }

        // Check available balance
        $availableBalance = $affiliate->conversions()
            ->where('status', 'approved')
            ->whereNull('payout_id')
            ->sum('commission');

        if ($availableBalance < $amount) {
            return false;
        }

        // Check for pending payouts
        if ($affiliate->payouts()->where('status', PayoutStatus::PROCESSING)->exists()) {
            return false;
        }

        return true;
    }

    public function calculateAffiliateStats(Affiliate $affiliate, string $period = '30d'): array
    {
        $days = match($period) {
            '7d' => 7,
            '30d' => 30,
            '90d' => 90,
            '1y' => 365,
            default => 30
        };

        $startDate = now()->subDays($days);

        return [
            'total_clicks' => $affiliate->affiliateLinks()->sum('total_clicks'),
            'total_conversions' => $affiliate->conversions()->where('converted_at', '>=', $startDate)->count(),
            'total_earnings' => $affiliate->conversions()->where('status', 'approved')->sum('commission'),
            'pending_earnings' => $affiliate->conversions()->where('status', 'pending')->sum('commission'),
            'conversion_rate' => $this->calculateConversionRate($affiliate, $startDate),
        ];
    }

    private function calculateConversionRate(Affiliate $affiliate, $startDate): float
    {
        $totalClicks = $affiliate->affiliateLinks()
            ->whereHas('clicks', function ($query) use ($startDate) {
                $query->where('clicked_at', '>=', $startDate);
            })
            ->sum('total_clicks');

        $totalConversions = $affiliate->conversions()
            ->where('converted_at', '>=', $startDate)
            ->count();

        return $totalClicks > 0 ? ($totalConversions / $totalClicks) * 100 : 0;
    }
}
```

**Service Rules:**
- Use dependency injection for all external dependencies
- Wrap database operations in transactions
- Always log important operations
- Throw meaningful exceptions
- Use private methods for internal logic
- Return boolean or specific result objects

### Jobs (`app/Jobs/`)

#### Affiliate-Specific Jobs

**`app/Jobs/ProcessAffiliatePayoutRequest.php`**
```php
<?php

namespace App\Jobs;

use App\Models\AffiliatePayout;
use App\Services\PayPalPayoutService;
use App\Enums\PayoutStatus;
use App\Mail\AffiliatePayoutProcessed;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ProcessAffiliatePayoutRequest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $maxExceptions = 2;

    public function __construct(
        private AffiliatePayout $payout
    ) {}

    public function handle(PayPalPayoutService $paypalService): void
    {
        try {
            $result = $paypalService->processAffiliatePayout($this->payout);

            if ($result['success']) {
                $this->payout->update([
                    'status' => PayoutStatus::PAID,
                    'transaction_id' => $result['transaction_id'],
                    'api_response' => $result,
                    'paid_at' => now()
                ]);

                // Update related conversions
                $this->payout->affiliate->conversions()
                    ->where('status', 'approved')
                    ->whereNull('payout_id')
                    ->update(['payout_id' => $this->payout->id]);

                // Send confirmation email
                Mail::to($this->payout->affiliate->email)
                    ->send(new AffiliatePayoutProcessed($this->payout));

                Log::info('Affiliate payout processed successfully', [
                    'payout_id' => $this->payout->id,
                    'transaction_id' => $result['transaction_id']
                ]);
            } else {
                $this->fail(new \Exception($result['error']));
            }

        } catch (\Exception $e) {
            Log::error('Affiliate payout processing failed', [
                'payout_id' => $this->payout->id,
                'error' => $e->getMessage()
            ]);

            $this->fail($e);
        }
    }

    public function failed(\Throwable $exception): void
    {
        $this->payout->update([
            'status' => PayoutStatus::REJECTED,
            'admin_notes' => $exception->getMessage()
        ]);

        Log::error('Affiliate payout job failed permanently', [
            'payout_id' => $this->payout->id,
            'error' => $exception->getMessage()
        ]);
    }
}
```

**`app/Jobs/ProcessConversionApproval.php`**
```php
<?php

namespace App\Jobs;

use App\Models\Conversion;
use App\Enums\ConversionStatus;
use App\Mail\ConversionApproved;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ProcessConversionApproval implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private Conversion $conversion
    ) {}

    public function handle(): void
    {
        try {
            $this->conversion->update([
                'status' => ConversionStatus::APPROVED,
                'approved_at' => now()
            ]);

            // Send notification to affiliate
            Mail::to($this->conversion->affiliate->email)
                ->send(new ConversionApproved($this->conversion));

            Log::info('Conversion approved', [
                'conversion_id' => $this->conversion->id,
                'affiliate_id' => $this->conversion->affiliate_id,
                'commission' => $this->conversion->commission
            ]);

        } catch (\Exception $e) {
            Log::error('Conversion approval failed', [
                'conversion_id' => $this->conversion->id,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
```

### Mail Templates (`app/Mail/`)

#### Affiliate-Specific Mail Templates

**`app/Mail/AffiliateApprovalNotification.php`**
```php
<?php

namespace App\Mail;

use App\Models\Affiliate;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AffiliateApprovalNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Affiliate $affiliate
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to SaveBucks Affiliate Program!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.affiliate.approval',
            with: [
                'affiliateName' => $this->affiliate->name,
                'loginUrl' => config('app.affiliate_panel_url') . '/signin',
            ]
        );
    }
}
```

**`app/Mail/AffiliatePayoutProcessed.php`**
```php
<?php

namespace App\Mail;

use App\Models\AffiliatePayout;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AffiliatePayoutProcessed extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public AffiliatePayout $payout
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Affiliate Payout Has Been Processed',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.affiliate.payout-processed',
            with: [
                'affiliateName' => $this->payout->affiliate->name,
                'amount' => $this->payout->requested_amount,
                'transactionId' => $this->payout->transaction_id,
                'paymentMethod' => $this->payout->payment_method,
            ]
        );
    }
}
```

### Filament Widgets (`app/Filament/Widgets/`)

#### Affiliate Dashboard Widgets

**`app/Filament/Widgets/AffiliateStatsWidget.php`**
```php
<?php

namespace App\Filament\Widgets;

use App\Models\Affiliate;
use App\Models\Conversion;
use App\Models\AffiliatePayout;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AffiliateStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Affiliates', Affiliate::count())
                ->description('Registered affiliates')
                ->descriptionIcon('heroicon-m-users')
                ->color('primary'),

            Stat::make('Pending Approvals', Affiliate::where('approval_status', 'pending')->count())
                ->description('Awaiting approval')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),

            Stat::make('Active Affiliates', Affiliate::where('approval_status', 'approved')->count())
                ->description('Currently active')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Total Conversions', Conversion::count())
                ->description('All time conversions')
                ->descriptionIcon('heroicon-m-chart-bar')
                ->color('info'),

            Stat::make('Pending Payouts', AffiliatePayout::where('status', 'pending')->sum('requested_amount'))
                ->description('Awaiting processing')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('warning')
                ->money('USD'),

            Stat::make('Total Paid Out', AffiliatePayout::where('status', 'paid')->sum('requested_amount'))
                ->description('Successfully processed')
                ->descriptionIcon('heroicon-m-check-badge')
                ->color('success')
                ->money('USD'),
        ];
    }
}
```

**`app/Filament/Widgets/AffiliatePerformanceChart.php`**
```php
<?php

namespace App\Filament\Widgets;

use App\Models\Conversion;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class AffiliatePerformanceChart extends ChartWidget
{
    protected static ?string $heading = 'Affiliate Performance (Last 30 Days)';
    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $data = [];
        $labels = [];

        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $labels[] = $date->format('M j');
            
            $conversions = Conversion::whereDate('converted_at', $date)->count();
            $earnings = Conversion::whereDate('converted_at', $date)
                ->where('status', 'approved')
                ->sum('commission');
            
            $data['conversions'][] = $conversions;
            $data['earnings'][] = $earnings;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Conversions',
                    'data' => $data['conversions'],
                    'borderColor' => '#3b82f6',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                ],
                [
                    'label' => 'Earnings ($)',
                    'data' => $data['earnings'],
                    'borderColor' => '#10b981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                    'yAxisID' => 'y1',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getOptions(): array
    {
        return [
            'scales' => [
                'y' => [
                    'type' => 'linear',
                    'display' => true,
                    'position' => 'left',
                ],
                'y1' => [
                    'type' => 'linear',
                    'display' => true,
                    'position' => 'right',
                    'grid' => [
                        'drawOnChartArea' => false,
                    ],
                ],
            ],
        ];
    }
}
```

### Jobs (`app/Jobs/`)

```php
<?php

namespace App\Jobs;

use App\Models\UserPayment;
use App\Services\PayPalPayoutService;
use App\Enums\PaymentStatus;
use App\Mail\PayoutPaidByAdmin;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ProcessUserPaypalPayoutRequest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $maxExceptions = 2;

    public function __construct(
        private UserPayment $payment
    ) {}

    public function handle(PayPalPayoutService $paypalService): void
    {
        try {
            $result = $paypalService->processPayout($this->payment);

            if ($result['success']) {
                $this->payment->update([
                    'status' => PaymentStatus::COMPLETED,
                    'transaction_id' => $result['transaction_id'],
                    'processed_at' => now()
                ]);

                // Send confirmation email
                Mail::to($this->payment->user->email)
                    ->send(new PayoutPaidByAdmin($this->payment));

                Log::info('Payout processed successfully', [
                    'payment_id' => $this->payment->id,
                    'transaction_id' => $result['transaction_id']
                ]);
            } else {
                $this->fail(new \Exception($result['error']));
            }

        } catch (\Exception $e) {
            Log::error('Payout processing failed', [
                'payment_id' => $this->payment->id,
                'error' => $e->getMessage()
            ]);

            $this->fail($e);
        }
    }

    public function failed(\Throwable $exception): void
    {
        $this->payment->update([
            'status' => PaymentStatus::FAILED,
            'failure_reason' => $exception->getMessage()
        ]);

        Log::error('Payout job failed permanently', [
            'payment_id' => $this->payment->id,
            'error' => $exception->getMessage()
        ]);
    }
}
```

**Job Rules:**
- Always implement `ShouldQueue`
- Set appropriate retry limits
- Use dependency injection in handle method
- Log all important events
- Implement `failed()` method for cleanup
- Update model states appropriately

## Database Migrations

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->decimal('reward_amount', 10, 2);
            $table->string('status')->default('draft');
            $table->foreignId('network_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'created_at']);
            $table->index('network_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
```

**Migration Rules:**
- Always use foreign key constraints
- Add appropriate indexes
- Use soft deletes for important data
- Include metadata JSON fields for flexibility
- Use descriptive migration names

## Best Practices

### DO:
- Use Eloquent relationships instead of manual joins
- Implement proper authorization policies
- Queue heavy operations
- Use database transactions for multi-step operations
- Log important business events
- Use enums for status fields
- Implement soft deletes for critical data
- Use form validation and sanitization
- Follow PSR-12 coding standards

### DON'T:
- Write raw SQL queries without good reason
- Put business logic in controllers
- Hardcode configuration values
- Skip authorization checks
- Perform heavy operations in web requests
- Use magic numbers or strings
- Ignore database constraints
- Skip error handling and logging

## Testing

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserPayment;
use App\Services\PayoutService;
use App\Enums\PaymentStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PayoutServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_processes_valid_payout_request(): void
    {
        $user = User::factory()->create(['balance' => 100.00]);
        $payment = UserPayment::factory()->create([
            'user_id' => $user->id,
            'amount' => 50.00,
            'status' => PaymentStatus::PENDING
        ]);

        $service = app(PayoutService::class);
        $result = $service->processPayoutRequest($payment);

        $this->assertTrue($result);
        $this->assertEquals(PaymentStatus::PROCESSING, $payment->fresh()->status);
    }

    public function test_rejects_ineligible_user_payout(): void
    {
        $user = User::factory()->create(['balance' => 5.00]); // Below minimum
        $payment = UserPayment::factory()->create([
            'user_id' => $user->id,
            'amount' => 50.00
        ]);

        $service = app(PayoutService::class);
        $result = $service->processPayoutRequest($payment);

        $this->assertFalse($result);
        $this->assertEquals(PaymentStatus::FAILED, $payment->fresh()->status);
    }
}
```

## Environment Configuration

```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=savebucks_admin
DB_USERNAME=root
DB_PASSWORD=

# Queue
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# OneSignal
ONESIGNAL_APP_ID=your_onesignal_app_id
ONESIGNAL_REST_API_KEY=your_onesignal_api_key
```

## Common Commands

```bash
# Development
php artisan serve                    # Start development server
php artisan queue:work              # Process queue jobs
php artisan schedule:work           # Run scheduled tasks

# Database
php artisan migrate                 # Run migrations
php artisan migrate:rollback        # Rollback last migration
php artisan db:seed                 # Run seeders

# Cache
php artisan config:cache            # Cache configuration
php artisan route:cache             # Cache routes
php artisan view:cache              # Cache views

# Filament
php artisan filament:make-resource Offer  # Create new resource
php artisan filament:make-page Dashboard  # Create custom page
```