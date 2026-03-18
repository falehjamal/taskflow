<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Determine whether the user can view any tasks in the project.
     */
    public function viewAny(User $user, Project $project): bool
    {
        return $user->isAdministrator() || $project->workspace->isMember($user);
    }

    /**
     * Determine whether the user can view the task.
     */
    public function view(User $user, Task $task): bool
    {
        return $user->isAdministrator()
            || $task->project->workspace->isMember($user);
    }

    /**
     * Determine whether the user can create tasks in the project.
     */
    public function create(User $user, Project $project): bool
    {
        return $user->isAdministrator() || $project->workspace->isMember($user);
    }

    /**
     * Determine whether the user can update the task.
     */
    public function update(User $user, Task $task): bool
    {
        return $user->isAdministrator()
            || $task->project->workspace->isMember($user);
    }

    /**
     * Determine whether the user can delete the task.
     */
    public function delete(User $user, Task $task): bool
    {
        return $user->isAdministrator()
            || $task->project->workspace->isMember($user);
    }
}
