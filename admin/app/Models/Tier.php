<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Tier extends Model
{
    use HasFactory, HasTranslations;

    protected $translatable = [
        'label'
    ];
    protected $guarded = ['id'];

    protected $casts = [
        'enabled' => 'boolean',
    ];
}
