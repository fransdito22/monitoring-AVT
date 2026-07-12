import { ReactNode } from "react";

interface SectionCardProps {
    title: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}

export default function SectionCard({
    title,
    description,
    action,
    children,
    className = "",
}: SectionCardProps) {
    return (
        <section
            className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
        >
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-1 text-sm text-gray-500">
                            {description}
                        </p>
                    )}
                </div>

                {action && <div>{action}</div>}
            </div>

            <div className="p-6">
                {children}
            </div>
        </section>
    );
}