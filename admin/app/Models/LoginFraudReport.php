<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginFraudReport extends Model
{
    use HasFactory;

    protected $table = 'vw_login_frauds';
}
