<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@taskflow.test');
        $password = env('ADMIN_PASSWORD', 'password');

        if (app()->isProduction() && empty(env('ADMIN_PASSWORD'))) {
            $this->command->warn('ADMIN_PASSWORD not set in production. Skipping admin user creation.');

            return;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Administrator',
                'password' => $password,
                'role' => 'administrator',
            ]
        );
    }
}
