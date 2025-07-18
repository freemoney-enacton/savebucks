<?php

namespace App\Models;

use App\Enums\FrontUserStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;


class FrontUser extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Notifiable; 

    public $guarded = ['id'];

    protected $table = 'users';

    protected $casts = [
        'is_verified' => 'boolean',
        'is_deleted' => 'boolean',
        'deleted_at' => 'datetime',
        'status' => FrontUserStatus::class,
    ];


    /**
     * Route notification for one signal chanel using email
     */
    public function routeNotificationForOneSignal()
    {
        return [$this->email];
    }

    /**
     * Get all of the Bonus for the FrontUser
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function bonuses(): HasMany
    {
        return $this->hasMany(UserBonus::class, 'user_id', 'id');
    }

    /**
     * Get all of the OfferSales for the FrontUser
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function OfferSales(): HasMany
    {
        return $this->hasMany(UserOfferSale::class, 'user_id', 'id');
    }

    public function offerClicks(): HasMany
    {
        return $this->hasMany(UserOfferClick::class, 'user_id', 'id');
    }

    public function referralSales(): HasMany
    {
        return $this->hasMany(UserRefferralEarning::class, 'user_id', 'id');
    }

    public static function get()
    {
        return static::select(['id','name','email'])
            ->orderBy('created_at','desc')
            ->get()
            ->mapWithKeys(function ($user) {
                return [$user->id => $user->name];
            })
            ->toArray();
    }
}
