<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AffiliatePostbackLog extends Model
{
    use HasFactory;

    protected $casts = [
        'inputs' => 'array'
    ];

    protected $table = 'postback_logs';

    public function network()
    {
        return $this->belongsTo(AffiliateNetwork::class);
    }
}
