<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Mail\Mailables\Address;


class AffiliatePayoutRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    /**
     * Create a new message instance.
     */
    public function __construct($data)
    {
        $this->data = $data;
        Log::info('Affiliate Payout Request Received! ====>', ['data'=>$this->data]);

    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $adminEmails      = config('freemoney.default.affiliate_admin_emails', 'hello@swittch.app');
        $affiliateAdminEmailsArray = explode(',', $adminEmails);

        Log::info('Affiliate Payout Request sending for admins! ====>', ['adminEmailsArray'=>$affiliateAdminEmailsArray]);


        return new Envelope(
            subject: config('app.name') . ' - Payout Request Received',
            bcc : array_map(fn($email)=> new Address($email, 'Admin'), $affiliateAdminEmailsArray),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.affiliate-payout-request',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
