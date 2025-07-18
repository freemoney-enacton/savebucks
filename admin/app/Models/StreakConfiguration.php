<?php

namespace App\Models;

use App\Enums\RewardType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StreakConfiguration extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'reward_type' => RewardType::class
    ];
}
