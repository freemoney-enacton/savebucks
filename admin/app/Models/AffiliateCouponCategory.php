<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;

class AffiliateCouponCategory extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'network_categories';

    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('coupon', function (Builder $builder) {
            $builder->where('mapping_for', 'coupon');
        });
    }

    protected $attributes = [
        'mapping_for' => 'coupon',
    ];
}
