<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Affiliate\Affiliate;
use App\Models\PayPalLog;
// Payout Model
class Payout extends Model 
// implements Auditable
{
    use HasFactory;
    // \OwenIt\Auditing\Auditable;

    protected $connection = 'affiliate';

    protected $fillable = [
        'affiliate_id',
        'requested_amount',
        'status',
        'payment_method',
        'payment_account',
        'payment_details',
        'admin_notes',
        'transaction_id',
        'api_reference_id',
        'api_status',
        'api_response',
        'paid_at',
    ];

    protected $casts = [
        'requested_amount' => 'decimal:2',
        'api_response' => 'array',
        'paid_at' => 'datetime',
    ];

    // Relationships
    public function affiliate()
    {
        return $this->belongsTo(Affiliate::class, 'affiliate_id', 'id');
    }

    public function conversions(): HasMany
    {
        return $this->hasMany(Conversion::class);
    }

    // public function paymentLogs()
    // {
    //     return $this->hasMany(PayPalLog::class, 'payment_id', 'id')->where('log_type', 'affiliate');
    // }

    //as db different , using this method
    public function paymentLogs()
    {
        $query = \App\Models\PayPalLog::on('pgsql') // Use on() instead
            ->where('payment_id', $this->id)
            // ->where('payment_method', 'paypal')
            ->where('log_type', 'affiliate');

        // dd([
        //     'payout_transaction_id' => $this->transaction_id,
        //     'query_sql' => $query->toSql(),
        //     'query_bindings' => $query->getBindings(),
        //     'results' => $query->get()
        // ]);
        
        return $this->newHasMany($query, $this, 'payment_id', 'id');
    }


 
}
