<?php

namespace App\Http\Controllers;

use App\Filament\Pages\AppSettings;
use App\Mail\VerifyUser;
use App\Models\UserPayment;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Filament\Notifications\Actions\Action;
use App\Filament\Resources\UserPaymentResource;
use Filament\Notifications\Notification;
use Illuminate\Support\Collection;
use App\Filament\Affiliate\Resources\PayoutResource;

class SendMailToUser extends Controller
{

    public static function sendMailToUser(Request $request)
    {
        if ($request->has('email') && $request->has('type')) {
            $email = $request->email;
            $type = $request->type;
        }
        $data = [];
        switch ($request->type) {
            case "verify":
                $data = [
                    'email' => $request->email,
                    'type' => $request->type,
                    'otp' => $request->otp,
                    'name' => $request->name
                ];

                Mail::to($email)->send(new VerifyUser($data));
                break;

            case "forgot":
                $data = [
                    'email' => $email,
                    'type' => $type,
                    'name' => $request->name,
                    'otp' => $request->otp
                ];
                Mail::to($email)->send(new \App\Mail\ForgetPassword($data));
                break;

            case "payout_request":

                Log::info('Payout request process started ===>', ['user_payment_id' => $request->user_payment_id]);

                $user_payment = UserPayment::where('id', $request->user_payment_id)->with('user', 'paymentMethod')->first();

                if ($user_payment) {
                    //  Log::info('User payment found', ['user_payment_id' => $user_payment->id]);

                    $currency = config('freemoney.default.currency', 'USD');

                    $data = [
                        'use_payment'       => $user_payment,
                        'url'               => route('filament.admin.resources.user-payments.edit', $user_payment->id),
                        'amount'            => $currency." ". number_format($user_payment->amount, 2),
                    ];

                    // Send email to admin
                    $adminEmails        = config('freemoney.default.admin_emails', 'hello@swittch.app');
                    $adminEmailsArray   = explode(',', $adminEmails);

                    foreach ($adminEmailsArray as $adminEmail) {
                        Mail::to(trim($adminEmail))->send(new \App\Mail\UserPayOutRequestMail($data));
                    }
                    Log::info('Payout request email sent to admin', ['user_payment_id' => $user_payment->id, "admin emails" => $adminEmailsArray]);

                    // Send email to user
                    Mail::to($user_payment->user->email)->send(new \App\Mail\UserPayOutInitiatedMail($data));

                   //NOTIFICATIONS PART
                    $adminUsers = Role::where('name', 'admin')->exists()
                        ? User::role('admin')->get()
                        : collect();

                    $superAdminUsers = Role::where('name', 'super_admin')->exists()
                        ? User::role('super_admin')->get()
                        : collect();

                    // Combine collections and remove duplicates by 'id'
                    $recipients = $adminUsers->merge($superAdminUsers)->unique('id');

                    if ($recipients->isNotEmpty()) {

                        Notification::make()
                            ->title('New Payout Request')
                            ->body($user_payment->user->name . " has submitted a payout request for Payment ID: #" . $user_payment->payment_id . ".")
                            ->actions([
                                Action::make('View Request')
                                    ->url(UserPaymentResource::getUrl('edit', ['record' => $user_payment]))
                                    ->button()
                                    ->color('warning')
                            ])
                            ->success()
                            ->icon('heroicon-o-banknotes')
                            ->iconColor('success')
                            ->persistent()
                            ->sendToDatabase($recipients);

                        Log::info('Payout notification sent to admins');

                    } else {

                        Log::warning('No admin users found for notification');
                    }

                } else {

                    Log::error('User payment not found', ['user_payment_id' => $request->user_payment_id]);
                    return response()->json(['message' => 'Something went wrong.'], 500);
                }
                break;

            default:
                $data = [
                    'email' => $request->email,
                    'name' => $request->name,
                    'type' => $type
                ];
                Mail::to($email)->send(new \App\Mail\WelcomeUser($data));
                break;
        }
        return response()->json(['message' => 'Email sent successfully.'], 200);
    }

