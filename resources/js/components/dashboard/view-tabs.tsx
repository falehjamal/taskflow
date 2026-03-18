import { cn } from '@/lib/utils';

export type ViewMode =
    | 'table'
    | 'by_project'
    | 'board'
    | 'timeline'
    | 'by_assignee';

const VIEW_TABS: { id: ViewMode; label: string }[] = [
    { id: 'table', label: 'All' },
    { id: 'by_project', label: 'By project' },
    { id: 'board', label: 'Board' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'by_assignee', label: 'By assignee' },
];

export function ViewTabs({
    value,
    onChange,
}: {
    value: ViewMode;
    onChange: (mode: ViewMode) => void;
}) {
    return (
        <div className="flex rounded-md border border-input">
            {VIEW_TABS.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        'px-3 py-1.5 text-sm transition-colors first:rounded-l-md last:rounded-r-md',
                        value === tab.id
                            ? 'bg-muted font-medium'
                            : 'hover:bg-muted/50',
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
