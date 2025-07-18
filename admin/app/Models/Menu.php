<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Menu extends Model
{
    use HasFactory;
    use HasTranslations;
    // use SoftDeletes;


    protected $fillable = [
        'title',
        'links',
        'status',
    ];
    public $guarded  = ['id'];
    public $translatable = ['title'];
}
