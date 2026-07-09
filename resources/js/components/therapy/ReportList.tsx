import { ReportCard } from "@/components/therapy/ReportCard";

import type { TherapyArticulationReport } from "@/types/therapy";

export function ReportList({
    reports,
}: {
    reports: TherapyArticulationReport[];
}) {
    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {reports.map((r) => (
                <ReportCard key={r.id} report={r} />
            ))}
        </div>
    );
}
