<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class StoreCategory extends Model
{
    use HasFactory;
    use HasTranslations;

    protected $casts = [
        'name' => 'array',
        'description' => 'array',
        'h1' => 'array',
        'h2' => 'array',
        'meta_title' => 'array',
        'meta_desc' => 'array',
    ];

    protected $translatable = [
        "name",
        "description",
        "h1",
        "h2",
        "meta_title",
        "meta_desc"
    ];

    public function parent()
    {
        return $this->belongsTo(StoreCategory::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(StoreCategory::class, 'parent_id');
    }
}
