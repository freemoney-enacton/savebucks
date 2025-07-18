<x-mail::message>
# Hello {{ $data['name'] }},

Thank you for signing up for our service.

To complete the registration process and verify your email address, please enter the One Time Password (OTP) provided below:

<x-mail::panel>

<span style="font-size: 24px; font-weight: 600;">{{ $data['otp'] }}</span>

</x-mail::panel>

Please enter this code in the provided field on the verification page. If you did not request this verification, please disregard this email.

Thank you,
{{ config('app.name') }}
</x-mail::message>
