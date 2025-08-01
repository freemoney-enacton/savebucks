<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Spatie\Translatable\HasTranslations;

class Translation extends Model
{
    use HasFactory;
    // use HasTranslations;
    protected $guarded = ['id'];
    protected $fillable = ['page', 'module',  'trans_key', 'trans_value'];
    public $timestamps = false;
    protected $cast = [
        'trans_value' => 'array'
    ];

    // public $translatable = ['trans_value'];
}
