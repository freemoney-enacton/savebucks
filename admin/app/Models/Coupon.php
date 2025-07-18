<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Store;
use Spatie\Translatable\HasTranslations;

class Coupon extends Model
{
    use HasFactory;
    use HasTranslations;

    protected $casts = [
        'cats'          => 'array',
        'title'         => 'array',
        'description'   => 'array',
    ];

    protected $translatable = [
        'cats',
        'title',
        'description',
    ];

    public function Store()
    {
        return $this->belongsTo(Store::class);
    }
}
