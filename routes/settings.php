<?php

use App\Http\Controllers\Settings\GatewaySettingsController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    $securityEdit = Route::get('settings/security', [SecurityController::class, 'edit'])->name('security.edit');
    if (Features::canManageTwoFactorAuthentication()
        && Features::optionEnabled(Features::twoFactorAuthentication(), 'confirmPassword')) {
        $securityEdit->middleware('password.confirm');
    }

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');

    Route::middleware('can:viewAny,App\Models\GatewaySetting')->prefix('settings')->group(function () {
        Route::get('gateways', [GatewaySettingsController::class, 'index'])->name('gateways.index');
        Route::get('gateways/{name}', [GatewaySettingsController::class, 'edit'])->name('gateways.edit');
        Route::patch('gateways/{name}', [GatewaySettingsController::class, 'update'])->name('gateways.update');
        Route::post('gateways/email/test', [GatewaySettingsController::class, 'testEmail'])
            ->middleware('throttle:3,1')
            ->name('gateways.email.test');
        Route::post('gateways/wa/test', [GatewaySettingsController::class, 'testWa'])
            ->middleware('throttle:3,1')
            ->name('gateways.wa.test');
    });
});
