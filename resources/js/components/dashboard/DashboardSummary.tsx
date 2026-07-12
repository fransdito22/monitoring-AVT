import SummaryCard from "./SummaryCard";
import type { DashboardSummary as DashboardSummaryType } from "@/types/dashboard";

import {
    Users,
    UserRound,
    Stethoscope,
    ShieldCheck,
} from "lucide-react";

interface DashboardSummaryProps {
    summary: DashboardSummaryType;
}

export default function DashboardSummary({
    summary,
}: DashboardSummaryProps) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
                title="Total Anak"
                value={summary.totalChildren}
                icon={<Users className="h-6 w-6" />}
                iconBgClass="bg-blue-100"
                iconTextClass="text-blue-600"
            />

            <SummaryCard
                title="Total Orang Tua"
                value={summary.totalParents}
                icon={<UserRound className="h-6 w-6" />}
                iconBgClass="bg-green-100"
                iconTextClass="text-green-600"
            />

            <SummaryCard
                title="Total Praktisi"
                value={summary.totalTherapists}
                icon={<Stethoscope className="h-6 w-6" />}
                iconBgClass="bg-purple-100"
                iconTextClass="text-purple-600"
            />

            <SummaryCard
                title="Total Akun"
                value={summary.totalUserAccounts}
                icon={<ShieldCheck className="h-6 w-6" />}
                iconBgClass="bg-orange-100"
                iconTextClass="text-orange-600"
            />
        </div>
    );
}