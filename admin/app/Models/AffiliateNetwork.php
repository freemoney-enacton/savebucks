<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Store;
use App\Models\Currency;
use Spatie\Translatable\HasTranslations;

class AffiliateNetwork extends Model
{

    protected $table = 'networks';

    protected $casts = [

        'columns_update' => 'array',
        'campaign_statuses' => 'array',
        'sale_statuses' => 'array',
        'auth_tokens' => 'array',
        'credentials' => 'array',

    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class, 'currency');
    }
    
}
