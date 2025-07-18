<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Affiliate\Conversion;

class AffPostBack extends Model
{
    use HasFactory;    

    protected $connection = 'affiliate';
    protected $table = "postback_logs";

    protected $fillable = [
        'raw_postback_data',
        'transaction_id',
        'status',
        'status_messages',
        'received_at',
        'processed_at',
    ];

    protected $casts = [
        'raw_postback_data' => 'array',
        'status_messages' => 'array',
        'received_at' => 'datetime',
        'processed_at' => 'datetime',
    ];

    public $timestamps = false; // Using received_at/processed_at instead

    // Relationships
    public function conversion(): HasMany
    {
        return $this->hasMany(Conversion::class);
    }
}
