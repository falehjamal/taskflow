<?php

namespace App\Http\Controllers;

use App\Http\Requests\Workspace\InviteMemberRequest;
use App\Http\Requests\Workspace\StoreWorkspaceRequest;
use App\Http\Requests\Workspace\UpdateWorkspaceRequest;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceController extends Controller
{
    /**
     * Display a listing of the user's workspaces.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Workspace::class);

        $workspaces = $request->user()
            ->workspaces()
            ->withCount('users', 'projects')
            ->latest()
            ->get();

        return Inertia::render('workspaces/index', [
            'workspaces' => $workspaces,
        ]);
    }

    /**
     * Store a newly created workspace.
     */
    public function store(StoreWorkspaceRequest $request): RedirectResponse
    {
        $this->authorize('create', Workspace::class);

        $workspace = Workspace::create($request->validated());

        $workspace->users()->attach($request->user()->id, ['role' => 'owner']);

        return redirect()->route('workspaces.show', $workspace);
    }

    /**
     * Display the specified workspace.
     */
    public function show(Request $request, Workspace $workspace): Response
    {
        $this->authorize('view', $workspace);

        $workspace->load(['users', 'projects', 'invitations'])
            ->loadCount('users', 'projects');

        $canManage = $request->user()->isAdministrator()
            || $workspace->isOwner($request->user());

        return Inertia::render('workspaces/show', [
            'workspace' => $workspace,
            'canManage' => $canManage,
        ]);
    }

    /**
     * Update the specified workspace.
     */
    public function update(UpdateWorkspaceRequest $request, Workspace $workspace): RedirectResponse
    {
        $this->authorize('update', $workspace);

        $workspace->update($request->validated());

        return redirect()->route('workspaces.show', $workspace);
    }

    /**
     * Remove the specified workspace.
     */
    public function destroy(Workspace $workspace): RedirectResponse
    {
        $this->authorize('delete', $workspace);

        $workspace->delete();

        return redirect()->route('workspaces.index');
    }

    /**
     * Invite a member to the workspace.
     */
    public function invite(InviteMemberRequest $request, Workspace $workspace): RedirectResponse
    {
        $this->authorize('update', $workspace);

        $invitation = $workspace->invitations()->create([
            'email' => $request->validated('email'),
            'role' => $request->validated('role'),
            'token' => WorkspaceInvitation::generateToken(),
        ]);

        return redirect()->route('workspaces.show', $workspace)
            ->with('invitation_url', route('invitations.show', $invitation->token));
    }

    /**
     * Remove a member from the workspace.
     */
    public function removeMember(Request $request, Workspace $workspace, User $user): RedirectResponse
    {
        $this->authorize('update', $workspace);

        $workspace->users()->detach($user->id);

        return redirect()->route('workspaces.show', $workspace);
    }

    /**
     * Update a member's role in the workspace.
     */
    public function updateMemberRole(Request $request, Workspace $workspace, User $user): RedirectResponse
    {
        $this->authorize('update', $workspace);

        $request->validate(['role' => ['required', 'in:owner,member']]);

        $workspace->users()->updateExistingPivot($user->id, ['role' => $request->role]);

        return redirect()->route('workspaces.show', $workspace);
    }
}
