"use client";

import * as React from "react";

type CollapsibleProps = {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    children?: React.ReactNode;
};

type CollapsibleContextValue = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(
    null
);

export function Collapsible({
    defaultOpen = false,
    open: openProp,
    onOpenChange,
    className,
    children,
}: CollapsibleProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const open = openProp ?? uncontrolledOpen;

    const setOpen = React.useCallback(
        (next: boolean) => {
            if (onOpenChange) onOpenChange(next);
            else setUncontrolledOpen(next);
        },
        [onOpenChange]
    );

    const value = React.useMemo(() => ({ open, setOpen }), [open, setOpen]);

    return (
        <CollapsibleContext.Provider value={value}>
            <div data-state={open ? "open" : "closed"} className={className}>
                {children}
            </div>
        </CollapsibleContext.Provider>
    );
}

export function CollapsibleTrigger({
    asChild,
    children,
    ...rest
}: React.ComponentPropsWithoutRef<"button"> & {
    asChild?: boolean;
    children: React.ReactNode;
}) {
    const ctx = React.useContext(CollapsibleContext);
    if (!ctx)
        throw new Error("CollapsibleTrigger must be used within Collapsible");

    const child = React.Children.only(children) as React.ReactElement;

    const props = {
        ...rest,
        type: "button" as const,
        onClick: (e: any) => {
            rest.onClick?.(e);
            ctx.setOpen(!ctx.open);
        },
        "data-state": ctx.open ? "open" : "closed",
    };

    if (asChild) {
        return React.cloneElement(child, {
            ...child.props,
            ...props,
            className: [child.props.className, props.className]
                .filter(Boolean)
                .join(" "),
        });
    }

    return <button {...props}>{children}</button>;
}

export function CollapsibleContent({
    children,
    ...rest
}: React.ComponentPropsWithoutRef<"div">) {
    const ctx = React.useContext(CollapsibleContext);
    if (!ctx)
        throw new Error("CollapsibleContent must be used within Collapsible");

    if (!ctx.open) return <div hidden {...rest} />;
    return (
        <div data-state={ctx.open ? "open" : "closed"} {...rest}>
            {children}
        </div>
    );
}
