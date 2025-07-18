<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ExportCompleted extends Notification
{
    use Queueable;

    protected $filePath;
    protected $filename;
    protected $successfulRows;
    protected $failedRows;

    /**
     * Create a new notification instance.
     */
    public function __construct($filePath, $filename, $successfulRows, $failedRows)
    {
        $this->filePath = $filePath;
        $this->filename = $filename;
        $this->successfulRows = $successfulRows;
        $this->failedRows = $failedRows;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    // public function toMail(object $notifiable): MailMessage
    // {
    //       return (new MailMessage)
    //         ->subject('Daily Earning Report Export Completed')
    //         ->line('Your daily earning report export has completed.')
    //         ->line($this->successfulRows . ' rows were exported successfully.')
    //         ->line($this->failedRows > 0 ? $this->failedRows . ' rows failed to export.' : '')
    //         ->action('Download CSV', route('download.export', ['filename' => $this->filename]))
    //         ->line('Thank you for using our application!');
    // }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
