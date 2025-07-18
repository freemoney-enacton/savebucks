<?php

namespace App\Models;

use App\Enums\OfferStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class Offer extends Model
{
    use HasTranslations;
    use HasFactory;

    protected $casts = [
        'countries' => 'array',
        'devices' => 'array',
        'platforms' => 'array',
        'network_categories' => 'array',
        'network_goals' => 'array',
        'status' => OfferStatus::class,
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // protected $hidden = ['created_at', 'updated_at'];
    protected $guarded = ['id'];
    protected $table = 'offerwall_tasks';

    protected $translatable = [
        'name', 'description', 'instructions',
    ];

    // public function campaign()
    // {
    //     return $this->belongsTo(campaign::class, 'campaign_id');
    // }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function OfferGoal(): HasMany
    {
        return $this->hasMany(OfferGoal::class, 'task_offer_id', 'offer_id');
    }

    /**
     * Get the network that owns the Offer
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function networkModel(): BelongsTo
    {
        return $this->belongsTo(Network::class, 'network', 'code');
    }
    // public function userOffers(): \Illuminate\Database\Eloquent\Relations\HasMany
    // {

    // }
}
