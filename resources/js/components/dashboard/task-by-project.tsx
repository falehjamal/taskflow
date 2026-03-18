import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { TaskTable } from './task-table';

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

export function TaskByProject({
    tasks,
    members,
    canManage,
}: {
    tasks: Task[];
    members: User[];
    canManage: boolean;
}) {
    const projects = Array.from(
        new Map(
            tasks
                .filter((t) => t.project)
                .map((t) => [t.project.id, t.project]),
        ).values(),
    ).sort((a, b) => a.name.localeCompare(b.name));

    const ungrouped = tasks.filter((t) => !t.project);
    const [openIds, setOpenIds] = useState<Set<number>>(
        new Set(projects.map((p) => p.id)),
    );

    const toggle = (id: number) => {
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
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
        <div className="space-y-2">
            {projects.map((project) => {
                const projectTasks = tasks.filter(
                    (t) => t.project?.id === project.id,
                );
                const isOpen = openIds.has(project.id);
                return (
                    <Collapsible
                        key={project.id}
                        open={isOpen}
                        onOpenChange={() => toggle(project.id)}
                    >
                        <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border p-3 hover:bg-muted/50">
                            {isOpen ? (
                                <ChevronDown className="size-4" />
                            ) : (
                                <ChevronRight className="size-4" />
                            )}
                            <span className="font-medium">{project.name}</span>
                            <Badge variant="secondary">
                                {projectTasks.length}
                            </Badge>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="ml-6 mt-2 border-l pl-4">
                                <TaskTable
                                    tasks={projectTasks}
                                    members={members}
                                    canManage={canManage}
                                />
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                );
            })}
            {ungrouped.length > 0 && (
                <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border p-3 hover:bg-muted/50">
                        <ChevronDown className="size-4" />
                        <span className="font-medium">Tanpa project</span>
                        <Badge variant="secondary">{ungrouped.length}</Badge>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="ml-6 mt-2 border-l pl-4">
                            <TaskTable
                                tasks={ungrouped}
                                members={members}
                                canManage={canManage}
                            />
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>
    );
}
