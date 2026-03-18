import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { router } from '@inertiajs/react';
import { GripVertical } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import { Badge } from '@/components/ui/badge';
import { TaskDetailModal } from '@/components/tasks/task-detail-modal';

const COLUMNS = [
    { id: 'todo', label: 'Todo' },
    { id: 'doing', label: 'Doing' },
    { id: 'done', label: 'Done' },
] as const;

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
    project: { id: number; name?: string; workspace: { id: number; name?: string } };
    comments?: unknown[];
    activityLogs?: unknown[];
    is_overdue?: boolean;
    is_near_due?: boolean;
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

function KanbanCard({ task, isOverlay = false }: { task: Task; isOverlay?: boolean }) {
    return (
        <div
            className={`rounded-lg border bg-card p-3 shadow-sm ${
                isOverlay ? 'cursor-grabbing' : ''
            }`}
        >
            <p className="font-medium">{task.title}</p>
            {task.project?.name && (
                <p className="text-muted-foreground mt-1 text-xs">
                    {task.project.name}
                </p>
            )}
            <div className="mt-1 flex flex-wrap gap-1">
                <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                {task.is_overdue && (
                    <Badge variant="destructive">Overdue</Badge>
                )}
                {task.is_near_due && !task.is_overdue && (
                    <Badge className="bg-amber-500 text-white">Near due</Badge>
                )}
                {task.assignees && task.assignees.length > 0 && (
                    <span className="text-muted-foreground text-xs">
                        {task.assignees.map((u) => u.name).join(', ')}
                    </span>
                )}
            </div>
        </div>
    );
}

function DraggableCard({
    task,
    canManage,
    onClick,
}: {
    task: Task;
    canManage: boolean;
    onClick?: () => void;
}) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `task-${task.id}`,
        data: { task },
    });

    return (
        <div
            ref={setNodeRef}
            className={`mb-2 ${isDragging ? 'opacity-50' : ''}`}
        >
            <div
                className={`flex items-start gap-2 rounded-lg border bg-card p-3 shadow-sm ${
                    canManage ? 'cursor-grab active:cursor-grabbing' : ''
                }`}
                onClick={onClick}
            >
                {canManage && (
                    <div
                        {...listeners}
                        {...attributes}
                        className="mt-0.5 shrink-0 touch-none"
                    >
                        <GripVertical className="size-4 text-muted-foreground" />
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="font-medium">{task.title}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                        {task.is_overdue && (
                            <Badge variant="destructive">Overdue</Badge>
                        )}
                        {task.is_near_due && !task.is_overdue && (
                            <Badge className="bg-amber-500 text-white">
                                Near due
                            </Badge>
                        )}
                        {task.assignees && task.assignees.length > 0 && (
                            <span className="text-muted-foreground text-xs">
                                {task.assignees.map((u) => u.name).join(', ')}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DroppableColumn({
    columnId,
    label,
    tasks,
    canManage,
    onTaskClick,
}: {
    columnId: string;
    label: string;
    tasks: Task[];
    canManage: boolean;
    onTaskClick?: (task: Task) => void;
}) {
    const { isOver, setNodeRef } = useDroppable({ id: columnId });

    return (
        <div
            ref={setNodeRef}
            className={`flex min-w-[280px] flex-1 flex-col rounded-lg border bg-muted/30 p-3 transition-colors ${
                isOver ? 'ring-2 ring-primary' : ''
            }`}
        >
            <h3 className="mb-3 font-semibold">{label}</h3>
            <div className="min-h-[100px] flex-1 space-y-0">
                {tasks.map((task) => (
                    <DraggableCard
                        key={task.id}
                        task={task}
                        canManage={canManage}
                        onClick={() => onTaskClick?.(task)}
                    />
                ))}
            </div>
        </div>
    );
}

export function DashboardKanban({
    tasks,
    members,
    canManage,
}: {
    tasks: Task[];
    members: User[];
    canManage: boolean;
}) {
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [localTasks, setLocalTasks] = useState(tasks);

    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
    );

    const tasksByColumn = COLUMNS.reduce(
        (acc, col) => {
            acc[col.id] = localTasks.filter((t) => t.status === col.id);
            return acc;
        },
        {} as Record<string, Task[]>,
    );

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        const data = active.data.current;
        if (data?.task) {
            setActiveTask(data.task);
        }
    }, []);

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            setActiveTask(null);
            const { active, over } = event;
            if (!over || !canManage) return;

            const taskData = active.data.current?.task as Task | undefined;
            if (!taskData) return;

            const overId = String(over.id);
            let newStatus: string | null = null;

            if (COLUMNS.some((c) => c.id === overId)) {
                newStatus = overId;
            } else if (overId.startsWith('task-')) {
                const targetTaskId = parseInt(overId.replace('task-', ''), 10);
                const targetTask = localTasks.find((t) => t.id === targetTaskId);
                if (targetTask) newStatus = targetTask.status;
            }

            if (!newStatus || newStatus === taskData.status) return;

            const workspace = taskData.project.workspace;
            const project = taskData.project;
            const url = TaskController.update.url({
                workspace: { id: workspace.id },
                project: { id: project.id },
                task: { id: taskData.id },
            });

            const backup = [...localTasks];
            setLocalTasks((prev) =>
                prev.map((t) =>
                    t.id === taskData.id ? { ...t, status: newStatus! } : t,
                ),
            );

            router.patch(url, { status: newStatus }, {
                preserveState: true,
                preserveScroll: true,
                onError: () => setLocalTasks(backup),
            });
        },
        [canManage, localTasks],
    );

    if (tasks.length === 0) {
        return (
            <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
                <p className="text-sm">Belum ada task</p>
            </div>
        );
    }

    return (
        <>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {COLUMNS.map((col) => (
                        <DroppableColumn
                            key={col.id}
                            columnId={col.id}
                            label={col.label}
                            tasks={tasksByColumn[col.id] ?? []}
                            canManage={canManage}
                            onTaskClick={(task) => setSelectedTask(task)}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <div className="w-[260px]">
                            <KanbanCard task={activeTask} isOverlay />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

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
