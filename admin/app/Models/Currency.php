<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory;

    protected $table = 'currencies';
    protected $guarded = ['id'];
    protected $fillable = [
        'name', 'iso_code', 'symbol', 'conversion_rate', 'symbol_position', 'enabled'
    ];
}
