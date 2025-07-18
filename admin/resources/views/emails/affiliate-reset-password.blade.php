<x-mail::message>
# Hey {{ $data['name'] }},

Let's get you back on track! Click the button below to reset your {{ config('app.name') }} affiliate account password and continue managing your commissions.

We received a request to reset your password. If this was you, click the button below to proceed.

<x-mail::button :url="$data['reset_link']" color="primary">
Reset Password
</x-mail::button>

<x-mail::panel>
**Security Notice:** This reset link is valid for 24 hours and can only be used once.
</x-mail::panel>

If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.

If you're having trouble with the button above, copy and paste the following link into your browser:
{{ $data['reset_link'] }}

Thanks,<br />
{{ config('app.name') }} Affiliate Team
</x-mail::message>