<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserEarning extends Model
{
    use HasFactory;
    protected $table = 'user_earnings';

    protected $primaryKey   = 'user_id';
    public $incrementing    = false;
    public $timestamps      = false;

    public function getRouteKeyName()
    {
        return 'user_id';
    }
}
