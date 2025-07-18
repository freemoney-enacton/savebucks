<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\AppUser;

class UserReferrerSale extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(AppUser::class);
    }

    public function shopper()
    {
        return $this->belongsTo(AppUser::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
