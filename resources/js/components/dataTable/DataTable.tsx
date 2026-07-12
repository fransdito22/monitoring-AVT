import EmptyState from "@/components/dashboard/EmptyState";
import type { DataTableProps } from "@/types/table";

export default function DataTable<T extends object>({
    columns,
    data,
    rowKey,
    emptyTitle,
    emptyDescription,
    className = "",
}: DataTableProps<T>) {
    if (data.length === 0) {
        return (
            <EmptyState
                title={emptyTitle}
                description={emptyDescription}
            />
        );
    }

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 ${column.headerClassName ?? ""}`}
                            >
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                    {data.map((row) => {
                        const key =
                            typeof rowKey === "function"
                                ? rowKey(row)
                                : row[rowKey];

                        return (
                            <tr
                                key={String(key)}
                                className="hover:bg-gray-50"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={String(column.key)}
                                        className={`px-4 py-3 text-sm text-gray-700 ${column.cellClassName ?? ""}`}
                                    >
                                        {column.render
                                            ? column.render(row)
                                            : String(
                                                  row[column.key as keyof T] ??
                                                      "-"
                                              )}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}