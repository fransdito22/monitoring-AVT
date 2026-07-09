import { ReactNode } from "react";

export interface DataTableColumn<T> {
    key: keyof T | string;
    title: string;

    headerClassName?: string;
    cellClassName?: string;

    render?: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];

    rowKey: keyof T | ((row: T) => string | number);

    emptyTitle?: string;
    emptyDescription?: string;

    className?: string;
}