<?php

namespace App\Notifications\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CustomDatabaseChannel
{
    /**
     * Send the given notification.
     */
    public function send($notifiable, Notification $notification)
    {
        $data = $notification->toCustomDatabase($notifiable);
        
        Log::info('Saving notification to user_notifications table', [
            'user_id'   => $notifiable->id,
            'message'   => $data['message'] ?? '',
            'meta_data' => $data['meta_data'] ?? []
        ]);

        return DB::table('user_notifications')->insert([
            'user_id'               => $notifiable->id,
            'type'                  => null,
            'notifiable_type'       => null,  
            'notifiable_id'         => null,
            'message'               => $data['message'] ?? '', // Processed message with variables replaced
            'meta_data'             => json_encode($data['meta_data'] ?? []), // All variables and values
            'onesignal_response'    => null,
            'is_read'               => 0,
            'route'                 => $data['route'] ?? null,
            'created_at'            => now(),
            'updated_at'            => null,
        ]);
    }
}