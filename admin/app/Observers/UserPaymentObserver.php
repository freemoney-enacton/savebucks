<?php
namespace App\Observers;

use App\Models\UserPayment;
use App\Notifications\PaymentStatusNotification;
use App\Models\NotificationTemplate;
use Illuminate\Support\Facades\Log;
use Filament\Notifications\Notification;

class UserPaymentObserver
{
    public function updated(UserPayment $userPayment): void
    {
        if (!$userPayment->wasChanged('status')) {
            return;
        }

        $newStatus = $userPayment->status->value;
        
        if (!in_array($newStatus, ['completed', 'declined', 'processing'])) {
            return;
        }

        // Fetch the email template based on status
        $template = $this->getTemplateByStatus($newStatus);
        
        if (!$template) {
            Log::error("Notification template for payment status '{$newStatus}' not found");
            Notification::make()
                ->title("Notification Template not found")
                ->description("Notification template for payment status '{$newStatus}' not found")
                ->danger()
                ->send();
            return;
        }

        $lang = $userPayment->user->lang ?? 'en';
        
        // Use Laravel's built-in getTranslation method if available
        $title = $this->getLocalizedText($template, 'title', $lang);
        $message = $this->getLocalizedText($template, 'description', $lang);
        
        // Replace placeholders
        $title = $this->replacePlaceholders($title, $userPayment);
        $message = $this->replacePlaceholders($message, $userPayment);

        // $userPayment->user->notify(new PaymentStatusNotification($title, $message));
        $userPayment->user->notify(new PaymentStatusNotification($title, $message, $userPayment, $template));
    }

    private function getTemplateByStatus(string $status): ?NotificationTemplate
    {
        $templateCodes = [
            'completed' => 'payment_status_completed',
            'declined' => 'payment_status_declined',
            'processing' => 'payment_status_processing'
        ];

        $templateCode = $templateCodes[$status] ?? null;
        
        if (!$templateCode) {
            return null;
        }

        return NotificationTemplate::where('template_code', $templateCode)->first();
    }

    private function getLocalizedText($template, string $field, string $lang): string
    {
        // Method 1: If your model uses Spatie's Laravel Translatable
        if (method_exists($template, 'getTranslation')) {
            return $template->getTranslation($field, $lang, false) ?: $template->getTranslation($field, 'en', false) ?: '';
        }

        // Method 2: If using Laravel's built-in JSON casting
        if (method_exists($template, 'getTranslations')) {
            $translations = $template->getTranslations($field);
            return $translations[$lang] ?? $translations['en'] ?? '';
        }

        // Method 3: Manual JSON handling (your current approach)
        $fieldValue = $template->getAttributes()[$field] ?? '';
        
        $data = json_decode($fieldValue, true);
        
        if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
            return trim($data[$lang] ?? $data['en'] ?? 'No translation found');
        }
        
        // If not JSON, return as plain text
        return trim($fieldValue);
    }

    private function replacePlaceholders(string $text, UserPayment $payment): string
    {
        $replacements = [
            '#payment.payment_id' => $payment->payment_id,
            '#payment.id' => $payment->id,
            '#payment.amount' => formatCurrency($payment->amount),
            '#payment.status' => $payment->status->value,
            '#payment.updated_at' => $payment->updated_at->format('Y-m-d H:i:s'),
            '#payment.created_at' => $payment->created_at->format('Y-m-d H:i:s'),
            '#user.name' => $payment->user->name ?? '',
            '#user.email' => $payment->user->email ?? '',
            // Handle typos in templates
            '# payment. payment_id' => $payment->payment_id,
            '# payment. amount' => formatCurrency($payment->amount),
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $text);
    }
}