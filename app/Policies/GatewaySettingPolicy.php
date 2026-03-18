<?php

namespace App\Policies;

use App\Models\GatewaySetting;
use App\Models\User;

class GatewaySettingPolicy
{
    /**
     * Determine whether the user can view any gateway settings.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdministrator();
    }

    /**
     * Determine whether the user can view the gateway setting.
     */
    public function view(User $user, GatewaySetting $gatewaySetting): bool
    {
        return $user->isAdministrator();
    }

    /**
     * Determine whether the user can update the gateway setting.
     */
    public function update(User $user, GatewaySetting $gatewaySetting): bool
    {
        return $user->isAdministrator();
    }
}
