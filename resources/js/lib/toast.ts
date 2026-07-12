import { toast } from "sonner";

const DEFAULT_DURATION_MS = 3500;

export function success(message: string) {
    toast.success(message);
}

export function error(message: string) {
    toast.error(message);
}

export function warning(message: string) {
    toast.warning(message);
}

export function info(message: string) {
    toast.info(message);
}

export function promise<T>(
    p: Promise<T>,
    messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: unknown) => string);
    },
) {
    return toast.promise(p, {
        loading: messages.loading,
        success:
            typeof messages.success === "function"
                ? messages.success
                : messages.success,
        error:
            typeof messages.error === "function"
                ? messages.error
                : messages.error,
    });
}

// Re-export duration constant for centralized usage (optional)
export const toastConfig = {
    duration: DEFAULT_DURATION_MS,
} as const;
