<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\TestEmailRequest;
use App\Http\Requests\Settings\TestWaRequest;
use App\Http\Requests\Settings\UpdateGatewayRequest;
use App\Models\ActivityLog;
use App\Models\GatewaySetting;
use App\Services\Email\EmailGatewayService;
use App\Services\Wa\WaGatewayService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GatewaySettingsController extends Controller
{
    /**
     * Display gateway settings index.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', GatewaySetting::class);

        return Inertia::render('settings/gateways/index');
    }

    /**
     * Show the form for editing the specified gateway.
     */
    public function edit(Request $request, string $name): Response
    {
        $gateway = GatewaySetting::getByName($name);
        if (! $gateway) {
            abort(404);
        }

        $this->authorize('update', $gateway);

        return Inertia::render("settings/gateways/{$name}", [
            'gateway' => $gateway,
        ]);
    }

    /**
     * Update the specified gateway.
     */
    public function update(UpdateGatewayRequest $request, string $name): RedirectResponse
    {
        $gateway = GatewaySetting::getByName($name);
        if (! $gateway) {
            abort(404);
        }

        $this->authorize('update', $gateway);

        $gateway->update([
            'type' => $request->validated('type'),
            'config' => $request->validated('config'),
            'active' => $request->boolean('active'),
        ]);

        ActivityLog::log(
            'gateway_updated',
            'gateway_setting',
            $gateway->id,
            ['user_id' => $request->user()->id],
            $request->user()->id,
            null
        );

        return redirect()
            ->route('gateways.edit', $name)
            ->with('success', 'Gateway berhasil diperbarui.');
    }

    /**
     * Send a test email.
     */
    public function testEmail(TestEmailRequest $request): RedirectResponse
    {
        $gateway = GatewaySetting::getByName('email');
        if (! $gateway || ! $gateway->active) {
            return redirect()
                ->back()
                ->with('error', 'Email gateway belum dikonfigurasi atau tidak aktif.');
        }

        try {
            $service = EmailGatewayService::fromConfig($gateway);
            $service->send(
                $request->validated('to'),
                'Test Email - Taskflow',
                'Ini adalah email percobaan dari Taskflow.'
            );

            return redirect()
                ->back()
                ->with('success', 'Email percobaan berhasil dikirim.');
        } catch (\Throwable $e) {
            return redirect()
                ->back()
                ->with('error', 'Gagal mengirim email: '.$e->getMessage());
        }
    }

    /**
     * Send a test WhatsApp message.
     */
    public function testWa(TestWaRequest $request): RedirectResponse
    {
        $gateway = GatewaySetting::getByName('wa');
        if (! $gateway || ! $gateway->active) {
            return redirect()
                ->back()
                ->with('error', 'WA gateway belum dikonfigurasi atau tidak aktif.');
        }

        try {
            $service = WaGatewayService::fromConfig($gateway);
            $service->sendMessage(
                $request->validated('to'),
                'Ini adalah pesan percobaan dari Taskflow.'
            );

            return redirect()
                ->back()
                ->with('success', 'Pesan WA percobaan berhasil dikirim.');
        } catch (\Throwable $e) {
            return redirect()
                ->back()
                ->with('error', 'Gagal mengirim WA: '.$e->getMessage());
        }
    }
}
