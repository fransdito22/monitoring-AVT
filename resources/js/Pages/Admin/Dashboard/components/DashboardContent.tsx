import DashboardSummary from "@/components/dashboard/DashboardSummary";
import RecentActivityTimeline from "@/components/dashboard/RecentActivityTimeline";
import SectionCard from "@/components/dashboard/SectionCard";
import DataTable from "@/components/dataTable/DataTable";

import type {
    DashboardProps,
    RecentAccount,
    RecentChild,
} from "@/types/dashboard";

import type { DataTableColumn } from "@/types/table";

const childColumns: DataTableColumn<RecentChild>[] = [
    {
        key: "name",
        title: "Nama Anak",
    },
    {
        key: "parent_name",
        title: "Orang Tua",
    },
    {
        key: "therapist_name",
        title: "Praktisi",
    },
    {
        key: "created_at",
        title: "Tanggal",
        render: (row) => new Date(row.created_at).toLocaleDateString("id-ID"),
    },
];

const accountColumns: DataTableColumn<RecentAccount>[] = [
    {
        key: "name",
        title: "Nama",
    },
    {
        key: "email",
        title: "Email",
    },
    {
        key: "role",
        title: "Role",
    },
    {
        key: "created_at",
        title: "Tanggal",
        render: (row) => new Date(row.created_at).toLocaleDateString("id-ID"),
    },
];

interface DashboardContentProps extends DashboardProps {}

export default function DashboardContent({
    summary,
    recentRegisteredChildren,
    recentlyCreatedAccounts,
    recentActivities,
}: DashboardContentProps) {
    return (
        <div className="space-y-6">
            <DashboardSummary summary={summary} />

            <div className="grid gap-6 xl:grid-cols-2">
                <SectionCard
                    title="Anak Terbaru"
                    description="5 anak yang terakhir didaftarkan."
                >
                    <DataTable<RecentChild>
                        rowKey="id"
                        columns={childColumns}
                        data={recentRegisteredChildren}
                        emptyTitle="Belum ada data anak"
                        emptyDescription="Data anak yang baru didaftarkan akan muncul di sini."
                    />
                </SectionCard>

                <SectionCard
                    title="Akun Terbaru"
                    description="5 akun terakhir yang dibuat."
                >
                    <DataTable<RecentAccount>
                        rowKey="id"
                        columns={accountColumns}
                        data={recentlyCreatedAccounts}
                        emptyTitle="Belum ada akun"
                        emptyDescription="Belum ada akun yang dibuat."
                    />
                </SectionCard>
            </div>

            <SectionCard
                title="Aktivitas Terbaru"
                description="Aktivitas terbaru dalam sistem."
            >
                <RecentActivityTimeline activities={recentActivities} />
            </SectionCard>
        </div>
    );
}
