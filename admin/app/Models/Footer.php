<?php

namespace App\Models;

use App\Enums\ContentStatus;
use App\Enums\FooterTypes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Footer extends Model
{
    use HasFactory;
    use HasTranslations;

    protected $guarded = ['id'];

    public $translatable = ['title', 'footer_value'];

    protected $casts = [
        'status' => ContentStatus::class,
        'footer_type' => FooterTypes::class
    ];
}
