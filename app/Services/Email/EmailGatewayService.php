<?php

namespace App\Services\Email;

use App\Models\GatewaySetting;

class EmailGatewayService
{
    /**
     * Create an email gateway instance from gateway setting.
     */
    public static function fromConfig(GatewaySetting $setting): EmailGatewayInterface
    {
        $config = $setting->config ?? [];

        return match ($setting->type) {
            'smtp' => new SmtpEmailGateway(
                host: $config['host'] ?? 'localhost',
                port: (int) ($config['port'] ?? 587),
                username: $config['username'] ?? null,
                password: $config['password'] ?? null,
                encryption: $config['encryption'] ?? 'tls',
            ),
            'api' => new ApiEmailGateway(
                provider: $config['provider'] ?? 'sendgrid',
                apiKey: $config['api_key'] ?? '',
            ),
            default => throw new \InvalidArgumentException("Unsupported email gateway type: {$setting->type}"),
        };
    }
}
