<?php

namespace App\Models;

use App\Enums\PlatformTypes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserOfferClick extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'platform' => PlatformTypes::class,
    ];

    protected $table = 'user_task_clicks';

    public function user()
    {
        return $this->belongsTo(FrontUser::class, 'user_id', 'id');
    }

    public function offer()
    {
        return $this->belongsTo(Offer::class, 'task_offer_id', 'offer_id');
    }

    public function networkModel()
    {
        return $this->belongsTo(Network::class, 'network', 'code');
    }
}
