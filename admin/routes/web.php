<?php

use App\Http\Controllers\CustomAppSettingsController;
use App\Http\Controllers\LabelTranslationController;
use App\Http\Controllers\ManageTaskImageController;
use App\Http\Controllers\SendMailToUser;
use App\Http\Controllers\SendSmsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return redirect()->route('filament.admin.auth.login');
});

Route::post('/settings', [CustomAppSettingsController::class, 'store'])->name('settings.store');

Route::get('/downloadTaskImage/{network}', [ManageTaskImageController::class, 'downloadTaskImage'])->name('downloadTaskImage');
Route::get('/send-mail-to-user', [SendMailToUser::class, 'sendMailToUser'])->name('send_mail_to_user');
Route::get('/send-mail-to-affiliate', [SendMailToUser::class, 'sendMailToAffiliate'])->name('send_mail_to_affiliate');
Route::get('admin/get-translations/{activeTab}', [LabelTranslationController::class, 'translations'])->name('get_translations');
Route::post('/admin/label-translations.store', [LabelTranslationController::class, 'store'])->name('label_translations.store');
Route::get('/admin/copyTo/{from}/{to}', [LabelTranslationController::class, 'copyTo'])->name('copyTo');
Route::get('/admin/translateTo/{from}/{to}', [LabelTranslationController::class, 'translateTo'])->name('translateTo');

Route::get('/admin/send-otp/{phone}/{otp}', [SendSmsController::class, 'sendSms'])->name('send_sms');
