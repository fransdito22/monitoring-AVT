import { Group, Calendar, Dumbbell, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardSummary = {
    totalPatients: number;
    activePatients: number;
    inTherapyPatients: number;
    progressRate: number;
    lessonPlansTotal: number;
    lessonPlansToday: number;
    reportsTotal: number;
    reportsToday: number;
};

export function StatisticCards({ summary }: { summary?: DashboardSummary }) {
    const s = summary;

    const stats = [
        {
            title: "Total Pasien",
            value: s?.totalPatients ?? 0,
            icon: Group,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            description: "Total pasien terdaftar",
        },
        {
            title: "Pasien Aktif",
            value: s?.activePatients ?? 0,
            icon: Calendar,
            color: "text-cyan-500",
            bg: "bg-cyan-500/10",
            description: "Sedang aktif dalam program terapi",
        },
        {
            title: "Dalam Terapi",
            value: s?.inTherapyPatients ?? 0,
            icon: Dumbbell,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
            description: "Pasien yang sedang menjalani terapi",
        },
        {
            title: "Progress Rata-rata",
            value: s ? `${s.progressRate}%` : "0%",
            icon: TrendingUp,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            description: "Rata-rata perkembangan pasien",
        },
    ] as const;

    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card
                        key={stat.title}
                        className="rounded-xl border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div
                                    className={cn(
                                        "rounded-xl p-3",
                                        stat.bg,
                                        "border border-white/10"
                                    )}
                                >
                                    <Icon
                                        className={cn("h-5 w-5", stat.color)}
                                    />
                                </div>
                            </div>

                            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                {stat.title}
                            </p>

                            <div className="mt-2 flex items-baseline gap-3">
                                <h3 className="text-3xl font-bold leading-none">
                                    {stat.value}
                                </h3>
                            </div>

                            <p className="mt-2 text-sm text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
