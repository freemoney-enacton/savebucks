<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Network;
use EnactOn\ProCashBee\Core\Models\Store as ModelsStore;
use Spatie\Translatable\HasTranslations;

class Store extends Model
{
    use HasFactory;
    use HasTranslations;

    protected $casts = [
        'cats' => 'array',
        'name' => 'array',
        'about' => 'array',
        'terms_todo' => 'array',
        'terms_not_todo' => 'array',
        'tracking_speed' => 'array',
        'country_tenancy' => 'array',
        'meta_title' => 'array',
        'meta_desc' => 'array',
        'h1' => 'array',
        'h2' => 'array',
    ];

    protected $translatable = [
        'name',
        'about',
        'terms_todo',
        'terms_not_todo',
        'tracking_speed',
        'meta_title',
        'meta_desc',
        'h1',
        'h2',
    ];


    public function network()
    {
        return $this->belongsTo(AffiliateNetwork::class);
    }

    public function storeCashback()
    {
        return $this->hasMany(StoreCashback::class, 'store_id');
    }


}
