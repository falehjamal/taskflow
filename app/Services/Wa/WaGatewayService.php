<?php

namespace App\Services\Wa;

use App\Models\GatewaySetting;

class WaGatewayService
{
    /**
     * Create a WA gateway instance from gateway setting.
     */
    public static function fromConfig(GatewaySetting $setting): WaGatewayInterface
    {
        $config = $setting->config ?? [];

        return match ($setting->type) {
            'api' => new ApiWaGateway(
                baseUrl: $config['base_url'] ?? '',
                apiKey: $config['api_key'] ?? '',
            ),
            'baileys' => new BaileysWaGateway,
            default => throw new \InvalidArgumentException("Unsupported WA gateway type: {$setting->type}"),
        };
    }
}
