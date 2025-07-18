<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class BonusType extends Model
{
    use HasFactory;
    use HasTranslations;
    // use SoftDeletes;
    public $guarded = ['id'];
    public $translatable = ['name'];
    public $timestamps = false;
    protected $fillable = ['name', 'code', 'amount', 'qualifying_amount', 'validity_days', 'enabled'];


    public static function getAll()
    {
        $bonusTypes = static::select(['id','code','name'])
            ->orderBy('id','desc')
            ->get()
            ->mapWithKeys(function ($user) {
                return [$user->id => $user->name];
            })
            ->toArray();

        $additionalTypes = [
            'bonus_code' => 'Bonus Code',
            'daily_streak_bonus' => 'Daily Streak Bonus',
            'daily_ladder_bonus' => 'Daily Ladder Bonus'
        ];

        return array_merge($bonusTypes, $additionalTypes);
    }
}
