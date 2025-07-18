<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public $timestamps = false;

    // Add casts to the model
    protected $casts = [
        'sent_at' => 'datetime', // Cast sent_at to a datetime object
    ];


    /**
     * Get the user that owns the Message
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(FrontUser::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class,'room_code','code');
    }
}
