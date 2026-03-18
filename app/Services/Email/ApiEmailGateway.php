<?php

namespace App\Services\Email;

use Illuminate\Support\Facades\Http;

class ApiEmailGateway implements EmailGatewayInterface
{
    public function __construct(
        protected string $provider,
        protected string $apiKey,
    ) {}

    /**
     * Send an email via API (SendGrid, Postmark, etc).
     */
    public function send(string $to, string $subject, string $body): void
    {
        match (strtolower($this->provider)) {
            'sendgrid' => $this->sendViaSendGrid($to, $subject, $body),
            'postmark' => $this->sendViaPostmark($to, $subject, $body),
            default => throw new \InvalidArgumentException("Unsupported email provider: {$this->provider}"),
        };
    }

    protected function sendViaSendGrid(string $to, string $subject, string $body): void
    {
        Http::withToken($this->apiKey)
            ->post('https://api.sendgrid.com/v3/mail/send', [
                'personalizations' => [['to' => [['email' => $to]]]],
                'from' => ['email' => config('mail.from.address'), 'name' => config('mail.from.name')],
                'subject' => $subject,
                'content' => [['type' => 'text/plain', 'value' => $body]],
            ])
            ->throw();
    }

    protected function sendViaPostmark(string $to, string $subject, string $body): void
    {
        Http::withToken($this->apiKey)
            ->post('https://api.postmarkapp.com/email', [
                'To' => $to,
                'From' => config('mail.from.address'),
                'Subject' => $subject,
                'TextBody' => $body,
            ])
            ->throw();
    }
}
