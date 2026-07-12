import { ReactNode, useMemo } from "react";

type Props = {
    fieldKey: string;
    clientErrors: Record<string, string>;
    label: ReactNode;
    children: ReactNode;
    /**
     * Optional: hint untuk section indicator / mapping toast location.
     */
    sectionKey?: string;
};

export function FormField({ fieldKey, clientErrors, label, children }: Props) {
    const error = clientErrors[fieldKey];
    const hasError = Boolean(error);

    // We expect inner inputs to accept these props.
    // For compatibility with existing shadcn components, children can be a React element
    // and we will clone via runtime check in each section; for now we just render wrapper.
    return (
        <div className="space-y-2">
            {label}

            <div
                className={
                    hasError ? "rounded-md ring-1 ring-red-500" : undefined
                }
            >
                {children}
            </div>

            {hasError && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}

/**
 * Utility to apply `data-field` + red border to a form control element.
 * Usage (in section components): wrap Input/Textarea and pass className merging.
 */
export function withFieldUxProps<T extends HTMLElement>(
    fieldKey: string,
    clientErrors: Record<string, string>,
    baseProps: { className?: string }
): { "data-field": string; className: string } {
    const error = clientErrors[fieldKey];
    const hasError = Boolean(error);

    const className = useMemo(() => {
        const base = baseProps.className ?? "";
        // Add a border-red even if component uses border-gray by default.
        return hasError
            ? `${base} border-red-500 focus-visible:ring-red-500`
            : base;
    }, [baseProps.className, hasError]);

    return {
        "data-field": fieldKey,
        className,
    };
}
