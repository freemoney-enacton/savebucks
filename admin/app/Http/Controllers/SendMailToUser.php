<?php

namespace App\Http\Controllers;

use App\Filament\Pages\AppSettings;
use App\Mail\VerifyUser;
use App\Models\UserOfferSale;
use App\Models\UserPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

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
                $user_payment = UserPayment::where('id', $request->user_payment_id)->with('user', 'paymentMethod')->first();

                if ($user_payment) {
                    $data = [
                        'email' => settings()->get('admin_email'),
                        'use_payment' => $user_payment,
                        'url' => route('filament.admin.resources.user-payments.edit', $user_payment->id),
                        'amount' => formatCurrency($user_payment->amount, settings()->get('default_currency')),
                        'cashback_amount' => formatCurrency($user_payment->cashback_amount, settings()->get('default_currency')),
                        'bonus_amount' => formatCurrency($user_payment->bonus_amount, settings()->get('default_currency')),
                    ];
                    info($data);
                    Mail::to(settings()->get('admin_email'))->send(new \App\Mail\UserPayOutRequestMail($data));
                } else {
                    return response()->json(['message' => 'Something went wrong.'], 500);
                }
                break;
            case "cashback_tracked":
            $userSale = UserOfferSale::where('id', $request->user_sale_id)->with('user')->first();

            if ($userSale) {
               
                Mail::to(settings()->get('admin_email'))->send(new \App\Mail\UserOfferSalesMail($userSale));
            } else {
                return response()->json(['message' => 'Something went wrong.'], 500);
            }
            break;
            case "cashback_updated":
            $userSale = UserOfferSale::where('id', $request->user_sale_id)->with('user')->first();

            if ($userSale) {
               
                Mail::to(settings()->get('admin_email'))->send(new \App\Mail\UserOfferSalesMail($userSale));
            } else {
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
}
