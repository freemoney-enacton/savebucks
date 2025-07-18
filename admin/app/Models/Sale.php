<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    public function network()
    {
        return $this->belongsTo(AffiliateNetwork::class);
    }

    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'network_campaign_id', 'network_campaign_id');
    }
}
