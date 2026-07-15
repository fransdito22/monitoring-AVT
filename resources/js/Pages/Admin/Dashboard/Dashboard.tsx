import DashboardHeader from "./components/DashboardHeader";
import DashboardContent from "./components/DashboardContent";

import type { DashboardProps } from "@/types/dashboard";
import AuthenticatedLayout from "@/Layouts/AppLayout";

export default function Dashboard(props: DashboardProps) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Dashboard</h2>
                        <p className="text-sm text-muted-foreground">
                            Ringkasan statistik dan aktivitas terbaru sistem
                            Monitoring AVT.
                        </p>
                    </div>
                </div>
            }
        >
            <div className="space-y-8">
                <DashboardContent {...props} />
            </div>
        </AuthenticatedLayout>
    );
}
