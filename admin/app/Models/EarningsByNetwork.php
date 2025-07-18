<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EarningsByNetwork extends Model
{
    use HasFactory;

    protected $table = 'earnings_by_network';

    public $incrementing = false;
    public $timestamps = false;
}
