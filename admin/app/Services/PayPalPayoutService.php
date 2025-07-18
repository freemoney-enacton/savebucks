<?php

namespace App\Services;

use App\Models\PayPalLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class PayPalPayoutService
{
    private string $baseUrl;
    private string $clientId;
    private string $clientSecret;

    public function __construct()
    {
        $this->baseUrl = config('services.paypal.mode') === 'sandbox'
            ? 'https://api-m.sandbox.paypal.com'
            : 'https://api-m.paypal.com';
        $this->clientId = config('services.paypal.client_id');
        $this->clientSecret = config('services.paypal.client_secret');
    }

    private function generateHash(string $id): string
    {
        return hash('xxh3', $id);
    }

    private function getAccessToken(): string
    {
        if ($token = Cache::get('paypal_access_token')) {
            return $token;
        }

        $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
            ->asForm()
            ->post("{$this->baseUrl}/v1/oauth2/token", [
                'grant_type' => 'client_credentials'
            ]);

        if (!$response->successful()) {
            Log::error('PayPal Auth Error', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);
            throw new \Exception('Failed to get PayPal access token');
        }

        $data = $response->json();
        Cache::put('paypal_access_token', $data['access_token'], now()->addSeconds($data['expires_in'] - 60));

        return $data['access_token'];
    }

    public function createPayout(int $paymentId, string $requestId, string $email, float $amount, string $currency = null, string $note = ''): array
    {
        if(!$currency) $currency = config('services.paypal.currency', 'USD');

        $token = $this->getAccessToken();

        // Generate batch ID using request ID and its hash
        $batchId = sprintf('PAY_%s_%s', $requestId, $this->generateHash($requestId));

        $payload = [
            'sender_batch_header' => [
                'sender_batch_id' => $batchId,
                'email_subject' => 'You have received a payout!',
                'email_message' => 'Your cashback has been processed and sent to your PayPal account.'
            ],
            'items' => [
                [
                    'recipient_type' => 'EMAIL',
                    'amount' => [
                        'value' => number_format($amount, 2, '.', ''),
                        'currency' => $currency
                    ],
                    'note' => $note ?: 'Cashback payout',
                    'sender_item_id' => $requestId, // Using requestId directly for easier tracking
                    'receiver' => $email
                ]
            ]
        ];

        try {
            $response = Http::withToken($token)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post("{$this->baseUrl}/v1/payments/payouts", $payload);

            // Log the API call
            PayPalLog::logPayPalRequest(
                paymentId: $paymentId,
                requestType: 'create_payout',
                requestPayload: $payload,
                responsePayload: $response->json(),
                statusCode: $response->status(),
                success: $response->successful(),
                errorMessage: $response->failed() ? ($response->json()['message'] ?? null) : null,
                paypalBatchId: $response->successful() ? ($response->json()['batch_header']['payout_batch_id'] ?? null) : null
            );

            if (!$response->successful()) {
                throw new \Exception('Failed to create PayPal payout: ' . ($response->json()['message'] ?? 'Unknown error'));
            }

            // Return response with both batch ID and payout batch ID for reference
            return [
                'sender_batch_id' => $batchId,
                'payout_batch_id' => $response->json()['batch_header']['payout_batch_id'],
                'batch_status' => $response->json()['batch_header']['batch_status'],
                'raw_response' => $response->json()
            ];

        } catch (\Exception $e) {
            Log::error('PayPal Payout Error', [
                'status' => $response->status() ?? null,
                'body' => $response->json() ?? null,
                'requestId' => $requestId,
                'email' => $email,
                'amount' => $amount
            ]);
            throw $e;
        }
    }

    public function getPayoutStatus(int $paymentId, string $payoutBatchId): array
    {
        $token = $this->getAccessToken();

        try {
            $response = Http::withToken($token)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->get("{$this->baseUrl}/v1/payments/payouts/{$payoutBatchId}?page=1&page_size=10&total_required=true");

            // Log the API call
            PayPalLog::logPayPalRequest(
                paymentId: $paymentId,
                requestType: 'get_payout_status',
                requestPayload: ['payout_batch_id' => $payoutBatchId],
                responsePayload: $response->json(),
                statusCode: $response->status(),
                success: $response->successful(),
                errorMessage: $response->failed() ? ($response->json()['message'] ?? null) : null,
                paypalBatchId: $payoutBatchId
            );

            if (!$response->successful()) {
                throw new \Exception('Failed to get payout status: ' . ($response->json()['message'] ?? 'Unknown error'));
            }

            // Get the first item since we're only dealing with single payouts
            $firstItem = $response->json()['items'][0] ?? null;

            return [
                'batch_status' => $response->json()['batch_header']['batch_status'],
                'time_created' => $response->json()['batch_header']['time_created'] ?? null,
                'time_completed' => $response->json()['batch_header']['time_completed'] ?? null,
                'transaction_status' => $firstItem['transaction_status'] ?? null,
                'transaction_id' => $firstItem['transaction_id'] ?? null,
                'time_processed' => $firstItem['time_processed'] ?? null,
                'raw_response' => $response->json()
            ];

        } catch (\Exception $e) {
            Log::error('PayPal Payout Status Error', [
                'paymentId' => $paymentId,
                'payoutBatchId' => $payoutBatchId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
