<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Store;
use App\Models\AppUser;

class Click extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $casts = [
        'extra_info' => 'array'
    ];

    public function store()
    {
        return $this->belongsTo(Store::class, "store_id");
    }

    public function user()
    {
        return $this->belongsTo(AppUser::class, "user_id");
    }
}
