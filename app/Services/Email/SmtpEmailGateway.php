<?php

namespace App\Services\Email;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;

class SmtpEmailGateway implements EmailGatewayInterface
{
    public function __construct(
        protected string $host,
        protected int $port,
        protected ?string $username,
        protected ?string $password,
        protected string $encryption = 'tls',
    ) {}

    /**
     * Send an email via SMTP.
     */
    public function send(string $to, string $subject, string $body): void
    {
        $originalMailer = Config::get('mail.default');
        $originalSmtp = Config::get('mail.mailers.smtp');

        try {
            Config::set('mail.default', 'smtp');
            Config::set('mail.mailers.smtp', array_merge($originalSmtp ?? [], [
                'transport' => 'smtp',
                'host' => $this->host,
                'port' => $this->port,
                'encryption' => $this->encryption ?: null,
                'username' => $this->username,
                'password' => $this->password,
            ]));

            Mail::raw($body, fn ($message) => $message->to($to)->subject($subject));
        } finally {
            Config::set('mail.default', $originalMailer);
            if ($originalSmtp !== null) {
                Config::set('mail.mailers.smtp', $originalSmtp);
            }
        }
    }
}
