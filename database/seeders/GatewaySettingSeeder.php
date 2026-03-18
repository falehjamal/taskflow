<?php

namespace Database\Seeders;

use App\Models\GatewaySetting;
use Illuminate\Database\Seeder;

class GatewaySettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        GatewaySetting::updateOrCreate(
            ['name' => 'email'],
            [
                'type' => 'smtp',
                'config' => [
                    'host' => config('mail.mailers.smtp.host', 'localhost'),
                    'port' => config('mail.mailers.smtp.port', 587),
                    'username' => config('mail.mailers.smtp.username'),
                    'password' => config('mail.mailers.smtp.password'),
                    'encryption' => config('mail.mailers.smtp.encryption', 'tls'),
                ],
                'active' => false,
            ]
        );

        GatewaySetting::updateOrCreate(
            ['name' => 'wa'],
            [
                'type' => 'api',
                'config' => [
                    'base_url' => '',
                    'api_key' => '',
                ],
                'active' => false,
            ]
        );
    }
}
