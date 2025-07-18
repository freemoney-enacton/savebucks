<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Store;
use App\Models\AppUser;
use App\Models\AffiliateNetwork;

class UserSale extends Model
{
    use HasFactory;

    protected $casts = [
        'note' => 'array',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function user()
    {
        return $this->belongsTo(AppUser::class);
    }

    public function network()
    {
        return $this->belongsTo(AffiliateNetwork::class, 'network_id');
    }
}
