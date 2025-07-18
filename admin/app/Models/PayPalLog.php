<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayPalLog extends Model
{
    protected $table = 'paypal_logs';

    protected $fillable = [
        'payment_id',
        'log_type',      
        'request_type',
        'request_payload',
        'response_payload',
        'status_code',
        'success',
        'error_message',
        'paypal_batch_id',
        'ip_address'
    ];

    protected $casts = [
        'request_payload' => 'array',
        'response_payload' => 'array',
        'success' => 'boolean',
    ];

    /**
     * Get the user payment associated with the log.
     */
    public function userPayment(): BelongsTo
    {
        return $this->belongsTo(UserPayment::class, 'payment_id');
    }

    /**
     * Create a log entry for a PayPal API call
     */
    public static function logPayPalRequest(
        int $paymentId,
        string $requestType,
        array $requestPayload,
        ?array $responsePayload = null,
        ?string $statusCode = null,
        bool $success = false,
        ?string $errorMessage = null,
        ?string $paypalBatchId = null
    ): self {
        return self::create([
            'payment_id' => $paymentId,
            'log_type' => 'user',   
            'request_type' => $requestType,
            'request_payload' => $requestPayload,
            'response_payload' => $responsePayload,
            'status_code' => $statusCode,
            'success' => $success,
            'error_message' => $errorMessage,
            'paypal_batch_id' => $paypalBatchId,
            'ip_address' => request()->ip()
        ]);
    }

     /**
     * New method for affiliate panel payouts
     */
    public static function logAffiliatePayout(
        int $payoutId,
        string $requestType,
        array $requestPayload,
        ?array $responsePayload = null,
        ?string $statusCode = null,
        bool $success = false,
        ?string $errorMessage = null,
        ?string $paypalBatchId = null
    ): self {
        return self::create([
            'payment_id'        => $payoutId,        
            'log_type'          => 'affiliate',          
            'request_type'      => $requestType,
            'request_payload'   => $requestPayload,
            'response_payload'  => $responsePayload,
            'status_code'       => $statusCode,
            'success'           => $success,
            'error_message'     => $errorMessage,
            'paypal_batch_id'   => $paypalBatchId,
            'ip_address'        => request()->ip()
        ]);
    }


    public function scopePayments($query)
    {
        return $query->where('log_type', 'user');
    }

    public function scopePayouts($query)
    {
        return $query->where('log_type', 'affiliate');
    }

    
}
