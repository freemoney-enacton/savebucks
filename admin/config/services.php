<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    "msg91" => [
        'apikey' => env("MSG91_APIKEY"),
        'otp_template_id' => env("MSG91_OTP_TEMPLATE_ID"),
    ],

    'paypal' => [
        'currency' => env('PAYPAL_CURRENCY', 'USD'),
        'mode' => env('PAYPAL_MODE', 'sandbox'),
        'client_id' => env('PAYPAL_CLIENT_ID'),
        'client_secret' => env('PAYPAL_CLIENT_SECRET'),
        'payout_enabled' => env('PAYPAL_PAYOUT_ENABLED',false),
    ],
    'tango' => [
        'platform_name' => env('TANGO_PLATFORM_NAME'),
        'platform_key' => env('TANGO_PLATFORM_KEY'),
        'customer_id' => env('TANGO_CUSTOMER_ID'),
        'account_id' => env('TANGO_ACCOUNT_ID'),
        'client_id' => env('TANGO_CLIENT_ID'),
        'client_secret' => env('TANGO_CLIENT_SECRET'),
        'username' => env('TANGO_USERNAME'),
        'password' => env('TANGO_PASSWORD')
    ],     
    'onesignal' => [
        'app_id'    => env('ONESIGNAL_APP_ID'),
        'rest_api_key' => env('ONESIGNAL_REST_API_KEY'),
        'user_auth_key' => env('ONESIGNAL_USER_AUTH_KEY'),
        'guzzle_client_timeout' => env('ONESIGNAL_GUZZLE_CLIENT_TIMEOUT', 0),
    ],  

];
