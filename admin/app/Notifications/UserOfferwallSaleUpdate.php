<?php

namespace App\Notifications;

use App\Models\UserOfferSale;
use App\Models\NotificationTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\OneSignal\OneSignalMessage;
use Illuminate\Support\Facades\Log;
use EnactOn\ProCashBee\Mail\Notifications\Channels\OneSignalChannel;
use App\Notifications\Channels\CustomDatabaseChannel;


class UserOfferwallSaleUpdate extends Notification
{
    use Queueable;

    protected $userOfferSale;
    protected $newStatus;
    protected $oldStatus;

    /**
     * Create a new notification instance.
     */
    public function __construct(UserOfferSale $userOfferSale, string $newStatus, string $oldStatus = null)
    {   
        $this->userOfferSale    = $userOfferSale;
        $this->newStatus        = $newStatus;
        $this->oldStatus        = $oldStatus;

        // log::info("not startds classs construct -----> ");
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [OneSignalChannel::class, CustomDatabaseChannel::class];
    }

    public function toOneSignal($notifiable)
    {   

        try {

            $template = $this->getTemplate();

            if (!$template) {
                
                Log::error('Notification template not found for user offerwall sale',['offer_id' => $this->userOfferSale->id, 'status' => $this->newStatus,]);
                Notification::make()
                    ->title('Notification Template not found')
                    ->description("Notification template for '{$this->newStatus}' not found")
                    ->danger()
                    ->send();

                return null;

            } else {

                $lang       = $notifiable->lang ?? 'en';
                $title      = $this->getLocalizedText($template->getAttributes()['title'], $lang);
                $message    = $this->getLocalizedText($template->getAttributes()['description'], $lang);
                
                // Replace placeholders
                $title      = $this->replacePlaceholders($title);
                $message    = $this->replacePlaceholders($message);
            }

            // Log::info('Sending OneSignal notification for offer sale', [
            //     'user_id'   => $notifiable->id,
            //     'offer_id'  => $this->userOfferSale->id,
            //     'status'    => $this->newStatus,
            //     'title'     => $title,
            //     'message'   => $message
            // ]);

            return OneSignalMessage::create()
                ->setSubject($title)
                ->setBody($message)
                ->setData('offer_id', $this->userOfferSale->id)
                ->setData('status', $this->newStatus)
                ->setData('task_name', $this->userOfferSale->task_name);

        }catch(Exception $e) {

            Log::error('Failed to create OneSignal message for offer sale', [
                'error' => $e->getMessage(),
                'user_id' => $notifiable->id,
                'offer_id' => $this->userOfferSale->id
            ]);
            
            return null;          
          
        }
    }


    /**
     * Custom database notification for user_notifications table
     */

    public function toCustomDatabase($notifiable): array
    {
        Log::info('Saving offer sale notification to user_notifications table', [
            'user_id' => $notifiable->id,
            'offer_id' => $this->userOfferSale->id,
            'status' => $this->newStatus
        ]);

        $availableLanguages = config('freemoney.languages.keys', ['en', 'de']);
        $userLang           = $notifiable->lang ?? 'en';

        $messageData = [];
        $template    = $this->getTemplate();

          
        if ($template) {
            foreach ($availableLanguages as $lang) {
                // Get template text for this language
                $templateTitle  = $this->getLocalizedText($template->getAttributes()['title'], $lang);
                $templateDesc   = $this->getLocalizedText($template->getAttributes()['description'], $lang);
                
                // Skip if no content for this language
                if (empty($templateTitle) && empty($templateDesc)) {
                    continue;
                }
                
                // Replace placeholders with actual values
                $processedTitle = $this->replacePlaceholders($templateTitle);
                $processedDesc = $this->replacePlaceholders($templateDesc);
                
                $messageData[$lang] = json_encode([
                    'title'         => $processedTitle,
                    'description'   => $processedDesc
                ]);
            }
        }

        if (empty($messageData)) {

            Log::error('No template or translations found for offer sale notification', [
                'user_id'   => $notifiable->id,
                'offer_id'  => $this->userOfferSale->id,
                'status'    => $this->newStatus,
                'available_languages' => $availableLanguages
            ]);

            return [];
            
        }

        // Prepare metadata with template placeholder mappings
        $variables = $this->getPlaceholderMappings();

        return [
            'message'   => json_encode($messageData),
            'meta_data' => $variables,
            'route'     => $template?->route ?? null,
        ];

    }


    private function getTemplate()
    {
        $templateCode = $this->newStatus === 'confirmed' ? 'earning_notification' : 'declined_notification';
        return NotificationTemplate::where('template_code', $templateCode)->first();

    }

    private function getLocalizedText($text, $lang)
    {
        if (is_object($text) && method_exists($text, 'getTranslation')) {
            return $text->getTranslation($lang, false) ?: $text->getTranslation('en', false) ?: '';
        }

        // Handle Laravel's built-in JSON casting
        if (is_object($text) && method_exists($text, 'getTranslations')) {
            $translations = $text->getTranslations();
            return $translations[$lang] ?? $translations['en'] ?? '';
        }

        // Handle JSON string
        $data = json_decode($text, true);
        
        if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
            return trim($data[$lang] ?? $data['en'] ?? '');
        }
        
        // Return as plain text if not JSON
        return trim($text);
    }


    
    /**
     * Get placeholder mappings for meta_data (same as used in replacePlaceholders)
     */
    private function getPlaceholderMappings(): array
    {
        $taskName       = $this->userOfferSale->task_name ?? 'Unknown Task';
        $amount         = number_format($this->userOfferSale->amount, 2);
        $currency       = config('freemoney.default.default_currency', '€'); 
        $currencySymbol = ($currency === 'EUR') ? '€' : $currency;
        $network        = $this->userOfferSale->networkModel->name ?? $this->userOfferSale->network ?? 'Unknown Provider';

        return [
            // Template placeholders as keys with their actual values
            '#OFFER'        => $taskName,
            '#offer'        => $taskName,
            '#task'         => $taskName,
            '#amount'       => $amount,
            '#CURRENCY'     => $currencySymbol,
            '#currency'     => $currencySymbol,
            '#network'      => $network,
            '#NETWORK'      => $network,
            '#status'       => $this->newStatus,
            '#user.name'    => $this->userOfferSale->user->name ?? '',
            '#user.email'   => $this->userOfferSale->user->email ?? '',
            
            // Additional useful metadata
            'type'      => 'offer_status_update',
            'offer_id'  => $this->userOfferSale->id,
            'timestamp' => now()->toISOString(),
        ];
    }

    /**
     * Replace placeholders with actual values
     */
    private function replacePlaceholders($text)
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
