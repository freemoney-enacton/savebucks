<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDailyBonusLadder extends Model
{
    use HasFactory;

    protected $table = 'user_daily_bonus_ladder';

    public function user(): BelongsTo
    {
        return $this->belongsTo(FrontUser::class, 'user_id', 'id');
    }
}
