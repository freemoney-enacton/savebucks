<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Affiliate\Affiliate;
use App\Models\Affiliate\Campaign;
use App\Models\Affiliate\CampaignGoal;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


// AffiliateCampaignGoal Model (Pivot with additional fields)
class AffiliateCampaignGoal extends Model 
// implements Auditable
{
    use HasFactory;
    //  \OwenIt\Auditing\Auditable;

    protected $connection = 'affiliate';

    protected $fillable = [
        'affiliate_id',
        'campaign_id',
        'campaign_goal_id',
        'custom_commission_rate',
        'qualification_amount',
        'approval_status',
    ];

    protected $casts = [
        'custom_commission_rate' => 'decimal:2',
        'qualification_amount' => 'decimal:2',
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
}
