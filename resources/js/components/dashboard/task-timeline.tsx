import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { TaskDetailModal } from '@/components/tasks/task-detail-modal';
import { useState } from 'react';

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
    created_at?: string;
    assignees?: User[];
    project: { id: number; name?: string; workspace: { id: number; name?: string } };
    comments?: unknown[];
    activityLogs?: unknown[];
    is_overdue?: boolean;
    is_near_due?: boolean;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function getDateRange(tasks: Task[]) {
    const dates: number[] = [];
    for (const t of tasks) {
        if (t.due_date) dates.push(new Date(t.due_date).getTime());
        if (t.created_at) dates.push(new Date(t.created_at).getTime());
    }
    if (dates.length === 0) {
        const now = Date.now();
        return { start: now - 7 * MS_PER_DAY, end: now + 14 * MS_PER_DAY };
    }
    const min = Math.min(...dates);
    const max = Math.max(...dates);
    const padding = 7 * MS_PER_DAY;
    return { start: min - padding, end: max + padding };
}

function formatDateLabel(ts: number) {
    return new Date(ts).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
    });
}

export function TaskTimeline({
    tasks,
    members,
    canManage,
}: {
    tasks: Task[];
    members: User[];
    canManage: boolean;
}) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const { start, end } = useMemo(() => getDateRange(tasks), [tasks]);
    const totalDays = (end - start) / MS_PER_DAY;

    const tasksWithPosition = useMemo(() => {
        return tasks
            .map((task) => {
                const due = task.due_date
                    ? new Date(task.due_date).getTime()
                    : task.created_at
                      ? new Date(task.created_at).getTime()
                      : Date.now();
                const left = ((due - start) / MS_PER_DAY / totalDays) * 100;
                const barWidth = 4;
                return {
                    ...task,
                    left: Math.max(0, Math.min(100 - barWidth, left)),
                    barWidth,
                };
            })
            .sort((a, b) => (a.due_date ?? '').localeCompare(b.due_date ?? ''));
    }, [tasks, start, totalDays]);

    const dateLabels = useMemo(() => {
        const labels: { ts: number; left: number }[] = [];
        const step = Math.ceil(totalDays / 14);
        for (let d = 0; d <= totalDays; d += step) {
            const ts = start + d * MS_PER_DAY;
            labels.push({ ts, left: (d / totalDays) * 100 });
        }
        return labels;
    }, [start, totalDays]);

    if (tasks.length === 0) {
        return (
            <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
                <p className="text-sm">Belum ada task</p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    <div className="relative mb-4 h-8 border-b">
                        {dateLabels.map(({ ts, left }) => (
                            <div
                                key={ts}
                                className="absolute top-0 -translate-x-1/2 text-xs text-muted-foreground"
                                style={{ left: `${left}%` }}
                            >
                                {formatDateLabel(ts)}
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        {tasksWithPosition.map((task) => (
                            <div
                                key={task.id}
                                className="relative flex h-10 items-center gap-2"
                            >
                                <div
                                    className="min-w-0 flex-1 truncate text-sm"
                                    title={task.title}
                                >
                                    {task.title}
                                </div>
                                <div className="relative h-6 flex-1 overflow-hidden rounded border bg-muted/30">
                                    <div
                                        className={`absolute top-0 h-full rounded ${
                                            task.status === 'done'
                                                ? 'bg-green-500/70'
                                                : task.is_overdue
                                                  ? 'bg-red-500/70'
                                                  : task.is_near_due
                                                    ? 'bg-amber-500/70'
                                                    : 'bg-primary/70'
                                        }`}
                                        style={{
                                            left: `${task.left}%`,
                                            width: `${task.barWidth}%`,
                                        }}
                                        title={task.due_date ?? 'No date'}
                                    />
                                </div>
                                <Badge
                                    variant={
                                        task.status === 'done'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="shrink-0"
                                >
                                    {task.status}
                                </Badge>
                                <button
                                    type="button"
                                    onClick={() =>
                                        canManage && setSelectedTask(task)
                                    }
                                    className="text-primary shrink-0 text-xs underline hover:no-underline"
                                >
                                    Detail
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    workspace={{
                        id: selectedTask.project.workspace.id,
                    }}
                    project={{ id: selectedTask.project.id }}
                    members={members}
                    canManage={canManage}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </>
    );
}
