<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



// CampaignGoal Model
class CampaignGoal extends Model 
// implements Auditable
{
    use HasFactory;
    // \OwenIt\Auditing\Auditable;

    protected $connection = 'affiliate';

    protected $fillable = [
        'campaign_id',
        'name',
        'description', 
        'commission_type',
        'commission_amount',
        'tracking_code',
        'status',
    ];

    protected $casts = [
        'payout_amount' => 'decimal:2',
    ];

    // Relationships
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
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
}
