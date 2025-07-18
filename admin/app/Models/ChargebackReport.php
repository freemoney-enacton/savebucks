<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChargebackReport extends Model
{
    use HasFactory;

    protected $table = 'vw_chargeback_report';
}
