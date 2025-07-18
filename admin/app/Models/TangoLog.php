<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TangoLog extends Model
{
    protected $table = 'tango_logs';
    protected $guarded = ['id'];

    protected $casts = [
        'data' => 'array',
        'response' => 'array',
    ];
}
