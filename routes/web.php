<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\WorkspaceInvitationController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('invitations/{token}', [WorkspaceInvitationController::class, 'show'])->name('invitations.show');
Route::post('invitations/{token}/accept', [WorkspaceInvitationController::class, 'accept'])->name('invitations.accept');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('workspaces', [WorkspaceController::class, 'index'])->name('workspaces.index');
    Route::post('workspaces', [WorkspaceController::class, 'store'])->name('workspaces.store');
    Route::get('workspaces/{workspace}', [WorkspaceController::class, 'show'])->name('workspaces.show');
    Route::patch('workspaces/{workspace}', [WorkspaceController::class, 'update'])->name('workspaces.update');
    Route::delete('workspaces/{workspace}', [WorkspaceController::class, 'destroy'])->name('workspaces.destroy');
    Route::post('workspaces/{workspace}/invite', [WorkspaceController::class, 'invite'])->name('workspaces.invite');
    Route::delete('workspaces/{workspace}/members/{user}', [WorkspaceController::class, 'removeMember'])->name('workspaces.members.remove');
    Route::patch('workspaces/{workspace}/members/{user}', [WorkspaceController::class, 'updateMemberRole'])->name('workspaces.members.update');

    Route::get('workspaces/{workspace}/projects/{project}', [ProjectController::class, 'show'])->name('workspaces.projects.show');
    Route::post('workspaces/{workspace}/projects', [ProjectController::class, 'store'])->name('workspaces.projects.store');
    Route::patch('workspaces/{workspace}/projects/{project}', [ProjectController::class, 'update'])->name('workspaces.projects.update');
    Route::delete('workspaces/{workspace}/projects/{project}', [ProjectController::class, 'destroy'])->name('workspaces.projects.destroy');

    Route::post('workspaces/{workspace}/projects/{project}/tasks', [TaskController::class, 'store'])->name('workspaces.projects.tasks.store');
    Route::patch('workspaces/{workspace}/projects/{project}/tasks/{task}', [TaskController::class, 'update'])->name('workspaces.projects.tasks.update');
    Route::delete('workspaces/{workspace}/projects/{project}/tasks/{task}', [TaskController::class, 'destroy'])->name('workspaces.projects.tasks.destroy');

    Route::post('workspaces/{workspace}/projects/{project}/tasks/{task}/comments', [CommentController::class, 'store'])->name('workspaces.projects.tasks.comments.store');
    Route::delete('workspaces/{workspace}/projects/{project}/tasks/{task}/comments/{comment}', [CommentController::class, 'destroy'])->name('workspaces.projects.tasks.comments.destroy');
});

require __DIR__.'/settings.php';
