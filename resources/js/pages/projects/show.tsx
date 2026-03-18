import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { KanbanBoard } from '@/components/tasks/kanban-board';
import { TaskDetailModal } from '@/components/tasks/task-detail-modal';
import { TaskFilterBar } from '@/components/tasks/task-filter-bar';
import { TaskListSkeleton } from '@/components/tasks/task-list-skeleton';
import { useIsNavigating } from '@/hooks/use-is-navigating';
import AppLayout from '@/layouts/app-layout';
import workspaces from '@/routes/workspaces';
import type { BreadcrumbItem } from '@/types';

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
    creator?: User | null;
    comments?: Comment[];
    is_overdue?: boolean;
    is_near_due?: boolean;
};

type Project = {
    id: number;
    name: string;
    description: string | null;
    workspace: { id: number; name: string };
};

type Workspace = {
    id: number;
    name: string;
    users: User[];
};

const STATUS_OPTIONS = [
    { value: 'todo', label: 'Todo' },
    { value: 'doing', label: 'Doing' },
    { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
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

function TaskForm({
    workspace,
    project,
    task,
    onSuccess,
}: {
    workspace: Workspace;
    project: Project;
    task?: Task;
    onSuccess?: () => void;
}) {
    const isEdit = !!task;

    return (
        <Form
            {...(isEdit
                ? TaskController.update.form({ workspace, project, task })
                : TaskController.store.form({ workspace, project }))}
            className="space-y-4"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="task-title">Judul</Label>
                        <Input
                            id="task-title"
                            name="title"
                            required
                            placeholder="Judul task"
                            defaultValue={task?.title}
                            autoComplete="off"
                        />
                        <InputError message={errors.title} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="task-description">Deskripsi</Label>
                        <Input
                            id="task-description"
                            name="description"
                            placeholder="Opsional"
                            defaultValue={task?.description || ''}
                            autoComplete="off"
                        />
                        <InputError message={errors.description} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-2">
                            <Label htmlFor="task-status">Status</Label>
                            <select
                                id="task-status"
                                name="status"
                                required
                                defaultValue={task?.status || 'todo'}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.status} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="task-priority">Priority</Label>
                            <select
                                id="task-priority"
                                name="priority"
                                required
                                defaultValue={task?.priority || 'medium'}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {PRIORITY_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.priority} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-2">
                            <Label htmlFor="task-due_date">Due date</Label>
                            <Input
                                id="task-due_date"
                                name="due_date"
                                type="date"
                                defaultValue={
                                    task?.due_date?.slice(0, 10) || ''
                                }
                            />
                            <InputError message={errors.due_date} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="task-assignees">Assignees</Label>
                            <select
                                id="task-assignees"
                                name="assignee_ids[]"
                                multiple
                                defaultValue={
                                    task?.assignees?.map((u) => String(u.id)) ?? []
                                }
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {workspace.users.map((user) => (
                                    <option
                                        key={user.id}
                                        value={user.id}
                                    >
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.assignee_ids} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            {isEdit ? 'Simpan' : 'Buat'}
                        </Button>
                    </DialogFooter>
                </>
            )}
        </Form>
    );
}

export default function ProjectShow({
    workspace,
    project,
    tasks,
    members,
    canManage,
    sortBy,
    sortDir,
    filters = {},
}: {
    workspace: Workspace;
    project: Project;
    tasks: Task[];
    members: User[];
    canManage: boolean;
    sortBy?: string;
    sortDir?: string;
    filters?: {
        status?: string;
        assigned_to?: string;
        due_from?: string;
        due_to?: string;
        search?: string;
    };
}) {
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const isNavigating = useIsNavigating();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Workspaces', href: workspaces.index.url() },
        {
            title: workspace.name,
            href: workspaces.show.url(workspace),
        },
        {
            title: project.name,
            href: workspaces.projects.show.url({ workspace, project }),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {project.name}
                        </h1>
                        {project.description && (
                            <p className="text-muted-foreground mt-1 text-sm">
                                {project.description}
                            </p>
                        )}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <TaskFilterBar
                            workspace={workspace}
                            project={project}
                            filters={filters}
                            members={members}
                        />
                        <div className="mt-4 flex items-center justify-between">
                            <div>
                                <CardTitle>Tasks</CardTitle>
                                <CardDescription>
                                    {tasks.length} task
                                    {tasks.length !== 1 ? 's' : ''}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={`${sortBy ?? 'position'}-${sortDir ?? 'asc'}`}
                                    onChange={(e) => {
                                        const [by, dir] = e.target.value.split(
                                            '-',
                                        );
                                        const params: Record<string, string> =
                                            {};
                                        if (by !== 'position') {
                                            params.sort_by = by;
                                            params.sort_dir = dir;
                                        }
                                        router.get(
                                            workspaces.projects.show.url({
                                                workspace,
                                                project,
                                            }),
                                            params,
                                            { preserveState: true },
                                        );
                                    }}
                                    className="flex h-8 rounded-md border border-input bg-transparent px-2 text-sm"
                                >
                                    <option value="position-asc">
                                        Urut: Posisi
                                    </option>
                                    <option value="due_date-asc">
                                        Urut: Due date (terdekat)
                                    </option>
                                    <option value="due_date-desc">
                                        Urut: Due date (terjauh)
                                    </option>
                                </select>
                                <div className="flex rounded-md border border-input">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setViewMode('list')
                                        }
                                        className={`px-2 py-1 text-sm ${
                                            viewMode === 'list'
                                                ? 'bg-muted'
                                                : ''
                                        }`}
                                    >
                                        List
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setViewMode('kanban')
                                        }
                                        className={`rounded-r px-2 py-1 text-sm ${
                                            viewMode === 'kanban'
                                                ? 'bg-muted'
                                                : ''
                                        }`}
                                    >
                                        Kanban
                                    </button>
                                </div>
                                {canManage && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm">
                                            Tambah task
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle>Buat task</DialogTitle>
                                        <DialogDescription>
                                            Tambah task baru ke project ini.
                                        </DialogDescription>
                                        <TaskForm
                                            workspace={workspace}
                                            project={project}
                                        />
                                    </DialogContent>
                                </Dialog>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isNavigating ? (
                            <TaskListSkeleton count={tasks.length || 5} />
                        ) : viewMode === 'kanban' ? (
                            <KanbanBoard
                                tasks={tasks}
                                workspace={workspace}
                                project={project}
                                canManage={!!canManage}
                                onTaskClick={setSelectedTask}
                            />
                        ) : (
                        <ul className="space-y-2">
                            {tasks.length === 0 ? (
                                <li className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
                                    Belum ada task
                                    {canManage && (
                                        <>
                                            {' '}
                                            —{' '}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
                                                    >
                                                        Buat task pertama
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogTitle>
                                                        Buat task
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Tambah task baru ke
                                                        project ini.
                                                    </DialogDescription>
                                                    <TaskForm
                                                        workspace={workspace}
                                                        project={project}
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                        </>
                                    )}
                                </li>
                            ) : (
                                tasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div
                                            className={`flex-1 ${canManage ? 'cursor-pointer hover:opacity-80' : ''}`}
                                            onClick={() =>
                                                canManage &&
                                                setSelectedTask(task)
                                            }
                                            onKeyDown={(e) =>
                                                canManage &&
                                                e.key === 'Enter' &&
                                                setSelectedTask(task)
                                            }
                                            role={canManage ? 'button' : undefined}
                                            tabIndex={canManage ? 0 : undefined}
                                        >
                                            <p className="font-medium">
                                                {task.title}
                                            </p>
                                            <div className="mt-1 flex flex-wrap gap-2">
                                                <Badge
                                                    variant={statusVariant(
                                                        task.status,
                                                    )}
                                                >
                                                    {task.status}
                                                </Badge>
                                                <Badge
                                                    variant={priorityVariant(
                                                        task.priority,
                                                    )}
                                                >
                                                    {task.priority}
                                                </Badge>
                                                {task.due_date && (
                                                    <span className="text-muted-foreground text-sm">
                                                        {new Date(
                                                            task.due_date,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {task.is_overdue && (
                                                    <Badge variant="destructive">
                                                        Overdue
                                                    </Badge>
                                                )}
                                                {task.is_near_due &&
                                                    !task.is_overdue && (
                                                        <Badge className="bg-amber-500 text-white hover:bg-amber-600">
                                                            Near due
                                                        </Badge>
                                                    )}
                                                {task.assignees &&
                                                    task.assignees.length >
                                                        0 && (
                                                        <span className="text-muted-foreground text-sm">
                                                            →{' '}
                                                            {task.assignees
                                                                .map((u) => u.name)
                                                                .join(', ')}
                                                        </span>
                                                    )}
                                            </div>
                                        </div>
                                        {canManage && (
                                            <div className="flex gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Ubah
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogTitle>
                                                            Ubah task
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Perbarui detail task.
                                                        </DialogDescription>
                                                        <TaskForm
                                                            workspace={
                                                                workspace
                                                            }
                                                            project={project}
                                                            task={task}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                                <Form
                                                    {...TaskController.destroy.form(
                                                        {
                                                            workspace,
                                                            project,
                                                            task,
                                                        },
                                                    )}
                                                >
                                                    <Button
                                                        type="submit"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        Hapus
                                                    </Button>
                                                </Form>
                                            </div>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                        )}
                    </CardContent>
                </Card>

                <TaskDetailModal
                    task={selectedTask}
                    workspace={workspace}
                    project={project}
                    members={members}
                    canManage={!!canManage}
                    onClose={() => setSelectedTask(null)}
                />
            </div>
        </AppLayout>
    );
}
