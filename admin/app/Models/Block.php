<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Block extends Model
{
    use HasFactory;
    use HasTranslations;
    // use SoftDeletes;
    public $guarded = ['id'];
    public $translatable = ['name', 'blocks'];
    protected $fillable = ['id', 'name', 'purpose', 'blocks', 'status', 'created_at', 'updated_at'];

    protected $casts = [
        'blocks' => 'array',
        'status' => ContentStatus::class
    ];
}
