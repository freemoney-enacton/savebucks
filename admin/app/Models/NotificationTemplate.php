<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class NotificationTemplate extends Model
{
    use HasFactory;
    use HasTranslations;


    public $translatable = ['title', 'description'];

    protected $casts = [
        'title'       => 'json',
        'description' => 'json',
    ];

    protected $guard = ['id'];
}
