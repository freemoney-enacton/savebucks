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

**Model Rules:**
- Always use `$fillable` instead of `$guarded`
- Cast enum fields to proper enum classes
- Use proper relationship return types
- Include scopes for common queries
- Use accessors for formatted data display

### Filament Resources (`app/Filament/Resources/`)

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

**Service Rules:**
- Use dependency injection for all external dependencies
- Wrap database operations in transactions
- Always log important operations
- Throw meaningful exceptions
- Use private methods for internal logic
- Return boolean or specific result objects

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