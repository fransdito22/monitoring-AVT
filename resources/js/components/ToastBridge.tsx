import { usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { toast, Toaster } from "sonner";

type FlashProps = {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
};

export default function ToastBridge() {
    const page = usePage();
    const flash = (page.props as any)?.flash as FlashProps | undefined;

    const prev = useRef<string | null>(null);

    useEffect(() => {
        const payload =
            flash?.success ?? flash?.error ?? flash?.warning ?? flash?.info;

        if (!payload) return;
        if (prev.current === payload) return;
        prev.current = payload;

        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
        if (flash?.warning) toast.warning(flash.warning);
        if (flash?.info) toast.info(flash.info);
    }, [flash?.success, flash?.error, flash?.warning, flash?.info]);

    return (
        <Toaster richColors closeButton position="top-right" duration={3500} />
    );
}
