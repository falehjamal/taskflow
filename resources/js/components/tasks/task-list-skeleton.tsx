import { Skeleton } from '@/components/ui/skeleton';

export function TaskListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <ul className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <li
                    key={i}
                    className="flex items-center gap-3 rounded-lg border p-3"
                >
                    <Skeleton className="h-4 w-4 shrink-0 rounded" />
                    <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-12 rounded" />
                            <Skeleton className="h-5 w-14 rounded" />
                            <Skeleton className="h-5 w-16 rounded" />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
