import { toast } from "sonner";

export function toastSuccess(title: string, message?: string) {
    toast.success(message ? `${title}: ${message}` : title);
}

export function toastError(title: string, message?: string) {
    toast.error(message ? `${title}: ${message}` : title);
}

export function toastInfo(title: string, message?: string) {
    toast(message ? `${title}: ${message}` : title);
}

