<?php

namespace App\Http\Controllers;

use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Models\ActivityLog;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use App\Notifications\TaskAssignedNotification;
use Illuminate\Http\RedirectResponse;

class TaskController extends Controller
{
    /**
     * Store a newly created task.
     */
    public function store(StoreTaskRequest $request, Workspace $workspace, Project $project): RedirectResponse
    {
        if ($project->workspace_id !== $workspace->id) {
            abort(404);
        }

        $this->authorize('create', [Task::class, $project]);

        $data = collect($request->validated())->except('assignee_ids')->all();
        $task = $project->tasks()->create([
            ...$data,
            'created_by' => $request->user()->id,
        ]);

        if ($request->has('assignee_ids') && ! empty($request->assignee_ids)) {
            $task->assignees()->sync($request->assignee_ids);
            foreach ($request->assignee_ids as $userId) {
                User::find($userId)?->notify(new TaskAssignedNotification($task));
            }
        }

        if ($request->input('redirect') === 'dashboard') {
            $params = $request->only([
                'status', 'status_exclude', 'search', 'project_id',
                'workspace_id', 'assigned_to', 'due_from', 'due_to',
                'sort_by', 'sort_dir',
            ]);

            return redirect()
                ->route('dashboard', array_filter($params))
                ->with('success', 'Task berhasil dibuat.');
        }

        return redirect()
            ->route('workspaces.projects.show', [$workspace, $project])
            ->with('success', 'Task berhasil dibuat.');
    }

    /**
     * Update the specified task.
     */
    public function update(UpdateTaskRequest $request, Workspace $workspace, Project $project, Task $task): RedirectResponse
    {
        if ($project->workspace_id !== $workspace->id || $task->project_id !== $project->id) {
            abort(404);
        }

        $this->authorize('update', $task);

        $data = collect($request->validated())->except('assignee_ids')->all();
        $task->update($data);

        if ($request->has('assignee_ids')) {
            $previousIds = $task->assignees->pluck('id')->all();
            $task->assignees()->sync($request->assignee_ids);
            $newIds = array_diff($request->assignee_ids, $previousIds);
            $removedIds = array_diff($previousIds, $request->assignee_ids);

            foreach ($newIds as $userId) {
                User::find($userId)?->notify(new TaskAssignedNotification($task));
                ActivityLog::log('user_assigned', 'task', $task->id, ['user_id' => $userId], null, $task->id);
            }

            foreach ($removedIds as $userId) {
                ActivityLog::log('user_unassigned', 'task', $task->id, ['user_id' => $userId], null, $task->id);
            }
        }

        return redirect()
            ->route('workspaces.projects.show', [$workspace, $project])
            ->with('success', 'Task berhasil diperbarui.');
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Workspace $workspace, Project $project, Task $task): RedirectResponse
    {
        if ($project->workspace_id !== $workspace->id || $task->project_id !== $project->id) {
            abort(404);
        }

        $this->authorize('delete', $task);

        $task->delete();

        return redirect()
            ->route('workspaces.projects.show', [$workspace, $project])
            ->with('success', 'Task berhasil dihapus.');
    }
}