    //Affiliate Mail Manage
    public static function sendMailToAffiliate(Request $request){

        Log::info("affiliate emails=====>", ['re' => $request]);

        $userId = $request->get('userId');
        $type   = $request->get('type', 'verify');

        Log::info("affiliate emails=====>", ['userId' => $userId, 'type' => $type]);

        $data = [];

        switch ($type) {

            case "verify":

                if (!$userId) {
                    return response()->json(['error' => 'userId is required for verification'], 400);
                }

                // Find affiliate by userId for verify case
                $affiliate = \App\Models\Affiliate\Affiliate::find($userId);

                if (!$affiliate) {
                    return response()->json(['error' => 'Affiliate not found'], 404);
                }

                $verificationLink = $request->get('verificationLink');

                Log::info("affiliate verificationLink =====>", ['verificationLink' => $verificationLink]);

                if (!$verificationLink) {
                    return response()->json(['error' => 'verificationLink is required for verification'], 400);
                }

                $data = [
                    'email'     => $affiliate->email,
                    'name'      => $affiliate->name,
                    'type'      => $type,
                    'verification_link' => $verificationLink,
                    'user_id'   => $userId
                ];

                Mail::to($affiliate->email)->send(new \App\Mail\AffiliateVerifyEmail($data));
                break;

            case "payout_request":

                $payoutId = $request->get('payout_id');

                if (!$payoutId) {
                    return response()->json(['error' => 'payout_id is required for payout request'], 400);
                }

                $payout = \App\Models\Affiliate\Payout::with('affiliate')->find($payoutId);

                log::info("payoutId =====>", ['payoutId' => $payoutId]);

                if (!$payout) {
                    return response()->json(['error' => 'Payout not found'], 404);
                }

                // Get affiliate from the loaded relationship
                $affiliate = $payout->affiliate;

                if (!$affiliate) {
                    return response()->json(['error' => 'Affiliate not found for this payout'], 404);
                }

                $currency = config('freemoney.default.default_currency', 'USD');

                $data = [
                    'email'         => $affiliate->email,
                    'name'          => $affiliate->name,
                    'amount'        => $currency . ' ' . number_format($payout->requested_amount, 2),
                    'payment_method'=> $payout->payment_method,
                    'transaction_id'=> $payout->transaction_id,
                    'request_date'  => $payout->created_at->format('F d, Y \a\t h:i A'),
                    'url'           => route('filament.affiliate.resources.payouts.edit', $payout->id),
                ];

                //Send Email To Admin
                $adminEmails        = config('freemoney.default.admin_emails', 'hello@swittch.app');
                $adminEmailsArray   = explode(',', $adminEmails);

                foreach ($adminEmailsArray as $adminEmail) {
                    Mail::to(trim($adminEmail))->send(new \App\Mail\AffiliateAdminPayoutRequestMail($data));
                }
                Log::info('Affiliate Payout request email sent to admin', ['user_payment_id' => $request->payout_id, "admin emails" => $adminEmailsArray]);
               
                //Send Email To Affiliate
                Mail::to($affiliate->email)->send(new \App\Mail\AffiliatePayoutRequestMail($data));

                //Send Notification To Affiliate Admin
                try {

                    $affiliateRoles = \Spatie\Permission\Models\Role::where('name', 'LIKE', 'affiliate%')->pluck('name');
                    $recipients = $affiliateRoles->isNotEmpty()
                                ? \App\Models\User::role($affiliateRoles->toArray())->get()
                                : collect();

                    if ($recipients->isNotEmpty()) {
                        Notification::make()
                            ->title('New Affiliate Payout Request')
                            ->body($affiliate->name . " has submitted a payout request for Transaction ID: #" . $payout->transaction_id . ".")
                            ->actions([
                                Action::make('View Request')
                                    // ->url(PayoutResource::getUrl('edit', ['record' => $payout]))
                                    ->url('/affiliate/payouts/' . $payout->id . '/edit')
                                    ->button()
                                    ->color('warning')
                            ])
                            ->success()
                            ->icon('heroicon-o-banknotes')
                            ->iconColor('success')
                            ->persistent()
                            ->sendToDatabase($recipients);

                        Log::info("Notification : Payout request notification sent to admins ===>", [
                            'payout_id' => $payoutId,
                            'recipients_count' => $recipients->count()
                        ]);
                    } else {
                        Log::info("Notification : No affiliate admin recipients found for notification", ['payout_id' => $payoutId]);
                    }
                } catch (\Exception $e) {
                    Log::error("Notification : Failed to send notification to affiliate admins", [
                        'payout_id' => $payoutId,
                        'error' => $e->getMessage()
                    ]);
                }
                break;

            case "reset_password":

                $userEmail = $request->get('user_email');
                $verificationLink = $request->get('verificationLink');

                Log::info("Reset Password: ======>", ['user_email' => $userEmail, 'verificationLink' => $verificationLink]);

                if (!$userEmail) {
                    return response()->json(['error' => 'user_email is required for password reset'], 400);
                }

                if (!$verificationLink) {
                    return response()->json(['error' => 'verificationLink is required for password reset'], 400);
                }

                $affiliate = \App\Models\Affiliate\Affiliate::where('email', $userEmail)->first();

                if (!$affiliate) {
                    return response()->json(['error' => 'Affiliate not found with this email'], 404);
                }

                $data = [
                    'email'     => $affiliate->email,
                    'name'      => $affiliate->name,
                    'type'      => $type,
                    'reset_link'=> $verificationLink,
                    'user_id'   => $affiliate->id
                ];

                Mail::to($affiliate->email)->send(new \App\Mail\AffiliateResetPasswordMail($data));

                Log::info("Reset Password: ======> mail.........class " . json_encode($data));

                break;

            case "welcome":
            default:

                if (!$userId) {
                    return response()->json(['error' => 'userId is required for welcome email'], 400);
                }

                $affiliate = \App\Models\Affiliate\Affiliate::find($userId);

                if (!$affiliate) {
                    return response()->json(['error' => 'Affiliate not found'], 404);
                }

                $data = [
                    'email'     => $affiliate->email,
                    'name'      => $affiliate->name,
                    'type'      => $type,
                    'user_id'   => $userId
                ];
                Mail::to($affiliate->email)->send(new \App\Mail\AffiliateWelcomeMail($data));
                break;
        }
        return response()->json(['message' => 'Email sent successfully.'], 200);
    }

}
