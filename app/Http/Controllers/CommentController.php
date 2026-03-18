<?php

namespace App\Http\Controllers;

use App\Http\Requests\Comment\StoreCommentRequest;
use App\Models\ActivityLog;
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

        $comment = $task->comments()->create([
            'content' => $request->validated('content'),
            'user_id' => $request->user()->id,
        ]);

        ActivityLog::log(
            'comment_added',
            'comment',
            $comment->id,
            ['comment_id' => $comment->id, 'task_id' => $task->id],
            $request->user()->id,
            $task->id
        );

        return redirect()
            ->route('workspaces.projects.show', [$workspace, $project])
            ->with('success', 'Komentar berhasil ditambahkan.');
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

        return redirect()
            ->route('workspaces.projects.show', [$workspace, $project])
            ->with('success', 'Komentar berhasil dihapus.');
    }
}
