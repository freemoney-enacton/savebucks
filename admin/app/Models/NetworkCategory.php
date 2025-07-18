<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;


class NetworkCategory extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('coupon', function (Builder $builder) {
            $builder->where('mapping_for', 'campaign');
        });
    }

    protected $attributes = [
        'mapping_for' => 'campaign',
    ];

    public function network()
    {
        return $this->belongsTo(Network::class, 'network');
    }

    public function category()
    {
        return $this->belongsTo(StoreCategory::class, 'sys_cat');
    }
}
