<?php

namespace App\Models;

use App\Enums\NetworkType;
use App\Enums\TransactionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// use Spatie\Translatable\HasTranslations;

class UserOfferSale extends Model
{
    use HasFactory;
    // use HasTranslations;
    protected $guarded = ['id'];
    protected $translatable = [];
    protected $casts = [
        'extra_info' => 'array',
        'status' => TransactionStatus::class,
        'task_type' => NetworkType::class,
    ];


    protected $table = 'user_offerwall_sales';


    public function userTaskUploads()
    {
        return $this->hasMany(UserTaskUpload::class, 'task_offer_id', 'task_offer_id')->where('user_id',$this->user_id);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(FrontUser::class, 'user_id', 'id');
    }

    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class, 'task_offer_id', 'offer_id');
    }

    public function OfferGoal(): BelongsTo
    {
        return $this->belongsTo(OfferGoal::class, 'network_goal_id', 'network_goal_id');
    }

    public function network(): BelongsTo
    {
        return $this->belongsTo(Network::class, 'code', 'network');
    }

    public function networkModel(): BelongsTo
    {
        return $this->belongsTo(Network::class, 'network', 'code');
    }

    /**
     * Used new relationship function to display valid record data in front-end user's offer sales.
     */
    public function network_code(): BelongsTo
    {
        return $this->belongsTo(Network::class, 'network', 'code');
    }
}
