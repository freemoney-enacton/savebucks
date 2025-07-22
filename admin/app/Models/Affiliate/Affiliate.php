<?php
namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;
use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\SendMailToUser;

// Affiliate Model
class Affiliate extends Model
{
    use HasFactory, HasRoles;

    protected $connection = 'affiliate';

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
        'email_verified_at'
    ];

    // protected $guarded = ['id'];

    protected $casts = [
        'bank_details' => 'array',
        'address' => 'array',
        'is_email_verified' => 'boolean'
    ];

    protected $table = 'affiliates';
    protected $hidden = ['password_hash'];

    // Relationships
    public function affiliateLinks(): HasMany
    {
        return $this->hasMany(AffiliateLink::class);
    }

    public function clicks(): HasMany
    {
        return $this->hasMany(Click::class);
    }

    public function conversions(): HasMany
    {
        return $this->hasMany(Conversion::class);
    }

    public function viewConversions(): HasMany
    {
        return $this->hasMany(ViewConversion::class, 'affiliate_id', 'id');
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(Payout::class);
    }

    public function affiliateCampaignGoals(): HasMany
    {
        return $this->hasMany(AffiliateCampaignGoal::class);
    }

    public function affiliateCampaigns(): HasMany
    {
        return $this->hasMany(AffiliateCampaign::class);
    }

    public function postbacks(): HasMany
    {
        return $this->hasMany(AffiliatePostback::class);
    }

    // Many-to-many through pivot
    public function campaigns(): BelongsToMany
    {
        return $this->belongsToMany(Campaign::class, 'affiliate_campaign_goals')
            ->withPivot('custom_commission_rate', 'approval_status')
            ->withTimestamps();
    }


     protected static function boot()
    {
        parent::boot();

        static::updated(function ($affiliate) {

            if ($affiliate->isDirty('approval_status') && $affiliate->approval_status === 'approved') {
                static::sendWelcomeEmail($affiliate);
            }
        });
    }

     /**
     * Send welcome email to affiliate
     */
    protected static function sendWelcomeEmail($affiliate)
    {
        try {
            Log::info("Triggering welcome email for approved affiliate", [
                'affiliate_id' => $affiliate->id,
                'email' => $affiliate->email
            ]);

            // Create a mock request object with the required parameters
            $request = new \Illuminate\Http\Request([
                'userId' => $affiliate->id,
                'type'   => 'welcome'
            ]);

            // Call the controller method directly
            $controller = new SendMailToUser();
            $controller->sendMailToAffiliate($request);

        } catch (\Exception $e) {
            Log::error("Exception occurred while sending welcome email", [
                'affiliate_id' => $affiliate->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

}
