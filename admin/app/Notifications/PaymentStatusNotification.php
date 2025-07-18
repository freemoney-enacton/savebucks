<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\OneSignal\OneSignalMessage; 
use NotificationChannels\OneSignal\OneSignalWebButton;   
use App\Models\UserPayment;
use EnactOn\ProCashBee\Mail\Notifications\Channels\OneSignalChannel;
use App\Notifications\Channels\CustomDatabaseChannel;
use Illuminate\Support\Facades\Log;

class PaymentStatusNotification extends Notification
{
    use Queueable;

    private $title;
    private $message;
    private $payment; 
    private $originalTemplate; 

    /**
     * Create a new notification instance.
     */
    public function __construct($title, $message, UserPayment $payment = null, $originalTemplate = null)
    {
        $this->title            = $title;
        $this->message          = $message;
        $this->payment          = $payment;
        $this->originalTemplate = $originalTemplate;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return [OneSignalChannel::class, CustomDatabaseChannel::class];
    }

    /**
     * Get the OneSignal representation of the notification.
     * Keep this exactly as it was working
     */
    public function toOneSignal($notifiable)
    {   
        
        try{

            return OneSignalMessage::create()
                ->setSubject($this->title)  
                ->setBody($this->message)   
                ->setData('payment_id', $notifiable->payment_id ?? null)
                ->setData('type', 'payment_status');

        } catch (\Exception $e) {

            Log::error("onesignal notification failed for user {$notifiable->id} , payment id {$notifiable->payment_id}", ['error' => $e->getMessage()]);

        }
    }

    /**
     * Get the custom database representation for user_notifications table.
     */
    public function toCustomDatabase($notifiable): array
    {
        Log::info('Saving notification to user_notifications table', [
            'user_id'   => $notifiable->id,
            'title'     => $this->title,
            'message'   => $this->message
        ]);

        // Get available languages from config instead of hardcoding
        $availableLanguages = config('freemoney.languages.keys', ['en', 'de']);
        $userLang = $notifiable->lang ?? 'en';
        
        // If we have original template, create the JSON structure with replaced values
        $messageData = [];
        if ($this->originalTemplate && $this->payment) {

            foreach ($availableLanguages as $lang) {

                $templateTitle  = $this->getLocalizedText($this->originalTemplate, 'title', $lang);
                $templateDesc   = $this->getLocalizedText($this->originalTemplate, 'description', $lang);
                
                // Skip if no content for this language
                if (empty($templateTitle) && empty($templateDesc)) {
                    continue;
                }
                
                // Replace variables with actual values
                $processedTitle = $this->replacePlaceholders($templateTitle, $this->payment);
                $processedDesc  = $this->replacePlaceholders($templateDesc, $this->payment);
                
                $messageData[$lang] = json_encode([
                    'title'         => $processedTitle,
                    'description'   => $processedDesc
                ]);
            }
        }

        // Prepare template placeholder mappings for meta_data
        $variables = $this->getPlaceholderMappings();

        return [
            'message'   => json_encode($messageData), 
            'meta_data' => $variables, 
            'route'     => $this->originalTemplate?->route ?? null, 
        ];
    }

    /**
     * Get placeholder mappings for meta_data (same as used in replacePlaceholders)
     */
    private function getPlaceholderMappings(): array
    {
        if (!$this->payment) {
            return [
                'type' => 'payment_status',
                'timestamp' => now()->toISOString(),
            ];
        }

        return [
            // Template placeholders as keys with their actual values
            '#payment.payment_id' => $this->payment->payment_id,
            '#payment.id' => $this->payment->id,
            '#payment.amount' => formatCurrency($this->payment->amount),
            '#payment.status' => $this->payment->status->value,
            '#payment.updated_at' => $this->payment->updated_at->format('Y-m-d H:i:s'),
            '#payment.created_at' => $this->payment->created_at->format('Y-m-d H:i:s'),
            '#user.name' => $this->payment->user->name ?? '',
            '#user.email' => $this->payment->user->email ?? '',
            '# payment. payment_id' => $this->payment->payment_id, // Handle typos in templates
            '# payment. amount' => formatCurrency($this->payment->amount),
            
            // Additional useful metadata
            'type' => 'payment_status',
            'payment_internal_id' => $this->payment->id,
            'raw_amount' => $this->payment->amount,
            'timestamp' => now()->toISOString(),
        ];
    }

    /**
     * Helper method to get localized text (copied from observer)
     */
    private function getLocalizedText($template, string $field, string $lang): string
    {
        if (method_exists($template, 'getTranslation')) {
            return $template->getTranslation($field, $lang, false) ?: $template->getTranslation($field, 'en', false) ?: '';
        }

        if (method_exists($template, 'getTranslations')) {
            $translations = $template->getTranslations($field);
            return $translations[$lang] ?? $translations['en'] ?? '';
        }

        $fieldValue = $template->getAttributes()[$field] ?? '';
        $data = json_decode($fieldValue, true);
        
        if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
            return trim($data[$lang] ?? $data['en'] ?? '');
        }
        
        return trim($fieldValue);
    }


   /**
     * Helper method to replace placeholders (copied from observer)
     */
    private function replacePlaceholders(string $text, UserPayment $payment): string
    {
        $placeholders = $this->getPlaceholderMappings();
        
        // Remove non-placeholder keys for replacement
        $replacementData = array_filter($placeholders, function($key) {
            return strpos($key, '#') === 0;
        }, ARRAY_FILTER_USE_KEY);

        return str_replace(array_keys($replacementData), array_values($replacementData), $text);
    }

    /**
     * Get the array representation of the notification.
     */    public function toArray(object $notifiable): array
    {
        return [];
    }
}