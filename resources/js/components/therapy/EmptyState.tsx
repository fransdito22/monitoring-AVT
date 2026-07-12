import { Card, CardContent } from "@/components/ui/card";

import { FileSearch } from "lucide-react";

export function EmptyState({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <Card className="rounded-2xl border-slate-200 bg-slate-50 shadow-sm">
            <CardContent className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                    <FileSearch className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                    {title}
                </h3>
                {description ? (
                    <p className="mt-2 text-sm text-slate-600">{description}</p>
                ) : null}
            </CardContent>
        </Card>
    );
}
