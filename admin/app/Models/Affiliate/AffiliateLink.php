<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


// AffiliateLink Model
class AffiliateLink extends Model
{
    use HasFactory;

    protected $connection = 'affiliate';

    protected $fillable = [
        'campaign_id',
        'affiliate_id',
        'slug',
        'destination_url',
        'sub1',
        'sub2',
        'sub3',
        'total_clicks',
        'total_earnings',
        'status',
    ];

    protected $casts = [
        'total_clicks' => 'integer',
        'total_earnings' => 'decimal:2',
    ];

    // Relationships
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function affiliate(): BelongsTo
    {
        return $this->belongsTo(Affiliate::class);
    }

    public function clicks(): HasMany
    {
        return $this->hasMany(Click::class);
    }
}
