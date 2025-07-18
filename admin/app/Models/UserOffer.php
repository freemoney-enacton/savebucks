<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserOffer extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $table = 'user_tasks';

    protected $casts = [
        'extra_info' => 'array',
    ];

    protected $fillable = [
        'network', 'offer_id', 'user_id', 'status', 'extra_info', 'created_at', 'updated_at', 'task_offer_id', 'offer_id', 'transaction_id', 'task_name', 'task_type', 'amount', 'payout', 'status', 'mail_sent', 'network_goal_id'
    ];

    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class, 'offer_id', 'offer_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(FrontUser::class, 'user_id', 'id');
    }

    public function offerGoal(): BelongsTo
    {
        return $this->belongsTo(OfferGoal::class, 'network_goal_id', 'network_goal_id ');
    }
}
