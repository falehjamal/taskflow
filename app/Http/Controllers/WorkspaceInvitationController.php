<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\WorkspaceInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceInvitationController extends Controller
{
    /**
     * Display the invitation accept page.
     */
    public function show(string $token): Response|RedirectResponse
    {
        $invitation = WorkspaceInvitation::where('token', $token)
            ->with('workspace')
            ->firstOrFail();

        if ($invitation->isExpired()) {
            return redirect()->route('home')
                ->with('error', 'This invitation has expired.');
        }

        return Inertia::render('invitations/show', [
            'invitation' => [
                'email' => $invitation->email,
                'workspace_name' => $invitation->workspace->name,
                'token' => $invitation->token,
            ],
        ]);
    }

    /**
     * Accept the invitation and add user to workspace.
     */
    public function accept(Request $request, string $token): RedirectResponse
    {
        $invitation = WorkspaceInvitation::where('token', $token)
            ->with('workspace')
            ->firstOrFail();

        if ($invitation->isExpired()) {
            return redirect()->route('home')
                ->with('error', 'This invitation has expired.');
        }

        $user = User::where('email', $invitation->email)->first();

        if (! $user) {
            return redirect()->route('invitations.show', $token)
                ->with('error', 'No account found with this email. Please register first.');
        }

        if ($invitation->workspace->users()->where('user_id', $user->id)->exists()) {
            $invitation->delete();

            return redirect()->route('workspaces.show', $invitation->workspace)
                ->with('info', 'You are already a member of this workspace.');
        }

        $invitation->workspace->users()->attach($user->id, ['role' => $invitation->role]);
        $invitation->delete();

        if ($request->user()?->id !== $user->id) {
            auth()->login($user);
        }

        return redirect()->route('workspaces.show', $invitation->workspace)
            ->with('success', 'You have joined the workspace.');
    }
}
