<?php

namespace App\Services\Email;

interface EmailGatewayInterface
{
    /**
     * Send an email.
     */
    public function send(string $to, string $subject, string $body): void;
}
