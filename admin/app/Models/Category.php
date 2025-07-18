<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Category extends Model
{
    use HasFactory;
    use HasTranslations;

    public $translatable = ['name'];
    public $guarded  = ['id'];
    protected $table  = 'offerwall_categories';

    // public function getIconAttribute($value)
    // {
    //     return  $this->attributes['icon'] = pathinfo(parse_url($value, PHP_URL_PATH), PATHINFO_BASENAME);
    // }

    // public function getbannerImgAttribute($value)
    // {
    //     return  $this->attributes['banner_img'] = pathinfo(parse_url($value, PHP_URL_PATH), PATHINFO_BASENAME);
    // }
}
