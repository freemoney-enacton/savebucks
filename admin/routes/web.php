<?php

use App\Http\Controllers\CustomAppSettingsController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\LabelTranslationController;
use App\Http\Controllers\ManageTaskImageController;
use App\Http\Controllers\SendMailToUser;
use App\Http\Controllers\SendSmsController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

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
Route::get('admin/get-translations/{activeTab}', [LabelTranslationController::class, 'translations'])->name('get_translations');
Route::post('/admin/label-translations.store', [LabelTranslationController::class, 'store'])->name('label_translations.store');
Route::get('/admin/copyTo/{from}/{to}', [LabelTranslationController::class, 'copyTo'])->name('copyTo');
Route::get('/admin/translateTo/{from}/{to}', [LabelTranslationController::class, 'translateTo'])->name('translateTo');

Route::get('/admin/send-otp/{phone}/{otp}', [SendSmsController::class, 'sendSms'])->name('send_sms');

Route::post('/update/usertask', [ManageTaskImageController::class, 'updateUserTask'])->name('update.user.task');
Route::post('/contact/submit', [GeneralController::class, 'contactSubmit'])->name('contact.submit');

Route::get('/exports/download/{filename}', function (Request $request, $filename) {
    // Check if this is a signed URL
    if (!$request->hasValidSignature()) {
        abort(401, 'This download link has expired.');
    }

    // Validate the filename format to prevent directory traversal
    if (!preg_match('/^daily_earning_report_[\d-_]+\.csv$/', $filename)) {
        abort(404, 'Invalid file requested.');
    }

    // Build the full path
    $path = 'exports/' . $filename;

    // Check if the file exists
    if (!Storage::exists($path)) {
        abort(404, 'File not found.');
    }

    // Return the file as a download response
    return response()->download(
        Storage::path($path),
        $filename,
        [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]
    );
})->name('export.download')->middleware('auth');

Route::get('/daisycon-auth', [GeneralController::class, 'daisyconAuth'])->name('daisycon.auth');
Route::get('/daisycon/token/generate', [GeneralController::class, 'daisyconGenerateToken'])->name('daisycon.token');
