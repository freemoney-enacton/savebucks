<?php

namespace App\Models;

use App\Enums\LeaderboardRunStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class LeaderboardRun extends Model
{
    use HasFactory;

    use HasTranslations;

    public $translatable = ['name'];
    public $guarded = ['id'];


    protected $casts = [
        'status' => LeaderboardRunStatus::class,
    ];

}
