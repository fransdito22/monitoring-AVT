import * as React from "react";

// Minimal ToggleGroup implementation to satisfy existing usage.
// This does not aim to replicate full shadcn behavior.

type ToggleGroupType = "single" | "multiple";

export function ToggleGroup({
    className,
}: {
    type?: ToggleGroupType;
    value?: string;
    onValueChange?: (value: string | null) => void;
    className?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}) {
    return <div className={className} role="group" />;
}

export function ToggleGroupItem({
    value,
    className,
    children,
}: {
    value: string;
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <button type="button" className={className} data-value={value}>
            {children}
        </button>
    );
}
