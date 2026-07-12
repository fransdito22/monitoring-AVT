import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AppLayout";

import { StatisticCards } from "./StatisticCards";
import { NextLessonPlanCard } from "./NextLessonPlanCard";
import { CalendarCard } from "./CalendarCard";
import { PatientProgressCard } from "./PatientProgressCard";
import { RecentActivityCard } from "./RecentActivityCard";
import { RecentPatientsCard } from "./RecentPatientsCard";

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

type UpcomingItem = {
    id: number;
    name: string;
    photo?: string | null;
    status: string;
    progress: number;
    eta: string;
    parent_name?: string | null;
};

export default function Dashboard() {
    const { props } = usePage();

    const user = (props as any)?.auth?.user;
    const greetingName = user?.name ?? "";

    type NextLessonPlanPayload = {
        lesson_plan_pending: boolean;
        schedule: {
            id: number;
            date: string;
            time: string;
            status: string;
            notes?: string | null;
            patient: { id: number; name: string; photo?: string | null } | null;
        };
        lessonPlan: {
            id: number;
            patient_id: number;
            schedule_id: number;
            therapist_id: number;
            session_date: string;
            session_number: number;
            long_term_goal: string | null;
            short_term_goal: string | null;
            home_program: unknown;
            therapist_note?: string | null;
            status: string;
        } | null;
    };

    const typedProps = props as unknown as {
        summary?: DashboardSummary;
        upcoming?: UpcomingItem[];
        nextLessonPlan?: NextLessonPlanPayload | null;
    };

    const summary: DashboardSummary | undefined = typedProps.summary;
    const upcoming: UpcomingItem[] = typedProps.upcoming ?? [];
    const nextLessonPlan = typedProps.nextLessonPlan ?? null;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Dashboard</h2>
                        <p className="text-sm text-muted-foreground">
                            Ringkasan pasien & sesi hari ini
                        </p>
                    </div>
                </div>
            }
        >
            <main className="p-6 lg:p-8">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold tracking-tight">
                        {(() => {
                            const hour = new Date().getHours();
                            if (hour < 11)
                                return `Selamat Pagi, ${greetingName}.`;
                            if (hour < 15)
                                return `Selamat Siang, ${greetingName}.`;
                            if (hour < 18)
                                return `Selamat Sore, ${greetingName}.`;
                            return `Selamat Malam, ${greetingName}.`;
                        })()}
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Lihat progres pasien dan ringkasan hari ini.
                    </p>
                </div>

                {/* Statistic Cards (4) */}
                <section className="mb-6">
                    <StatisticCards summary={summary} />
                </section>

                {/* 12-column responsive layout */}
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Row 2 */}
                    <div className="lg:col-span-8">
                        <NextLessonPlanCard nextItem={nextLessonPlan} />
                    </div>
                    <div className="lg:col-span-4">
                        <CalendarCard />
                    </div>

                    {/* Row 3 */}
                    <div className="lg:col-span-8">
                        <PatientProgressCard summary={summary} />
                    </div>
                    <div className="lg:col-span-4">
                        <RecentActivityCard />
                    </div>

                    {/* Row 4 */}
                    <div className="lg:col-span-12">
                        <RecentPatientsCard patients={upcoming} />
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
