<?php

namespace App\Models;

use App\Enums\LeaderboardFrequency;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class LeaderboardSetting extends Model
{
    use HasFactory;

    use HasTranslations;

    public $translatable = ['name'];
    public $guarded = ['id'];

    protected $casts = [
        'frequency' => LeaderboardFrequency::class,
    ];

    /**
     * Get all of the runs for the LeaderboardSetting
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function runs(): HasMany
    {
        return $this->hasMany(LeaderboardRun::class, 'code', 'code');
    }
}
