<?php

namespace App\Http\Controllers;

use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Models\Project;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects in the workspace.
     */
    public function index(Request $request, Workspace $workspace): Response
    {
        $this->authorize('viewAny', [Project::class, $workspace]);

        $projects = $workspace->projects()->latest()->get();

        return Inertia::render('workspaces/projects/index', [
            'workspace' => $workspace,
            'projects' => $projects,
        ]);
    }

    /**
     * Display the specified project with its tasks.
     */
    public function show(Request $request, Workspace $workspace, Project $project): Response
    {
        if ($project->workspace_id !== $workspace->id) {
            abort(404);
        }

        $this->authorize('view', $project);

        $tasksQuery = $project->tasks()
            ->with(['assignees', 'creator', 'comments.user'])
            ->filter([
                'status' => $request->query('status'),
                'assigned_to' => $request->query('assigned_to'),
                'due_from' => $request->query('due_from'),
                'due_to' => $request->query('due_to'),
            ])
            ->search($request->query('search'));

        if ($request->query('sort_by') === 'due_date') {
            $direction = $request->query('sort_dir', 'asc') === 'desc' ? 'desc' : 'asc';
            $tasksQuery->orderByDueDate($direction);
        } else {
            $tasksQuery->orderedByPosition();
        }

        $project->load('workspace');
        $project->setRelation('tasks', $tasksQuery->get());
        $workspace->load('users');

        $canManage = $request->user()->isAdministrator()
            || $workspace->isMember($request->user());

        return Inertia::render('projects/show', [
            'workspace' => $workspace,
            'project' => $project,
            'tasks' => $project->tasks,
            'members' => $workspace->users,
            'canManage' => $canManage,
            'sortBy' => $request->query('sort_by'),
            'sortDir' => $request->query('sort_dir', 'asc'),
            'filters' => [
                'status' => $request->query('status'),
                'assigned_to' => $request->query('assigned_to'),
                'due_from' => $request->query('due_from'),
                'due_to' => $request->query('due_to'),
                'search' => $request->query('search'),
            ],
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(StoreProjectRequest $request, Workspace $workspace): RedirectResponse
    {
        $this->authorize('create', [Project::class, $workspace]);

        $workspace->projects()->create($request->validated());

        return redirect()->route('workspaces.show', $workspace);
    }

    /**
     * Update the specified project.
     */
    public function update(UpdateProjectRequest $request, Workspace $workspace, Project $project): RedirectResponse
    {
        if ($project->workspace_id !== $workspace->id) {
            abort(404);
        }

        $this->authorize('update', $project);

        $project->update($request->validated());

        return redirect()->route('workspaces.show', $workspace);
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Workspace $workspace, Project $project): RedirectResponse
    {
        if ($project->workspace_id !== $workspace->id) {
            abort(404);
        }

        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->route('workspaces.show', $workspace);
    }
}
