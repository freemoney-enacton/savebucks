<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FaqCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'category_code', 'sort_order'
    ];
    protected $guarded = ['id'];
    protected $table = 'faq_categories';

    public function faqs(): HasMany
    {
        return $this->hasMany(Faq::class, 'category_code', 'category_code');
    }

    public static function get()
    {
        return static::select(['id','name','category_code'])
            ->orderBy('created_at','desc')
            ->get()
            ->mapWithKeys(function ($faqCat) {
                return [$faqCat->category_code => $faqCat->name];
            })
            ->toArray();
    }
}
