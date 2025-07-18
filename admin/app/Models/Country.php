<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public static function getAll()
    {
        return static::where('is_enabled', 1)->orderBy('name')->pluck('name','code');
    }
}
