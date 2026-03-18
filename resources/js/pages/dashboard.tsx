import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DashboardTaskFilterBar } from '@/components/dashboard/dashboard-task-filter-bar';
import { DashboardKanban } from '@/components/dashboard/dashboard-kanban';
import { QuickAddTaskDialog } from '@/components/dashboard/quick-add-task-dialog';
import { TaskByAssignee } from '@/components/dashboard/task-by-assignee';
import { TaskByProject } from '@/components/dashboard/task-by-project';
import { TaskTable } from '@/components/dashboard/task-table';
import { TaskTimeline } from '@/components/dashboard/task-timeline';
import { ViewTabs, type ViewMode } from '@/components/dashboard/view-tabs';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Tasks', href: dashboard.url() },
];

type User = {
    id: number;
    name: string;
    email?: string;
};

type Project = {
    id: number;
    name: string;
    workspace?: { id: number; name: string };
};

type Workspace = {
    id: number;
    name: string;
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

type DashboardProps = {
    tasks: Task[];
    workspaces: Workspace[];
    projects: Project[];
    members: User[];
    canManage: boolean;
    sortBy?: string;
    sortDir?: string;
    filters: Record<string, string | undefined>;
};

export default function Dashboard({
    tasks,
    workspaces,
    projects,
    members,
    canManage,
    sortBy,
    sortDir,
    filters,
}: DashboardProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');

    const applySort = (by: string, dir: string) => {
        const params = { ...filters, sort_by: by, sort_dir: dir };
        Object.keys(params).forEach((key) => {
            if (params[key] === '' || params[key] === undefined) {
                delete params[key];
            }
        });
        router.get(dashboard.url(), params, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Tasks" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Tasks</h1>
                        {canManage && (
                            <QuickAddTaskDialog
                                projects={projects.filter(
                                    (p) => p.workspace,
                                ) as Project[]}
                                filters={filters}
                                trigger={
                                    <Button size="sm">Tambah task</Button>
                                }
                            />
                        )}
                    </div>

                    <DashboardTaskFilterBar
                        filters={filters}
                        projects={projects}
                        workspaces={workspaces}
                        members={members}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <ViewTabs value={viewMode} onChange={setViewMode} />
                        <select
                            value={`${sortBy ?? 'position'}-${sortDir ?? 'asc'}`}
                            onChange={(e) => {
                                const [by, dir] = e.target.value.split('-');
                                applySort(by, dir);
                            }}
                            className="flex h-9 rounded-md border border-input bg-transparent px-2 text-sm"
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
                    </div>
                </div>

                <div className="min-h-[400px] flex-1">
                    {viewMode === 'table' && (
                        <TaskTable
                            tasks={tasks}
                            members={members}
                            canManage={canManage}
                        />
                    )}
                    {viewMode === 'by_project' && (
                        <TaskByProject
                            tasks={tasks}
                            members={members}
                            canManage={canManage}
                        />
                    )}
                    {viewMode === 'board' && (
                        <DashboardKanban
                            tasks={tasks}
                            members={members}
                            canManage={canManage}
                        />
                    )}
                    {viewMode === 'timeline' && (
                        <TaskTimeline
                            tasks={tasks}
                            members={members}
                            canManage={canManage}
                        />
                    )}
                    {viewMode === 'by_assignee' && (
                        <TaskByAssignee
                            tasks={tasks}
                            members={members}
                            canManage={canManage}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
