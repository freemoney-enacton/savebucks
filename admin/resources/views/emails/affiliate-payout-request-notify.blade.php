<x-mail::message>
# Hello Admin,

**Affiliate {{ $data['name'] }}** has submitted a payout request amount {{ $data['amount'] }} using the {{ $data['payment_method']}} method.

<x-mail::panel>
**Affiliate Email:** {{ $data['email'] }}

**Transaction ID:** #{{ $data['transaction_id'] }}

**Requested Amount:** {{ $data['amount'] }}

**Payment Method:** {{ ucfirst($data['payment_method']) }}

**Request Date:** {{ $data['request_date'] }} UTC

</x-mail::panel>

Please review this request.

<x-mail::button url="{{ $data['url'] }}">
Review Payout Request
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
