<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with tasks from all accessible workspaces.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $tasksQuery = Task::query()
            ->with(['project.workspace', 'assignees', 'creator', 'comments.user', 'activityLogs.user'])
            ->whereHas('project.workspace', function ($q) use ($user) {
                $q->whereHas('users', fn ($u) => $u->where('user_id', $user->id));
            })
            ->filter([
                'status' => $request->query('status'),
                'status_exclude' => $request->query('status_exclude'),
                'assigned_to' => $request->query('assigned_to'),
                'due_from' => $request->query('due_from'),
                'due_to' => $request->query('due_to'),
                'project_id' => $request->query('project_id'),
                'workspace_id' => $request->query('workspace_id'),
            ])
            ->search($request->query('search'));

        if ($request->query('sort_by') === 'due_date') {
            $direction = $request->query('sort_dir', 'asc') === 'desc' ? 'desc' : 'asc';
            $tasksQuery->orderByDueDate($direction);
        } else {
            $tasksQuery->orderedByPosition();
        }

        $tasks = $tasksQuery->get();

        $workspaces = $user->workspaces()
            ->with('projects')
            ->orderBy('name')
            ->get();

        $projects = $user->workspaces()
            ->with('projects.workspace')
            ->get()
            ->flatMap(fn ($w) => $w->projects)
            ->unique('id')
            ->sortBy('name')
            ->values();

        $members = $user->workspaces()
            ->with('users')
            ->get()
            ->flatMap(fn ($w) => $w->users)
            ->unique('id')
            ->sortBy('name')
            ->values();

        $canManage = true;

        return Inertia::render('dashboard', [
            'tasks' => $tasks,
            'workspaces' => $workspaces,
            'projects' => $projects,
            'members' => $members,
            'canManage' => $canManage,
            'sortBy' => $request->query('sort_by'),
            'sortDir' => $request->query('sort_dir', 'asc'),
            'filters' => [
                'status' => $request->query('status'),
                'status_exclude' => $request->query('status_exclude'),
                'assigned_to' => $request->query('assigned_to'),
                'due_from' => $request->query('due_from'),
                'due_to' => $request->query('due_to'),
                'search' => $request->query('search'),
                'project_id' => $request->query('project_id'),
                'workspace_id' => $request->query('workspace_id'),
            ],
        ]);
    }
}
