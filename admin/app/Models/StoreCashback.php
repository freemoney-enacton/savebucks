<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use App\Models\Store;
use EnactOn\ProCashBee\Core\Models\Store as ModelsStore;


class StoreCashback extends Model
{
    use HasFactory;
    use HasTranslations;

    protected $table = 'store_cashback';

    protected $translatable = [
        'title',
        'description'
    ];

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id');
    }

    protected static function booted()
    {
        static::saved(function ($model) {
           ModelsStore::directUpdateCashback($model->store_id);
        });
    }
}
