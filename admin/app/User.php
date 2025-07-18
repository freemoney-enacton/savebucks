<?php

namespace App;

use EnactOn\ProCashBee\Core\Traits\BeeUserTrait;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;


class User extends Authenticatable
{
    use Notifiable;
    use HasApiTokens;
    use BeeUserTrait;
    use SoftDeletes;

    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name', 'last_name', 'name', 'email', 'password', 'referrer_code', 'lang', 'secondary_email ', 'email_verified_at', 'phone_number', 'phone_verified_at', 'provider_type', 'provider_id', 'referral_code', 'notification_settings', 'tracking_params', 'postback_confirmations','country','profile_picture'
    ];


    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'notification_settings' => 'array',
        'tracking_params' => 'array',
        'postback_confirmations' => 'array',
    ];


}

