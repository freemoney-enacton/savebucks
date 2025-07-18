<x-mail::message>
# Hey {{ $data['name'] }},

Welcome to {{ config('app.name') }} Affiliate Program!

You're one step away from starting your affiliate journey. Please verify your email address by clicking the button below.

<x-mail::button :url="$data['verification_link']">
    Verify Email Address
</x-mail::button>

Or copy and paste this link into your browser:
{{ $data['verification_link'] }}

This verification link will expire in 24 hours for security purposes.

If you didn't request this verification, please ignore this email.

Thank you,<br>
{{ config('app.name') }} Team
</x-mail::message>