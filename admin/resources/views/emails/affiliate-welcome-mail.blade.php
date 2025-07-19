<x-mail::message>
# Welcome to {{ config('app.name') }} Affiliate Program, {{ $data['name'] }}!

@if (isset($data['password']))
Our team has created an affiliate account for you.

You can login with your email and password.

Your new password is:

<x-mail::panel>
<span style="font-size: 24px; font-weight: 600;">{{ $data['password'] }}</span>
</x-mail::panel>

@else
Congratulations on joining our affiliate program! We're excited to have you on board.
@endif

## What's Next?

- Start promoting our Platform.
- Earn commissions on every successful referral.

## Need Help?

Our affiliate support team is here to help you succeed. If you have any questions or need assistance, don't hesitate to reach out to savebucks@givmail.com.

Let's start earning together!

Thank you,<br>
{{ config('app.name') }} Affiliate Team
</x-mail::message>
