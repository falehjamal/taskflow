<?php

namespace App\Services\Wa;

use Illuminate\Support\Facades\Http;

class ApiWaGateway implements WaGatewayInterface
{
    public function __construct(
        protected string $baseUrl,
        protected string $apiKey,
    ) {}

    /**
     * Send a WhatsApp message via HTTP API.
     */
    public function sendMessage(string $to, string $message): void
    {
        $url = rtrim($this->baseUrl, '/').'/send';
        $phone = preg_replace('/[^0-9]/', '', $to);
        if (! str_starts_with($phone, '62')) {
            $phone = '62'.$phone;
        }

        Http::withToken($this->apiKey)
            ->post($url, [
                'to' => $phone,
                'message' => $message,
            ])
            ->throw();
    }
}
