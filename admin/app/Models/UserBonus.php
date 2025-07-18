<?php

namespace App\Models;

use App\Enums\TransactionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserBonus extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'status' => TransactionStatus::class
    ];

    protected $table = 'user_bonus';

    public function user(): BelongsTo
    {
        return $this->belongsTo(FrontUser::class, 'user_id', 'id');
    }

    public function referredBonus(): BelongsTo
    {
        return $this->belongsTo(FrontUser::class, 'referred_bonus_id', 'id');
    }

    public function bonusCode(): BelongsTo
    {
        return $this->belongsTo(BonusType::class, 'bonus_code', 'code');
    }
}
