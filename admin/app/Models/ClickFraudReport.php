<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClickFraudReport extends Model
{
    use HasFactory;

    protected $table = 'vw_click_frauds';
}
