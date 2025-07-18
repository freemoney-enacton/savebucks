<x-mail::message>
# Hello {{ $data['user_name'] }},

This is to inform that your payout of <strong>{{ $data['amount'] }}</strong> has been <strong>{{ $data['status'] }}</strong>.
your payment details are as follows:

<x-mail::panel>

<strong>Payment ID:</strong> {{ $data['payment_id'] }}

<strong>Method used:</strong> {{ $data['payment_method'] }}

<strong>Payable amount:</strong> {{ $data['amount'] }}

<strong>Paid at:</strong> {{ $data['paid_at'] }}

</x-mail::panel>

{{ $data['message'] }}

Thanks,
{{ config('app.name') }}
</x-mail::message>
