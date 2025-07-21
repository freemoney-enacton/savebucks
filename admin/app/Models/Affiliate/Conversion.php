<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


// Conversion Model
class Conversion extends Model 
// implements Auditable
{
    use HasFactory ;
    // \OwenIt\Auditing\Auditable;

    protected $connection = 'affiliate';

    protected $fillable = [
        'campaign_id',
        'postback_log_id',
        'click_code',
        'campaign_goal_id',
        'affiliate_id',
        'transaction_id',
        'conversion_value',
        'commission',
        'user_earned',
        'sub1',
        'sub2',
        'sub3',
        'status',
        'payout_id',
        'admin_notes',
        'converted_at',
    ];

    protected $casts = [
        'conversion_value' => 'decimal:2',
        'commission' => 'decimal:2',
        'user_earned' => 'decimal:2',
        'converted_at' => 'datetime',
    ];

    // Relationships
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function postbackLog(): BelongsTo
    {
        return $this->belongsTo(PostbackLog::class);
    }

    public function campaignGoal(): BelongsTo
    {
        return $this->belongsTo(CampaignGoal::class);
    }

    public function affiliate(): BelongsTo
    {
        return $this->belongsTo(Affiliate::class);
    }

    public function payout(): BelongsTo
    {
        return $this->belongsTo(Payout::class);
    }

    public function click(): BelongsTo
    {
        return $this->belongsTo(Click::class, 'click_code', 'click_code');
    }
}

