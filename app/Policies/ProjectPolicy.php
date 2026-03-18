<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use App\Models\Workspace;

class ProjectPolicy
{
    /**
     * Determine whether the user can view any models in the workspace.
     */
    public function viewAny(User $user, Workspace $workspace): bool
    {
        return $user->isAdministrator() || $workspace->isMember($user);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Project $project): bool
    {
        return $user->isAdministrator()
            || $user->workspaces()->where('workspace_id', $project->workspace_id)->exists();
    }

    /**
     * Determine whether the user can create models in the workspace.
     */
    public function create(User $user, Workspace $workspace): bool
    {
        return $user->isAdministrator() || $workspace->isMember($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        return $user->isAdministrator()
            || $user->workspaces()->where('workspace_id', $project->workspace_id)->exists();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->isAdministrator()
            || $user->workspaces()->where('workspace_id', $project->workspace_id)->exists();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Project $project): bool
    {
        return $user->isAdministrator()
            || $user->workspaces()->where('workspace_id', $project->workspace_id)->exists();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Project $project): bool
    {
        return $user->isAdministrator()
            || $user->workspaces()->where('workspace_id', $project->workspace_id)->exists();
    }
}
