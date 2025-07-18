<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpinConfiguration extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'spin_configuration';
}
