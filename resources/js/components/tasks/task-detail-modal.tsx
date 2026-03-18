import { Form } from '@inertiajs/react';
import CommentController from '@/actions/App/Http/Controllers/CommentController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import workspaces from '@/routes/workspaces';

type User = {
    id: number;
    name: string;
    email: string;
};

type Comment = {
    id: number;
    content: string;
    user: User;
    created_at: string;
};

type Task = {
    id: number;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    due_date: string | null;
    assignees?: User[];
    comments?: Comment[];
    is_overdue?: boolean;
    is_near_due?: boolean;
};

type TaskDetailModalProps = {
    task: Task | null;
    workspace: { id: number };
    project: { id: number };
    canManage: boolean;
    onClose: () => void;
};

const statusVariant = (status: string) => {
    switch (status) {
        case 'done':
            return 'default';
        case 'doing':
            return 'secondary';
        default:
            return 'outline';
    }
};

const priorityVariant = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'destructive';
        case 'medium':
            return 'default';
        default:
            return 'secondary';
    }
};

export function TaskDetailModal({
    task,
    workspace,
    project,
    canManage,
    onClose,
}: TaskDetailModalProps) {
    if (!task) return null;

    const comments = task.comments ?? [];

    return (
        <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{task.title}</DialogTitle>
                    <DialogDescription>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant={statusVariant(task.status)}>
                                {task.status}
                            </Badge>
                            <Badge variant={priorityVariant(task.priority)}>
                                {task.priority}
                            </Badge>
                            {task.is_overdue && (
                                <Badge variant="destructive">Overdue</Badge>
                            )}
                            {task.is_near_due && !task.is_overdue && (
                                <Badge className="bg-amber-500 text-white">
                                    Near due
                                </Badge>
                            )}
                            {task.due_date && (
                                <span className="text-muted-foreground text-sm">
                                    Due:{' '}
                                    {new Date(
                                        task.due_date,
                                    ).toLocaleDateString()}
                                </span>
                            )}
                            {task.assignees && task.assignees.length > 0 && (
                                <span className="text-muted-foreground text-sm">
                                    Assignees:{' '}
                                    {task.assignees.map((u) => u.name).join(', ')}
                                </span>
                            )}
                        </div>
                    </DialogDescription>
                </DialogHeader>

                {task.description && (
                    <p className="text-muted-foreground text-sm">
                        {task.description}
                    </p>
                )}

                <div className="mt-4 border-t pt-4">
                    <h4 className="mb-2 font-medium">Comments</h4>
                    <div className="space-y-6">
                        {comments.length === 0 ? (
                            <p className="text-muted-foreground text-sm">
                                Belum ada komentar
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {comments.map((comment) => (
                                    <li
                                        key={comment.id}
                                        className="rounded-lg border p-3"
                                    >
                                        <p className="text-sm">
                                            {comment.content}
                                        </p>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            {comment.user.name} —
                                            {new Date(
                                                comment.created_at,
                                            ).toLocaleString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {canManage && (
                            <Form
                                {...CommentController.store.form({
                                    workspace,
                                    project,
                                    task,
                                })}
                                className="space-y-2"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <Label htmlFor="comment-content">
                                            Tambah komentar
                                        </Label>
                                        <textarea
                                            id="comment-content"
                                            name="content"
                                            placeholder="Tulis komentar..."
                                            required
                                            rows={3}
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        />
                                        <InputError
                                            message={errors.content}
                                        />
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={processing}
                                        >
                                            {processing && <Spinner />}
                                            Kirim
                                        </Button>
                                    </>
                                )}
                            </Form>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
