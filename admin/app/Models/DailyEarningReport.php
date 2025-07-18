<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyEarningReport extends Model
{
    use HasFactory;

    protected $table        = 'daily_earning_report';
    public $incrementing    = false;
    protected $primaryKey   = 'date'; 
    public $timestamps      = false;

    protected $casts = [
        'date'              => 'date', 
        'sales_revenue'     => 'float',
        'task_revenue'      => 'float',
        'total_revenue'     => 'float',
        'task_cashback'     => 'float',
        'store_cashback'    => 'float',
        'bonus'             => 'float',
        'referral'          => 'float',
        'total_cashback'    => 'float',
        'total_bonus'       => 'float',
        'net_profit'        => 'float',
    ];

}
