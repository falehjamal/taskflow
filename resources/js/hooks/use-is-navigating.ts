import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/**
 * Returns true while an Inertia visit is in progress.
 */
export function useIsNavigating(): boolean {
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        const unsubStart = router.on('start', () => setIsNavigating(true));
        const unsubFinish = router.on('finish', () => setIsNavigating(false));

        return () => {
            unsubStart();
            unsubFinish();
        };
    }, []);

    return isNavigating;
}
