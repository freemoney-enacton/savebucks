<?php

namespace App\Models;

use App\Enums\NetworkType;
use App\Enums\TransactionStatus;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRefferralEarning extends Model
{
    use HasFactory;
    // use HasTranslations;

    protected $table = 'user_referral_earnings';

    protected $guarded = ['id'];

    protected $casts = [
        'status' => TransactionStatus::class,
        'task_type' => NetworkType::class,
    ];

    public function user()
    {
        return $this->belongsTo(FrontUser::class, 'user_id');
    }

    public function referee()
    {
        return $this->belongsTo(FrontUser::class, 'referee_id');
    }


    public function networkModel()
    {
        return $this->belongsTo(Network::class, 'network', 'code');
    }

    public function offer()
    {
        return $this->belongsTo(Offer::class, 'task_offer_id', 'offer_id');
    }
}
