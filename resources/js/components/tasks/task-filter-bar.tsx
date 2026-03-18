import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import workspaces from '@/routes/workspaces';

type User = {
    id: number;
    name: string;
    email: string;
};

type Filters = {
    status?: string;
    assigned_to?: string;
    due_from?: string;
    due_to?: string;
    search?: string;
};

const STATUS_OPTIONS = [
    { value: '', label: 'Semua status' },
    { value: 'todo', label: 'Todo' },
    { value: 'doing', label: 'Doing' },
    { value: 'done', label: 'Done' },
];

export function TaskFilterBar({
    workspace,
    project,
    filters,
    members,
}: {
    workspace: { id: number };
    project: { id: number };
    filters: Filters;
    members: User[];
}) {
    const [searchInput, setSearchInput] = useState(filters.search ?? '');
    const debouncedSearch = useDebounce(searchInput, 300);

    useEffect(() => {
        if (debouncedSearch === (filters.search ?? '')) {
            return;
        }
        const params: Record<string, string> = {};
        if (filters.status) params.status = filters.status;
        if (filters.assigned_to) params.assigned_to = filters.assigned_to;
        if (filters.due_from) params.due_from = filters.due_from;
        if (filters.due_to) params.due_to = filters.due_to;
        if (debouncedSearch) params.search = debouncedSearch;
        router.get(
            workspaces.projects.show.url({ workspace, project }),
            params,
            { preserveState: true },
        );
    }, [debouncedSearch, workspace.id, project.id, filters.status, filters.assigned_to, filters.due_from, filters.due_to]);

    const applyFilters = useCallback(
        (updates: Partial<Filters>) => {
            const params = { ...filters, ...updates };
            Object.keys(params).forEach((key) => {
                const k = key as keyof Filters;
                if (params[k] === '' || params[k] === undefined) {
                    delete params[k];
                }
            });
            router.get(
                workspaces.projects.show.url({ workspace, project }),
                params,
                { preserveState: true },
            );
        },
        [workspace, project, filters],
    );

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Cari task..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-8"
                />
            </div>
            <select
                value={filters.status ?? ''}
                onChange={(e) => applyFilters({ status: e.target.value })}
                className="flex h-9 rounded-md border border-input bg-transparent px-2 text-sm"
            >
                {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value || 'all'} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <Input
                type="date"
                placeholder="Dari"
                value={filters.due_from ?? ''}
                onChange={(e) => applyFilters({ due_from: e.target.value })}
                className="h-9 w-[130px]"
            />
            <Input
                type="date"
                placeholder="Sampai"
                value={filters.due_to ?? ''}
                onChange={(e) => applyFilters({ due_to: e.target.value })}
                className="h-9 w-[130px]"
            />
            <select
                value={filters.assigned_to ?? ''}
                onChange={(e) =>
                    applyFilters({ assigned_to: e.target.value || undefined })
                }
                className="flex h-9 rounded-md border border-input bg-transparent px-2 text-sm"
            >
                <option value="">Semua assignee</option>
                {members.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
