import { Card, CardContent } from "@/components/ui/card";

import { BookOpen, ClipboardList, Users, TrendingUp } from "lucide-react";

import type { TherapyStatistics } from "@/types/therapy";

import type { ReactNode } from "react";

function StatCard({
    icon,
    label,
    value,
    valueSuffix,
}: {
    icon: ReactNode;
    label: string;
    value: number;
    valueSuffix?: string;
}) {
    return (
        <Card className="rounded-2xl border-slate-200 bg-slate-50 shadow-sm">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-sm text-slate-600">{label}</div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <div className="text-2xl font-semibold text-slate-900">
                                {value}
                                {valueSuffix ?? ""}
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-2 text-slate-700 shadow-sm">
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function StatisticCards({
    statistics,
}: {
    statistics: TherapyStatistics;
}) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                icon={<BookOpen className="h-5 w-5 text-sky-600" />}
                label="Total Lesson Plan"
                value={statistics.totalLessonPlan}
            />
            <StatCard
                icon={<ClipboardList className="h-5 w-5 text-emerald-600" />}
                label="Total Tes Artikulasi"
                value={statistics.totalTesArtikulasi}
            />
            <StatCard
                icon={<Users className="h-5 w-5 text-purple-600" />}
                label="Jumlah Pertemuan"
                value={statistics.totalPertemuan}
            />
            <StatCard
                icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
                label="Progress %"
                value={statistics.progressPercent}
                valueSuffix="%"
            />
        </div>
    );
}
