<?php

namespace App\Models;

use App\Enums\RewardType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\Translatable\HasTranslations;

class BonusCode extends Model
{
    use HasFactory;
    use HasTranslations;

    protected $guarded = ['id'];
    public $translatable = [];

    protected $casts = [
        "reward_type" => RewardType::class
    ];

    public static function get()
    {
        return static::select(['id','title','code'])
            ->orderBy('created_at','desc')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->code => $item->title];
            })
            ->toArray();
    }


    /**
     * Get all of the spinconfigs for the BonusCode
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function spin(): HasOne
    {
        return $this->hasOne(Spin::class, 'code', 'spin_code');
    }

    /**
     * Get all of the spinconfigs for the BonusCode
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function spinconfigs(): HasMany
    {
        return $this->hasMany(SpinConfiguration::class, 'spin_code', 'spin_code');
    }
}
