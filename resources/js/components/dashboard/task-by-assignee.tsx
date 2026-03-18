import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, User } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TaskTable } from './task-table';

type UserType = {
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
    assignees?: UserType[];
    project: { id: number; name: string; workspace: { id: number; name: string } };
    comments?: unknown[];
    activityLogs?: unknown[];
    is_overdue?: boolean;
    is_near_due?: boolean;
};

export function TaskByAssignee({
    tasks,
    members,
    canManage,
}: {
    tasks: Task[];
    members: UserType[];
    canManage: boolean;
}) {
    const assigneeGroups = new Map<number | 'unassigned', { user?: UserType; tasks: Task[] }>();

    for (const task of tasks) {
        if (task.assignees && task.assignees.length > 0) {
            for (const u of task.assignees) {
                if (!assigneeGroups.has(u.id)) {
                    assigneeGroups.set(u.id, { user: u, tasks: [] });
                }
                assigneeGroups.get(u.id)!.tasks.push(task);
            }
        } else {
            if (!assigneeGroups.has('unassigned')) {
                assigneeGroups.set('unassigned', { tasks: [] });
            }
            assigneeGroups.get('unassigned')!.tasks.push(task);
        }
    }

    const unassigned = assigneeGroups.get('unassigned');
    const assigned = Array.from(assigneeGroups.entries())
        .filter(([k]) => k !== 'unassigned')
        .map(([, v]) => v)
        .sort((a, b) => (a.user?.name ?? '').localeCompare(b.user?.name ?? ''));

    const [openIds, setOpenIds] = useState<Set<number | string>>(
        new Set([
            ...assigned.map((a) => a.user!.id),
            ...(unassigned ? ['unassigned'] : []),
        ]),
    );

    const toggle = (id: number | string) => {
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
            {assigned.map(({ user, tasks: groupTasks }) => {
                if (!user) return null;
                const isOpen = openIds.has(user.id);
                return (
                    <Collapsible
                        key={user.id}
                        open={isOpen}
                        onOpenChange={() => toggle(user.id)}
                    >
                        <CollapsibleTrigger className="flex w-full items-center gap-3 rounded-lg border p-3 hover:bg-muted/50">
                            {isOpen ? (
                                <ChevronDown className="size-4" />
                            ) : (
                                <ChevronRight className="size-4" />
                            )}
                            <Avatar className="size-8">
                                <AvatarFallback>
                                    {user.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                            <Badge variant="secondary">
                                {groupTasks.length}
                            </Badge>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="ml-11 mt-2 border-l pl-4">
                                <TaskTable
                                    tasks={groupTasks}
                                    members={members}
                                    canManage={canManage}
                                />
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                );
            })}
            {unassigned && unassigned.tasks.length > 0 && (
                <Collapsible
                    open={openIds.has('unassigned')}
                    onOpenChange={() => toggle('unassigned')}
                >
                    <CollapsibleTrigger className="flex w-full items-center gap-3 rounded-lg border p-3 hover:bg-muted/50">
                        {openIds.has('unassigned') ? (
                            <ChevronDown className="size-4" />
                        ) : (
                            <ChevronRight className="size-4" />
                        )}
                        <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                            <User className="size-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium">Belum ditugaskan</span>
                        <Badge variant="secondary">
                            {unassigned.tasks.length}
                        </Badge>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="ml-11 mt-2 border-l pl-4">
                            <TaskTable
                                tasks={unassigned.tasks}
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
