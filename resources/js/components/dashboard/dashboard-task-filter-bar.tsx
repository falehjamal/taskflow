import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { dashboard } from '@/routes';

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

type Filters = {
    status?: string;
    status_exclude?: string;
    assigned_to?: string;
    due_from?: string;
    due_to?: string;
    search?: string;
    project_id?: string;
    workspace_id?: string;
};

const STATUS_OPTIONS = [
    { value: '', label: 'Semua status' },
    { value: 'todo', label: 'Todo' },
    { value: 'doing', label: 'Doing' },
    { value: 'done', label: 'Done' },
];

export function DashboardTaskFilterBar({
    filters,
    projects,
    workspaces,
    members,
}: {
    filters: Filters;
    projects: Project[];
    workspaces: Workspace[];
    members: User[];
}) {
    const [searchInput, setSearchInput] = useState(filters.search ?? '');
    const debouncedSearch = useDebounce(searchInput, 300);

    const applyFilters = useCallback(
        (updates: Partial<Filters>) => {
            const params: Record<string, string> = {
                ...filters,
                ...updates,
            };
            Object.keys(params).forEach((key) => {
                const k = key as keyof Filters;
                if (params[k] === '' || params[k] === undefined) {
                    delete params[k];
                }
            });
            router.get(dashboard.url(), params, { preserveState: true });
        },
        [filters],
    );

    useEffect(() => {
        if (debouncedSearch === (filters.search ?? '')) {
            return;
        }
        applyFilters({ search: debouncedSearch || undefined });
    }, [debouncedSearch, filters.search, applyFilters]);

    const statusExcludeDone = filters.status_exclude === 'done';

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[180px] flex-1">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Cari task..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-8"
                />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                    checked={statusExcludeDone}
                    onCheckedChange={(checked) => {
                        if (checked) {
                            applyFilters({
                                status_exclude: 'done',
                                status: undefined,
                            });
                        } else {
                            applyFilters({ status_exclude: undefined });
                        }
                    }}
                />
                <span>Belum selesai</span>
            </label>
            <select
                value={filters.status ?? ''}
                onChange={(e) =>
                    applyFilters({
                        status: e.target.value || undefined,
                        status_exclude: statusExcludeDone ? undefined : filters.status_exclude,
                    })
                }
                disabled={statusExcludeDone}
                className="flex h-9 rounded-md border border-input bg-transparent px-2 text-sm"
            >
                {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value || 'all'} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <select
                value={filters.workspace_id ?? ''}
                onChange={(e) =>
                    applyFilters({ workspace_id: e.target.value || undefined })
                }
                className="flex h-9 rounded-md border border-input bg-transparent px-2 text-sm"
            >
                <option value="">Semua workspace</option>
                {workspaces.map((w) => (
                    <option key={w.id} value={w.id}>
                        {w.name}
                    </option>
                ))}
            </select>
            <select
                value={filters.project_id ?? ''}
                onChange={(e) =>
                    applyFilters({ project_id: e.target.value || undefined })
                }
                className="flex h-9 rounded-md border border-input bg-transparent px-2 text-sm"
            >
                <option value="">Semua project</option>
                {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.name}
                    </option>
                ))}
            </select>
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
            <Input
                type="date"
                placeholder="Dari"
                value={filters.due_from ?? ''}
                onChange={(e) => applyFilters({ due_from: e.target.value || undefined })}
                className="h-9 w-[130px]"
            />
            <Input
                type="date"
                placeholder="Sampai"
                value={filters.due_to ?? ''}
                onChange={(e) => applyFilters({ due_to: e.target.value || undefined })}
                className="h-9 w-[130px]"
            />
        </div>
    );
}
