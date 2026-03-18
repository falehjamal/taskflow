<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

#[Fillable(['name', 'type', 'config', 'active'])]
class GatewaySetting extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'config' => 'encrypted:array',
            'active' => 'boolean',
        ];
    }

    /**
     * Scope to filter by active gateways.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    /**
     * Scope to filter by name.
     */
    public function scopeByName(Builder $query, string $name): Builder
    {
        return $query->where('name', $name);
    }

    /**
     * Get gateway by name.
     */
    public static function getByName(string $name): ?self
    {
        return self::byName($name)->first();
    }
}
