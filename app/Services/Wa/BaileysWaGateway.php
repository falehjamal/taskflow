<?php

namespace App\Services\Wa;

class BaileysWaGateway implements WaGatewayInterface
{
    /**
     * Baileys connector runs as a separate worker.
     */
    public function sendMessage(string $to, string $message): void
    {
        throw new \RuntimeException(
            'Baileys connector not implemented. Run worker separately.'
        );
    }
}
