import { router } from '@inertiajs/react';
import { useState } from 'react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TaskDetailModal } from '@/components/tasks/task-detail-modal';

type User = {
    id: number;
    name: string;
    email?: string;
};

type Task = {
    id: number;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    due_date: string | null;
    assignees?: User[];
    project: { id: number; name: string; workspace: { id: number; name: string } };
    comments?: unknown[];
    activityLogs?: unknown[];
    is_overdue?: boolean;
    is_near_due?: boolean;
};

const STATUS_OPTIONS = [
    { value: 'todo', label: 'Todo' },
    { value: 'doing', label: 'Doing' },
    { value: 'done', label: 'Done' },
];

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

function formatDate(dateStr: string | null) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export function TaskTable({
    tasks,
    members,
    canManage,
}: {
    tasks: Task[];
    members: User[];
    canManage: boolean;
}) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const handleStatusChange = (task: Task, newStatus: string) => {
        if (task.status === newStatus) return;
        const workspace = task.project.workspace;
        const project = task.project;
        const url = TaskController.update.url({
            workspace: { id: workspace.id },
            project: { id: project.id },
            task: { id: task.id },
        });
        setUpdatingId(task.id);
        router.patch(url, { status: newStatus }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setUpdatingId(null),
        });
    };

    if (tasks.length === 0) {
        return (
            <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
                <p className="text-sm">Belum ada task</p>
            </div>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[180px]">Project</TableHead>
                        <TableHead>Task Name</TableHead>
                        <TableHead className="w-[140px]">Assignee</TableHead>
                        <TableHead className="w-[120px]">Due</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[100px]">Priority</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow
                            key={task.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => canManage && setSelectedTask(task)}
                        >
                            <TableCell className="text-muted-foreground text-sm">
                                {task.project?.name ?? '-'}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                        {task.title}
                                    </span>
                                    {task.is_overdue && (
                                        <Badge variant="destructive" className="text-xs">
                                            Overdue
                                        </Badge>
                                    )}
                                    {task.is_near_due && !task.is_overdue && (
                                        <Badge className="bg-amber-500 text-xs text-white">
                                            Near due
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {task.assignees && task.assignees.length > 0 ? (
                                        task.assignees.map((u) => (
                                            <div
                                                key={u.id}
                                                className="flex items-center gap-2"
                                            >
                                                <Avatar className="size-6">
                                                    <AvatarFallback className="text-xs">
                                                        {u.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">
                                                    {u.name}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-muted-foreground text-sm">
                                            -
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell
                                className={
                                    task.is_overdue
                                        ? 'text-destructive font-medium'
                                        : ''
                                }
                            >
                                {formatDate(task.due_date)}
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                {canManage ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                type="button"
                                                disabled={!!updatingId}
                                                className="focus:outline-none"
                                            >
                                                <Badge
                                                    variant={statusVariant(
                                                        task.status,
                                                    )}
                                                    className="cursor-pointer hover:opacity-80"
                                                >
                                                    {task.status}
                                                </Badge>
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            {STATUS_OPTIONS.map((opt) => (
                                                <DropdownMenuItem
                                                    key={opt.value}
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            task,
                                                            opt.value,
                                                        )
                                                    }
                                                >
                                                    {opt.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Badge
                                        variant={statusVariant(task.status)}
                                    >
                                        {task.status}
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant={priorityVariant(task.priority)}>
                                    {task.priority}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    workspace={{ id: selectedTask.project.workspace.id }}
                    project={{ id: selectedTask.project.id }}
                    members={members}
                    canManage={canManage}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </>
    );
}
