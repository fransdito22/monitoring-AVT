import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import ReportSummary from "./components/ReportSummary";
import ReportFilter from "./components/ReportFilter";
import ReportList from "./components/ReportList";
import ReportDetailDialog from "./components/ReportDetailDialog";

type Props = {
    reports: any[];
    summary: any;
};

export default function ProgressReportsIndex({ reports, summary }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Progres Terapi</h2>
                        <p className="text-sm text-muted-foreground">
                            Progres perkembangan terapi.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Progress Terapi" />

            <div className="p-6 space-y-6">
                <ReportSummary summary={summary} />

                <ReportFilter reports={reports} />

                <ReportList reports={reports} />

                <ReportDetailDialog reports={reports} />
            </div>
        </AuthenticatedLayout>
    );
}
