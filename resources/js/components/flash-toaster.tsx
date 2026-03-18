import { Toaster } from 'sonner';
import { useFlashToast } from '@/hooks/use-flash-toast';

/**
 * Renders Toaster and listens for flash messages to show toast.
 * Must be rendered inside Inertia context (usePage available).
 */
export function FlashToaster() {
    useFlashToast();

    return (
        <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
                duration: 3000,
            }}
        />
    );
}
