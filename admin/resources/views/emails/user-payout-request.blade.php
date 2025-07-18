<x-mail::message>
# Hello Admin,

{{ $data['use_payment']->user->email }} has requested a payout amount of {{ $data['amount'] }} using the {{ $data['use_payment']->paymentMethod->name }}.

<x-mail::panel>

<strong>Account:</strong> {{ $data['use_payment']->amount }}

<strong>Payment mode:</strong> {{ $data['use_payment']->paymentMethod->name }}

<strong>Amount:</strong> {{ $data['amount'] }}

<strong>Cashback amount:</strong> {{ $data['cashback_amount'] }}

<strong>Bonus amount:</strong> {{ $data['bonus_amount'] }}

<?php
    if (!empty($data['use_payment']->payment_input)) {
        foreach ($data['use_payment']->payment_input as $input => $value) {
            if ($value) { ?>

<strong>{{ ucwords($input) }}:</strong> {{ $value }}
            <?php
            }
        }
    }
?>

</x-mail::panel>

Please click the button below to manage the request.

<x-mail::button url="{{ $data['url'] }}">
    Manage Request
</x-mail::button>

Thanks,
{{ config('app.name') }}
</x-mail::message>
