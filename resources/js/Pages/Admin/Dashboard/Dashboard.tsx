import AppLayout from "@/Layouts/AppLayout";
import DashboardHeader from "./components/DashboardHeader";
import DashboardContent from "./components/DashboardContent";

import type { DashboardProps } from "@/types/dashboard";

export default function Dashboard(props: DashboardProps) {
    return (
        <AppLayout>
            <div className="space-y-8">
                <DashboardHeader />

                <DashboardContent {...props} />
            </div>
        </AppLayout>
    );
}