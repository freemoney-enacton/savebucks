<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Affiliate\Affiliate;
use App\Models\Affiliate\Campaign;
use App\Models\Affiliate\CampaignGoal;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// AffiliatePostback Model
class AffiliatePostback extends Model
{
    use HasFactory;

    protected $connection = 'affiliate';

    protected $fillable = [
        'affiliate_id',
        'campaign_id',
        'campaign_goal_id',
        'postback_url',
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

