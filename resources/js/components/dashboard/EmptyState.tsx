import { ReactNode } from "react";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: ReactNode;
}

export default function EmptyState({
    title = "Tidak ada data",
    description = "Belum ada data yang dapat ditampilkan.",
    icon,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            {icon && (
                <div className="mb-4 text-gray-400">
                    {icon}
                </div>
            )}

            <h3 className="text-lg font-semibold text-gray-900">
                {title}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
                {description}
            </p>
        </div>
    );
}