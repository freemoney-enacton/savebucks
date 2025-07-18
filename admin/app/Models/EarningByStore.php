<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;


class EarningByStore extends Model
{
    use HasFactory;
    use HasTranslations;

    protected $table = 'earning_by_stores';

    protected $translatable = [
        'name'
    ];

    public $incrementing = false;
    public $timestamps = false;
}
