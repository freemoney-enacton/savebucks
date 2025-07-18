<x-mail::message>
## Hey {{ $data['name'] }},

Great news! Your {{ config('app.name') }} payout request on **{{ $data['request_date'] }} UTC** has been received and is now being processed.

<x-mail::panel>
@if(isset($data['amount']))
**Requested Amount:** {{ $data['amount'] }}
@endif

@if(isset($data['payment_method']))
**Payment Method:** {{ ucfirst($data['payment_method']) }}
@endif

**Request Date:** {{ $data['request_date'] }} UTC
</x-mail::panel>

## What happens next?

- Your request will be reviewed within **72 hours**

We appreciate your partnership and will process this as quickly as possible!
affiliate-payout-request
Best Regards,<br>
The {{ config('app.name') }} Team

</x-mail::message>
