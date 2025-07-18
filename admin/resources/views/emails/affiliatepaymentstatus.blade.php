<x-mail::message>
# Hey {{ $data['affiliate_name'] }},

This is to inform you that your payout of {{ $data['amount'] }} has been {{ $data['status'] }}.

Your payment details are as follows:

<x-mail::panel>

**Requested Amount:** {{ $data['amount'] }}

**Status:** {{ ucfirst($data['status']) }}

@if($data['status'] === 'paid')
**Paid at:** {{ $data['paid_at'] }}
@endif

</x-mail::panel>

Thanks,<br>
{{ config('app.name') }} Team
</x-mail::message>