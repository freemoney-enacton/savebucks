<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\AffiliateNetwork;

class NetworkRun extends Model
{
    protected $table = 'network_run';
    public $timestamps = false;

    use HasFactory;

    public function network()
    {
        return $this->belongsTo(AffiliateNetwork::class);
    }
}
