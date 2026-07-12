import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
    ClipboardList,
    Goal,
    Sparkles,
    Target,
    CheckCircle2,
    Stethoscope,
} from "lucide-react";

import type {
    HomeProgram,
    TherapyChartPoint,
    TherapyInsights,
    TherapyLessonPlan,
    TherapyStatistics,
} from "@/types/therapy";
import { PatientSummaryCard } from "@/components/therapy/PatientSummaryCard";
import { StatisticCards } from "@/components/therapy/StatisticCards";
import { ProgressChart } from "@/components/therapy/ProgressChart";
import { ProgressSummary } from "@/components/therapy/ProgressSummary";
import LingSixSoundChart from "@/components/therapy/LingSixSoundChart";
import LessonPlanCard from "@/components/therapy/LessonPlanCard";

type NextSchedulePayload = {
    id: string;
    date: string | null;
    time: string | null;
    therapist: string | null;
    lokasi: string | null;
};

type OrangTuaDashboardProps = {
    childProfile: {
        id: string;
        name: string;
        gender: string | null;
        therapyStatus: string;
        photoUrl: string | null;
        age?: number | null;
    } | null;
    statistics: TherapyStatistics | null;
    currentGoal: {
        title: string;
        description: string;
        completion: number | null;
        long_term_goal: string | null;
        short_term_goal: string | null;
    } | null;
    nextSchedule: NextSchedulePayload | null;
    recentLessons: TherapyLessonPlan[];
    progressChart: TherapyChartPoint[];
    lingSixSounds: TherapyLessonPlan[];
    homePrograms: HomeProgram[];
};

export default function OrangtuaDashboard(props: OrangTuaDashboardProps) {
    const {
        childProfile,
        statistics,
        currentGoal,
        nextSchedule,
        recentLessons,
        progressChart,
        lingSixSounds,
        homePrograms,
    } = props;

    const chartData = progressChart ?? [];

    const insights: TherapyInsights = (() => {
        if (!chartData.length) {
            return {
                scoreAwal: null,
                scoreTerbaru: null,
                selisih: null,
                trend: "stabil",
            };
        }

        const first = chartData[0]?.progress ?? 0;
        const last = chartData[chartData.length - 1]?.progress ?? 0;

        const selisih = Math.round(last - first);
        const trend = selisih > 0 ? "naik" : selisih < 0 ? "turun" : "stabil";

        return {
            scoreAwal: first,
            scoreTerbaru: last,
            selisih,
            trend,
        };
    })();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Dashboard Orang Tua
                </h2>
            }
        >
            <Head title="Dashboard Orang Tua" />

            <div className="space-y-6">
                <Card className="border-0 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-xl">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div className="max-w-3xl">
                                <p className="text-sm/6 text-cyan-100">
                                    Welcome back
                                </p>
                                <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                                    Monitor your child’s AVT progress with
                                    confidence
                                </h1>
                                <p className="mt-2 text-sm text-cyan-100 md:text-base">
                                    Pantau perkembangan terapi, jadwal sesi,
                                    target terapi, dan latihan rumah dalam satu
                                    dashboard.
                                </p>
                            </div>
                            <div className="hidden rounded-2xl bg-white/20 p-3 md:block">
                                <Sparkles className="h-7 w-7" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-4">
                        {childProfile ? (
                            <PatientSummaryCard
                                patient={{
                                    id: Number(childProfile.id) || 0,
                                    name: childProfile.name,
                                    photo: childProfile.photoUrl,
                                    status: childProfile.therapyStatus,
                                    progress: statistics?.progressPercent ?? 0,
                                    birth_date: null,
                                    age: childProfile.age ?? null,
                                    gender: childProfile.gender ?? null,
                                    parent: { id: null, name: null },
                                    therapist: { id: null, name: null },
                                    created_at: null,
                                    updated_at: null,
                                }}
                                progressPercent={
                                    statistics?.progressPercent ?? 0
                                }
                            />
                        ) : (
                            <Card className="rounded-2xl shadow-sm">
                                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                                    Data anak belum tersedia.
                                </CardContent>
                            </Card>
                        )}

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <Goal className="h-5 w-5 text-cyan-600" />
                                    Current Therapy Goal
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!currentGoal ? (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada target terapi aktif.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="font-semibold text-slate-800">
                                            {currentGoal.title}
                                        </p>
                                        {currentGoal.description ? (
                                            <p className="text-sm text-muted-foreground">
                                                {currentGoal.description}
                                            </p>
                                        ) : null}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <Stethoscope className="h-5 w-5 text-sky-600" />
                                    Next Therapy Schedule
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!nextSchedule ? (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada jadwal terapi berikutnya.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="rounded-xl border p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="font-semibold text-slate-800">
                                                    {nextSchedule.date ?? "-"}
                                                </p>
                                                <Badge
                                                    variant="secondary"
                                                    className="rounded-full"
                                                >
                                                    Scheduled
                                                </Badge>
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Jam: {nextSchedule.time ?? "-"}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Terapis:{" "}
                                                {nextSchedule.therapist ?? "-"}
                                            </p>
                                            {nextSchedule.lokasi ? (
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Lokasi:{" "}
                                                    {nextSchedule.lokasi}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6 xl:col-span-8">
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                                    Therapy Progress Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {statistics ? (
                                    <>
                                        <StatisticCards
                                            statistics={statistics}
                                        />
                                        <div className="mt-6">
                                            <ProgressSummary
                                                insights={insights}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Statistik belum tersedia.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <ProgressChart chartData={chartData} />

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <Sparkles className="h-5 w-5 text-cyan-600" />
                                    Ling Six Sound Chart
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LingSixSoundChart
                                    lessonPlans={lingSixSounds ?? []}
                                />
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <Target className="h-5 w-5 text-cyan-600" />
                                    Home Program
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {homePrograms?.length ? (
                                    <ul className="space-y-3 text-sm">
                                        {homePrograms.map((item, idx) => (
                                            <li
                                                key={`${item.title}-${idx}`}
                                                className="rounded-xl border p-3"
                                            >
                                                <div className="font-semibold text-slate-800">
                                                    {item.title}
                                                </div>
                                                <div className="mt-1 text-muted-foreground">
                                                    {item.instruction}
                                                </div>
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    Frekuensi: {item.frequency}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada latihan rumah.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <ClipboardList className="h-5 w-5 text-cyan-600" />
                                    Recent Therapy History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentLessons?.length ? (
                                    <div className="space-y-4">
                                        {recentLessons.slice(0, 5).map((lp) => (
                                            <LessonPlanCard
                                                key={lp.id}
                                                lessonPlan={lp}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Riwayat terapi terbaru belum tersedia.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
