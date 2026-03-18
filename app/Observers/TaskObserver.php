<?php

namespace App\Observers;

use App\Models\ActivityLog;
use App\Models\Task;

class TaskObserver
{
    /**
     * Handle the Task "created" event.
     */
    public function created(Task $task): void
    {
        ActivityLog::log(
            'task_created',
            'task',
            $task->id,
            [],
            $task->created_by,
            $task->id
        );
    }

    /**
     * Handle the Task "updated" event.
     */
    public function updated(Task $task): void
    {
        $changes = $task->getChanges();

        if (isset($changes['status'])) {
            ActivityLog::log(
                'status_changed',
                'task',
                $task->id,
                [
                    'old_status' => $task->getOriginal('status'),
                    'new_status' => $task->status,
                ],
                null,
                $task->id
            );
        }

        $contentFields = ['title', 'description', 'priority', 'due_date'];
        $hasContentChange = ! empty(array_intersect(array_keys($changes), $contentFields));

        if ($hasContentChange) {
            $metadata = [];
            foreach ($contentFields as $field) {
                if (array_key_exists($field, $changes)) {
                    $metadata[$field] = [
                        'old' => $task->getOriginal($field),
                        'new' => $task->getAttribute($field),
                    ];
                }
            }

            ActivityLog::log(
                'task_updated',
                'task',
                $task->id,
                $metadata,
                null,
                $task->id
            );
        }
    }
}
