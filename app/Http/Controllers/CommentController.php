<?php

namespace App\Http\Controllers;

use App\Http\Requests\Comment\StoreCommentRequest;
use App\Models\Comment;
use App\Models\Project;
use App\Models\Task;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Store a newly created comment.
     */
    public function store(StoreCommentRequest $request, Workspace $workspace, Project $project, Task $task): RedirectResponse
    {
        if ($project->workspace_id !== $workspace->id || $task->project_id !== $project->id) {
            abort(404);
        }

        $this->authorize('update', $task);

        $task->comments()->create([
            'content' => $request->validated('content'),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('workspaces.projects.show', [$workspace, $project]);
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(Request $request, Workspace $workspace, Project $project, Task $task, Comment $comment): RedirectResponse
    {
        if ($project->workspace_id !== $workspace->id
            || $task->project_id !== $project->id
            || $comment->task_id !== $task->id) {
            abort(404);
        }

        if ($comment->user_id !== $request->user()->id && ! $request->user()->isAdministrator()) {
            abort(403);
        }

        $comment->delete();

        return redirect()->route('workspaces.projects.show', [$workspace, $project]);
    }
}
