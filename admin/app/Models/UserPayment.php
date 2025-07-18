<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Observers\UserPaymentObserver;                    
use Illuminate\Database\Eloquent\Attributes\ObservedBy;  

#[ObservedBy([UserPaymentObserver::class])]
class UserPayment extends Model 
{
    use HasFactory;

    protected $table = 'user_payments';

    protected $guarded = ['id'];

    protected $casts = [
        'payment_input' => 'array',
        'api_response' => 'array',
        'status' => PaymentStatus::class
    ];

    public function user()
    {
        return $this->belongsTo(FrontUser::class, 'user_id', 'id')->withTrashed();
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentType::class, 'payment_method_code', 'code');
    }
}
