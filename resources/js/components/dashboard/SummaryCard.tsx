import { ReactNode } from "react";

interface SummaryCardProps {
    title: string;
    value: number | string;
    icon: ReactNode;
    iconBgClass?: string;
    iconTextClass?: string;
}

export default function SummaryCard({
    title,
    value,
    icon,
    iconBgClass = "bg-blue-100",
    iconTextClass = "text-blue-600",
}: SummaryCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        {value}
                    </h2>
                </div>

                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBgClass}`}
                >
                    <div className={iconTextClass}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
}