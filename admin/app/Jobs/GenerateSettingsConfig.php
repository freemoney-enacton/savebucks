<?php

namespace App\Jobs;

use App\Models\Country;
use App\Models\Currency;
use App\Models\Language;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use QCod\Settings\Setting\Setting;

class GenerateSettingsConfig implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $settings  = Setting::where('group', '<>', 'bkp')->get()->groupBy('group')->map(function ($sets) {
            return $sets->mapWithKeys(function ($set) {
                return [$set->name => json_decode($set->val, true) ?? $set->val];
            })->toArray();
        })->toArray();

        // Add Lang related info
        $languages = Language::where('is_enabled', 1)
            ->get()
            ->mapWithKeys(function ($lang) {
                return [strtolower($lang->code) => $lang->name];
            })
            ->sortByDesc(function ($lang, $key) use($settings) {
                return intval($key == $settings['default']['default_lang']);
            })
            ->toArray();

        $settings['languages']['all'] = $languages;
        $settings['languages']['keys']  = array_values(array_keys($languages));
        $settings['languages']['default'] = $settings['default']['default_lang'] ?? 'en';

        // Add Countries to settings
        $countries = Country::where('is_enabled', 1)
            ->get()
            ->mapWithKeys(function ($country) {
                return [strtoupper($country->code) => $country];
            })
            ->sortByDesc(function ($country, $key) use($settings) {
                return intval($key == $settings['default']['default_country']);
            })
            ->toArray();

        $settings['countries']['all'] = $countries;
        $settings['countries']['keys'] = array_values(array_keys($countries));
        $settings['countries']['default'] = $settings['default']['default_country'] ?? 'US';

        // Add Currencies to settings
        $currencies = Currency::where('enabled', 1)
            ->get()
            ->mapWithKeys(function ($currency) {
                return [strtoupper($currency->iso_code) => $currency];
            })
            ->sortBy(function ($currency, $key) use($settings) {
                return intval($key == $settings['default']['default_currency']);
            })
            ->toArray();

        $settings['currencies']['all'] = $currencies;
        $settings['currencies']['keys'] = array_values(array_keys($currencies));
        $settings['currencies']['default'] = $settings['default']['default_currency'] ?? 'USD';

        // dd($settings);


        Storage::disk('base')->put('/config/freemoney.php', '<?php

        return ' . var_export($settings, true) . ' ; ?>');

        Artisan::call('config:clear');
        
        // TODO : Test and uncomment
        // Artisan::call('config:cache');

        // Updating all env files for web/api/admin here
        // $this->updateEnvFiles($settings);
    }

    // private function updateEnvFiles($settings)
    // {
    //     $updater = new \CodeZero\DotEnvUpdater\DotEnvUpdater(base_path() . '/.env');

    //     // APP Settings

    //     $updater->set('APP_NAME', ucwords($settings['default']['name']));
    //     $updater->set('APP_LOCALE', $settings['default']['default_lang']);
    //     $updater->set('APP_COUNTRY', $settings['default']['default_country']);
    //     $updater->set('APP_TIMEZONE', $settings['default']['timezone']);
    //     $updater->set('APP_FALLBACK_LOCALE', $settings['default']['fallback_lang']  ??  $settings['default']['default_lang']);
    //     $updater->set('ADMIN_EMAIL', $settings['default']['admin_email'] ?? null);
    //     $updater->set('AFFPORT_DOWNLOAD', (bool) ($settings['default']['affport_download'] ?? false));
    //     $updater->set('AUDITING_ENABLED', (bool) ($settings['default']['auditing_enabled'] ?? false));


    //     // google recaptcha
    //     // $updater->set('NOCAPTCHA_SITEKEY', $settings['default']['recaptcha_key']);
    //     // $updater->set('NOCAPTCHA_SECRET', $settings['default']['recaptcha_secret']);


    //     // google recaptcha
    //     // $updater->set('GRECAPTCHA_SITE_KEY', $settings['default']['recaptcha_key']);
    //     // $updater->set('GRECAPTCHA_SECRET_KEY', $settings['default']['recaptcha_secret']);

    //     // google auth
    //     $updater->set('GOOGLE_CLIENT_ID', $settings['default']['google_client_id']);
    //     $updater->set('GOOGLE_CLIENT_SECRET', $settings['default']['google_client_secret']);

    //     // facebook auth
    //     $updater->set('FACEBOOK_CLIENT_ID', $settings['default']['facebook_client_id']);
    //     $updater->set('FACEBOOK_CLIENT_SECRET', $settings['default']['facebook_client_secret']);

    //     // mail
    //     $updater->set('MAIL_MAILER', $settings['default']['mailer']);
    //     $updater->set('MAIL_HOST', $settings['default']['host']);
    //     $updater->set('MAIL_PORT', $settings['default']['port']);
    //     $updater->set('MAIL_USERNAME', $settings['default']['username']);
    //     $updater->set('MAIL_PASSWORD', $settings['default']['password']);
    //     $updater->set('MAIL_ENCRYPTION', $settings['default']['encryption']);
    //     $updater->set('MAIL_FROM_ADDRESS', $settings['default']['from_address']);

    //     if (is_array($settings['default']['from_name']))
    //         $updater->set('MAIL_FROM_NAME', $settings['default']['from_name'][$settings['default']['default_lang']]);
    //     else
    //         $updater->set('MAIL_FROM_NAME', $settings['default']['from_name']);

    //     $updater->set('MAIL_REPLY_TO_ADDRESS', $settings['default']['support_email']);

    //     $updater->set('ONESIGNAL_APP_ID', $settings['default']['onesignal_app_id']);
    //     $updater->set('ONESIGNAL_REST_API_KEY', $settings['default']['onesignal_rest_api']);
    //     $updater->set('ONESIGNAL_USER_AUTH_KEY', $settings['default']['onesignal_user_auth_key']);

    //     $updater->set('APPLE_CLIENT_ID', $settings['default']['apple_client_id']);
    //     $updater->set('APPLE_CLIENT_SECRET', $settings['default']['apple_client_secret']);
    // }
}
