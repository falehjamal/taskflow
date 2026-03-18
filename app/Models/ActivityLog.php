<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'action', 'target_type', 'target_id', 'task_id', 'metadata'])]
class ActivityLog extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }

    /**
     * Get the user who performed the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the task this log belongs to.
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * Scope to filter by task.
     */
    public function scopeForTask(Builder $query, int $taskId): Builder
    {
        return $query->where('task_id', $taskId);
    }

    /**
     * Log an activity.
     */
    public static function log(
        string $action,
        string $targetType,
        int $targetId,
        array $metadata = [],
        ?int $userId = null,
        ?int $taskId = null
    ): self {
        return self::create([
            'user_id' => $userId ?? auth()->id(),
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'task_id' => $taskId ?? ($targetType === 'task' ? $targetId : null),
            'metadata' => $metadata,
        ]);
    }
}
