<x-mail::message>
# Hello {{ $data['name'] }},

@if (isset($data['password']))

Welcome to {{ config('app.name') }}! Our team have created an account for you.

You can login with your email and password.

Your new passowrd is

<x-mail::panel>

<span style="font-size: 24px; font-weight: 600;">{{ $data['password'] }}</span>

</x-mail::panel>

@else

Welcome to {{ config('app.name') }}! We are thrilled to have you join our community. Thank you for choosing us for your needs.

@endif


At {{ config('app.name') }}, we strive to provide you with the best experience possible.

Whether it's exploring our products, accessing our services, or connecting with our community, we are here to support you every step of the way.

Thanks, <br />
{{ config('app.name') }}
</x-mail::message>
