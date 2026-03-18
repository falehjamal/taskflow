<?php

namespace App\Services\Wa;

interface WaGatewayInterface
{
    /**
     * Send a WhatsApp message.
     */
    public function sendMessage(string $to, string $message): void;
}
