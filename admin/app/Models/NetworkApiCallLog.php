<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\AffiliateNetwork;

class NetworkApiCallLog extends Model
{
    use HasFactory;

    protected $casts = [
        "params" => "array"
    ];

    public function network()
    {
        return $this->belongsTo(AffiliateNetwork::class);
    }
    
}
