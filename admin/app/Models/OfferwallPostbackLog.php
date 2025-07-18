<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\PostbackLogStatus;
use App\Models\Network;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OfferwallPostbackLog extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'offerwall_postback_logs';

    protected $casts = [
        'payload' => 'array',
        'data' => 'array',
        'status' => PostbackLogStatus::class
    ];

    public function networkModel(): BelongsTo
    {
        return $this->belongsTo(Network::class, 'network', 'code');
    }
}
