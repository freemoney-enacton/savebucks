<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as ContractsAuditable;


// Campaign Model
class Campaign extends Model implements ContractsAuditable
{
    use HasFactory, Auditable;

    protected $connection = 'affiliate';

    protected $fillable = [
        'name',
        'description',
        'logo_url',
        'campaign_type',
        'status',
        'terms_and_conditions',
        'terms_and_condition_url',
        'min_payout_request',
    ];

    // Relationships
    public function goals(): HasMany
    {
        return $this->hasMany(CampaignGoal::class, 'campaign_id', 'id');
    }

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

    public function affiliateCampaignGoals(): HasMany
    {
        return $this->hasMany(AffiliateCampaignGoal::class);
    }

    public function postbacks(): HasMany
    {
        return $this->hasMany(AffiliatePostback::class);
    }

    // Many-to-many through pivot
    public function affiliates(): BelongsToMany
    {
        return $this->belongsToMany(Affiliate::class, 'affiliate_campaign_goals')
            ->withPivot('custom_commission_rate', 'approval_status')
            ->withTimestamps();
    }
}
