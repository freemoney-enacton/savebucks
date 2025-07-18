<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NetworkCoupon extends Model
{
    use HasFactory;

    protected $casts = [
        'extra_information' => 'array',
    ];

    public function network()
    {
        return $this->belongsTo(AffiliateNetwork::class);
    }
}
