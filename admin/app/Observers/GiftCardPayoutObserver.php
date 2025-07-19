<?php

namespace App\Observers;

use App\Models\GiftCardPayout;
use App\Enums\PaymentStatus;
use Filament\Notifications\Notification;
use Filament\Notifications\Actions\Action;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;
use Exception;

class GiftCardPayoutObserver
{
    /**
     * Handle the GiftCardPayout "created" event.
     */
    public function created(GiftCardPayout $giftCardPayout): void
    {
        //
    }

    public function updated(GiftCardPayout $giftCardPayout): void
    {
        if($giftCardPayout->isDirty('status')){
            $oldStatus = $giftCardPayout->getOriginal('status');
            $newStatus = $giftCardPayout->status;

            if ($newStatus !== PaymentStatus::Created) {
                $this->notifyAdminOfStatusChange($giftCardPayout, $oldStatus, $newStatus);
            }
        }
    }

    /**
     * Send Filament notification to admin about payout status change
     */
    private function notifyAdminOfStatusChange(GiftCardPayout $payout, PaymentStatus $oldStatus, PaymentStatus $newStatus): void
    {
        try {
            // Check if admin roles exist and get users
            $adminUsers = Role::where('name', 'admin')->exists()
                        ? User::role('admin')->get()
                        : collect();

            $superAdminUsers = Role::where('name', 'super_admin')->exists()
                ? User::role('super_admin')->get()
                : collect();

            // Combine collections and remove duplicates by 'id'
            $recipients = $adminUsers->merge($superAdminUsers)->unique('id');

            if ($recipients->isEmpty()) {
                Log::warning('No admin users found', ['payout_id' => $payout->id]);
                return;
            }

            $statusColor = $this->getStatusColor($newStatus);
            $statusIcon = $this->getStatusIcon($newStatus);

            $notification = Notification::make()
                ->title('GiftCard Payout Status Changed')
                ->body($this->buildNotificationBody($payout, $oldStatus, $newStatus))
                ->color($statusColor)
                ->icon($statusIcon)
                ->actions([
                    Action::make('view')
                        ->label('View Payout')
                        ->url(route('filament.admin.resources.gift-card-payouts.edit', $payout))
                        ->button(),
                ])
                ->persistent()
                ->duration(null);

            // Send to all admin users
            $successCount = 0;
            $failedUsers = [];

            foreach ($recipients as $admin) {
                try {
                    $notification->sendToDatabase($admin);
                    $successCount++;
                } catch (Exception $e) {
                    $failedUsers[] = $admin->id;
                    Log::error('Failed to send notification to admin user', [
                        'admin_id' => $admin->id,
                        'admin_email' => $admin->email,
                        'payout_id' => $payout->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            // Log success summary
            Log::info('Admin notification process completed', [
                'payout_id' => $payout->id,
                'old_status' => $oldStatus->value,
                'new_status' => $newStatus->value,
                'total_admins' => $adminUsers->count(),
                'successful_notifications' => $successCount,
                'failed_notifications' => count($failedUsers),
                'failed_admin_ids' => $failedUsers,
            ]);

        } catch (Exception $e) {
            Log::error('Critical error in notifyAdminOfStatusChange', [
                'payout_id' => $payout->id,
                'old_status' => $oldStatus->value,
                'new_status' => $newStatus->value,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    /**
     * Build notification body text
     */
    private function buildNotificationBody(GiftCardPayout $payout, PaymentStatus $oldStatus, PaymentStatus $newStatus): string
    {
        $userName = $payout->user->name ?? 'Unknown User';

        // Build a notification message
        $message = "The payout status for $userName has changed from " . ucfirst($oldStatus->value) .
                " to " . ucfirst($newStatus->value) . ". Payment ID: " . $payout->payment_id .
                " via " . strtoupper($payout->payment_method_code) . " for $" . number_format($payout->amount, 2) .
                " (User ID: $payout->user_id).";

        return $message;
    }


    /**
     * Get color based on status
     */
    private function getStatusColor(PaymentStatus $status): string
    {
        return match($status) {
            PaymentStatus::Completed    => 'success',
            PaymentStatus::Declined     => 'danger',
            PaymentStatus::Processing   => 'warning',
            PaymentStatus::Created      => 'info',
            default => 'gray'
        };
    }

    /**
     * Get icon based on status
     */
    private function getStatusIcon(PaymentStatus $status): string
    {
        return match($status) {
            PaymentStatus::Completed => 'heroicon-o-check-circle',
            PaymentStatus::Declined => 'heroicon-o-x-circle',
            PaymentStatus::Processing => 'heroicon-o-clock',
            PaymentStatus::Created => 'heroicon-o-information-circle',
            default => 'heroicon-o-question-mark-circle'
        };
    }
    /**
     * Handle the GiftCardPayout "deleted" event.
     */
    public function deleted(GiftCardPayout $giftCardPayout): void
    {
        //
    }

    /**
     * Handle the GiftCardPayout "restored" event.
     */
    public function restored(GiftCardPayout $giftCardPayout): void
    {
        //
    }

    /**
     * Handle the GiftCardPayout "force deleted" event.
     */
    public function forceDeleted(GiftCardPayout $giftCardPayout): void
    {
        //
    }
}
