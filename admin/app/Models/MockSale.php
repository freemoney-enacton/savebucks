<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\AffiliateNetwork;

class MockSale extends Model
{
    use HasFactory;

    public function network()
    {
        return $this->belongsTo(AffiliateNetwork::class);
    }
}
