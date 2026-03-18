<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TaskMentionedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Comment $comment
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $this->comment->loadMissing('task');

        return [
            'comment_id' => $this->comment->id,
            'task_id' => $this->comment->task_id,
            'task_title' => $this->comment->task->title,
            'user_name' => $this->comment->user->name,
            'message' => "{$this->comment->user->name} menyebut Anda di task: {$this->comment->task->title}",
        ];
    }
}
