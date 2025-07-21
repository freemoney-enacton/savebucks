<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Affiliate\Campaign;
use App\Models\Affiliate\AffiliateLink;
use App\Models\Affiliate\Affiliate;


// Click Model
class Click extends Model
{
    use HasFactory;

    protected $connection = 'affiliate';

    protected $fillable = [
        'campaign_id',
        'affiliate_link_id',
        'affiliate_id',
        'click_code',
        'ip_address',
        'user_agent',
        'referrer',
        'country',
        'city',
        'device_type',
        'sub1',
        'sub2',
        'sub3',
        'campaign_goals',
        'is_converted',
        'clicked_at',
    ];

    protected $casts = [
        'is_converted' => 'boolean',
        'clicked_at' => 'datetime',
        'campaign_goals' => 'array',
    ];

    public $timestamps = false; // Using clicked_at instead

    // Relationships
    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function affiliateLink()
    {
        return $this->belongsTo(AffiliateLink::class);
    }

    public function affiliate()
    {
        return $this->belongsTo(Affiliate::class);
    }

    public function conversion()
    {
        return $this->hasMany(Conversion::class, 'click_code', 'click_code');
    }
}
