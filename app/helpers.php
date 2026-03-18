<?php

use Illuminate\Support\Facades\Gate;

if (! function_exists('is_administrator')) {
    /**
     * Check if the current user is an administrator.
     */
    function is_administrator(): bool
    {
        return Gate::allows('isAdministrator');
    }
}
