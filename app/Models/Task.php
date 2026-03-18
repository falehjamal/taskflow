<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['title', 'description', 'status', 'priority', 'due_date', 'created_by', 'position'])]
class Task extends Model
{
    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['is_overdue', 'is_near_due'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'due_date' => 'date',
        ];
    }

    /**
     * Get whether the task is overdue.
     */
    public function getIsOverdueAttribute(): bool
    {
        return $this->due_date
            && $this->due_date->isPast()
            && $this->status !== 'done';
    }

    /**
     * Get whether the task is near due (within 48 hours).
     */
    public function getIsNearDueAttribute(): bool
    {
        if (! $this->due_date || $this->status === 'done') {
            return false;
        }

        if ($this->due_date->isPast()) {
            return false;
        }

        return $this->due_date->diffInHours(now(), false) < 48;
    }

    /**
     * Get the project that owns the task.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the users assigned to the task.
     */
    public function assignees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_user')
            ->withTimestamps();
    }

    /**
     * Get the comments for the task.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the user who created the task.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to apply filters.
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        if (! empty($filters['status'])) {
            $statuses = is_array($filters['status'])
                ? $filters['status']
                : [$filters['status']];
            $query->whereIn('status', $statuses);
        }

        if (! empty($filters['assigned_to'])) {
            $query->whereHas('assignees', function (Builder $q) use ($filters) {
                $q->where('users.id', $filters['assigned_to']);
            });
        }

        if (! empty($filters['due_from'])) {
            $query->whereDate('due_date', '>=', $filters['due_from']);
        }

        if (! empty($filters['due_to'])) {
            $query->whereDate('due_date', '<=', $filters['due_to']);
        }

        if (! empty($filters['project_id'])) {
            $query->where('project_id', $filters['project_id']);
        }

        return $query;
    }

    /**
     * Scope a query to search by title and description.
     */
    public function scopeSearch(Builder $query, ?string $q): Builder
    {
        if (empty($q)) {
            return $query;
        }

        $term = '%'.addcslashes($q, '%_\\').'%';

        return $query->where(function (Builder $q) use ($term) {
            $q->where('title', 'like', $term)
                ->orWhere('description', 'like', $term);
        });
    }

    /**
     * Scope a query to order by position.
     */
    public function scopeOrderedByPosition(Builder $query): Builder
    {
        return $query->orderBy('position');
    }

    /**
     * Scope a query to order by due date (nulls last).
     */
    public function scopeOrderByDueDate(Builder $query, string $direction = 'asc'): Builder
    {
        return $query->orderByRaw("due_date IS NULL, due_date {$direction}");
    }

    /**
     * Check if the task is overdue.
     */
    public function isOverdue(): bool
    {
        return $this->getIsOverdueAttribute();
    }

    /**
     * Check if the task is near due (within 48 hours).
     */
    public function isNearDue(): bool
    {
        return $this->getIsNearDueAttribute();
    }
}
