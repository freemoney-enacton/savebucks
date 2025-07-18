<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Banner extends Model
{
    use HasFactory;
    use HasTranslations;
    // use SoftDeletes;

    public $translatable = ['title', 'description'];
    public $guarded  = ['id'];


    protected $fillable = [
        'title',
        'description',
        'link',
        'desktop_img',
        'mobile_img',
        'have_content',
        'btn_link',
        'btn_text',
        'status',

    ];

    public function getDesktopImgAttribute($value)
    {
        return  $this->attributes['desktop_img'] = pathinfo(parse_url($value, PHP_URL_PATH), PATHINFO_BASENAME);
    }

    public function getMobileImgAttribute($value)
    {
        return  $this->attributes['mobile_img'] = pathinfo(parse_url($value, PHP_URL_PATH), PATHINFO_BASENAME);
    }
}
