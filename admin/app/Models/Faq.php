<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Translatable\HasTranslations;

class Faq extends Model
{
    use HasFactory;
    use HasTranslations;

    protected $guarded = ['id'];
    protected $translatable = ['question', 'answer'];

    protected $casts = [
        'status' => ContentStatus::class
    ];

    /**
     * Get the category that owns the Faq
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(FaqCategory::class, 'category_code', 'category_code');
    }
}
