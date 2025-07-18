<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Translatable\HasTranslations;

class OfferGoal extends Model
{
    use HasFactory;
    use HasTranslations;
    protected $guarded = ['id'];

    protected $table = 'offerwall_task_goals';

    protected $fillable = [
        'network',
        'task_offer_id',
        'network_offer_id',
        'network_goal_id',
        'network_goal_name',
        'name',
        'description',
        'image',
        'cashback',
        'revenue',
        'status',
        'is_translated',
    ];

    protected $translatable = ['name', 'description'];

    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class, 'task_offer_id', 'offer_id');
    }
}
