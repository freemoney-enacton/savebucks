<x-mail::message>
# Hello {{ $data['name'] }},

You recently requested to reset your password for your {{ config('app.name') }} account.

To proceed with the password reset process, please enter the One Time Password (OTP) provided below:

<x-mail::panel>

<span style="font-size: 24px; font-weight: 600;">{{ $data['otp'] }}</span>

</x-mail::panel>

Please enter this code on the password reset page to continue.

This OTP is valid for 10 minutes. If you didn't request this, you can safely ignore this email.

Thanks,
{{ config('app.name') }}
</x-mail::message>
