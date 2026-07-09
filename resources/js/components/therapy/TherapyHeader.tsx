import { ArrowLeft } from "lucide-react";

export function TherapyHeader({
    title,
    subtitle,
}: {
    title: string;
    subtitle?: string;
}) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-3">
                
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        {title}
                    </h2>
                    {subtitle ? (
                        <p className="mt-1 text-sm text-slate-600 ">
                            {subtitle}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
