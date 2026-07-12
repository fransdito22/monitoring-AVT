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
        <AuthenticatedLayout>
            <Head title="Progress Terapi" />

            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Progress Terapi Anak</h1>
                    <p className="text-muted-foreground">
                        Monitoring perkembangan terapi verbal auditori pasien
                        AVT
                    </p>
                </div>

                <ReportSummary summary={summary} />

                <ReportFilter reports={reports} />

                <ReportList reports={reports} />

                <ReportDetailDialog reports={reports} />
            </div>
        </AuthenticatedLayout>
    );
}
