<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class UserPaymentMode extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $table = 'user_payment_modes';
    protected $casts = [
        'payment_inputs' => 'array',
        'enabled' => 'boolean',
    ];
    public function user(): HasOne
    {
        return $this->hasOne(FrontUser::class, 'id', 'user_id');
    }

    public function method(): HasOne
    {
        return $this->hasOne(PaymentType::class, 'code', 'method');
    }
}
