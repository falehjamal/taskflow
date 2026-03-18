import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

type Flash = {
    success?: string | null;
    error?: string | null;
    info?: string | null;
};

/**
 * Listens to Inertia flash messages and shows toast notifications.
 * Call this in a component that is always mounted (e.g. app root wrapper).
 */
export function useFlashToast(): void {
    const { flash } = usePage<{ flash?: Flash }>().props;
    const prevFlashRef = useRef<Flash | undefined>(undefined);

    useEffect(() => {
        const f = flash ?? {};
        const prev = prevFlashRef.current ?? {};

        if (f.success && f.success !== prev.success) {
            toast.success(f.success);
        }
        if (f.error && f.error !== prev.error) {
            toast.error(f.error);
        }
        if (f.info && f.info !== prev.info) {
            toast.info(f.info);
        }

        prevFlashRef.current = f;
    }, [flash?.success, flash?.error, flash?.info]);
}
