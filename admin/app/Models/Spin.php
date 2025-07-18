<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Spin extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Get all of the configurations for the Spin
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function configurations(): HasMany
    {
        return $this->hasMany(SpinConfiguration::class, 'spin_code', 'code');
    }

    public static function get()
    {
        return Spin::where('enabled',1)->pluck("name","code");
    }
}
