<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Builder;

class GiftCardBrand extends Model
{
    use HasTranslations;

    protected $guarded = ['id'];
    protected $table = 'giftcard_brands';
    public $translatable = ['name','description','terms'];

    protected $casts = [
        'extra_information' => 'array',
        'items'             => 'array',
        'denomination'      => 'array',
        'countries'         => "array",
        'active'            => 'boolean',
    ];

    

    
}
