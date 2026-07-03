import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import {
    Activity,
    Bell,
    CalendarDays,
    CheckCircle2,
    CheckSquare,
    ClipboardList,
    Clock3,
    Goal,
    LineChart as LineChartIcon,
    Sparkles,
    Stethoscope,
    Target,
    UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type UpcomingSchedule = {
    id: string;
    date: string;
    time: string;
    therapist: string;
    title: string;
    status: "Scheduled" | "Confirmed" | "Pending";
};

type TherapyActivity = {
    id: string;
    title: string;
    date: string;
    note: string;
    therapist: string;
    result: "Good" | "Needs Practice" | "Excellent";
};

type ChildProfile = {
    id: string;
    name: string;
    age: number | null;
    gender: string | null;
    therapyStatus: "Active" | "Completed";
    photoUrl: string | null;
} | null;

type TherapyProgress = {
    totalSessions: number;
    completedSessions: number;
    currentProgress: number;
};

type ProgressPoint = {
    label: string;
    progress: number;
};

type CurrentGoal = {
    title: string;
    description: string;
    completion: number;
} | null;

type TherapistNote = {
    id: string;
    message: string;
    date: string;
    therapist: string;
} | null;

type NotificationItem = {
    id: string;
    title: string;
    message: string;
    date: string;
};

type OrangTuaDashboardProps = {
    childProfile: ChildProfile;
    therapyProgress: TherapyProgress;
    progressChart: ProgressPoint[];
    upcomingSchedules: UpcomingSchedule[];
    currentGoal: CurrentGoal;
    therapistNote: TherapistNote;
    homePracticeRecommendations: string[];
    recentActivities: TherapyActivity[];
    notifications: NotificationItem[];
};

function scheduleStatusVariant(status: UpcomingSchedule["status"]) {
    if (status === "Confirmed") return "default";
    if (status === "Scheduled") return "secondary";
    return "outline";
}

function resultVariant(result: TherapyActivity["result"]) {
    if (result === "Excellent") return "default";
    if (result === "Good") return "secondary";
    return "outline";
}

function formatDateYMDToReadable(date: string) {
    // Expects YYYY-MM-DD
    const [y, m, d] = date.split("-").map(Number);
    if (!y || !m || !d) return date;
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function statusColorClass(
    status: ChildProfile extends null ? never : "Active" | "Completed"
) {
    return status === "Completed"
        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
        : "bg-cyan-100 text-cyan-700 border-cyan-200";
}

export default function OrangtuaDashboard({
    childProfile,
    therapyProgress = {
        totalSessions: 0,
        completedSessions: 0,
        currentProgress: 0,
    },
    progressChart = [],
    upcomingSchedules = [],
    currentGoal = null,
    therapistNote = null,
    homePracticeRecommendations = [],
    recentActivities = [],
    notifications = [],
}: Partial<OrangTuaDashboardProps>) {
    const maxPoint = Math.max(...progressChart.map((p) => p.progress), 100);

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
                                    target terapi, dan rekomendasi latihan rumah
                                    dalam satu dashboard.
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
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <UserRound className="h-5 w-5 text-sky-600" />
                                    Child Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!childProfile ? (
                                    <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                                        Data anak belum tersedia.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            {childProfile.photoUrl ? (
                                                <img
                                                    src={childProfile.photoUrl}
                                                    alt={childProfile.name}
                                                    className="h-16 w-16 rounded-full object-cover ring-2 ring-sky-200"
                                                />
                                            ) : (
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                                                    <UserRound className="h-7 w-7" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    {childProfile.name}
                                                </p>
                                                <Badge
                                                    className={`mt-1 border ${statusColorClass(
                                                        childProfile.therapyStatus
                                                    )}`}
                                                    variant="outline"
                                                >
                                                    {childProfile.therapyStatus}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="grid gap-3 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">
                                                    Age
                                                </span>
                                                <span className="font-medium">
                                                    {childProfile.age ?? "-"}{" "}
                                                    years
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">
                                                    Gender
                                                </span>
                                                <span className="font-medium">
                                                    {childProfile.gender ?? "-"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

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
                                    <div className="space-y-4">
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                {currentGoal.title}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {currentGoal.description}
                                            </p>
                                        </div>
                                        <div>
                                            <div className="mb-2 flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Completion
                                                </span>
                                                <span className="font-medium">
                                                    {currentGoal.completion}%
                                                </span>
                                            </div>
                                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-cyan-500"
                                                    style={{
                                                        width: `${currentGoal.completion}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <Stethoscope className="h-5 w-5 text-sky-600" />
                                    Therapist Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!therapistNote ? (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada catatan terapis terbaru.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-sm leading-relaxed text-slate-700">
                                            “{therapistNote.message}”
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {therapistNote.date} •{" "}
                                            {therapistNote.therapist}
                                        </p>
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
                            <CardContent className="space-y-5">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="rounded-xl border bg-slate-50/70 p-4">
                                        <p className="text-xs text-muted-foreground">
                                            Total therapy sessions
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-slate-800">
                                            {therapyProgress.totalSessions}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border bg-slate-50/70 p-4">
                                        <p className="text-xs text-muted-foreground">
                                            Completed sessions
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-slate-800">
                                            {therapyProgress.completedSessions}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border bg-slate-50/70 p-4">
                                        <p className="text-xs text-muted-foreground">
                                            Current progress
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-slate-800">
                                            {therapyProgress.currentProgress}%
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Progress
                                        </span>
                                        <span className="font-medium">
                                            {therapyProgress.currentProgress}%
                                        </span>
                                    </div>
                                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                            style={{
                                                width: `${therapyProgress.currentProgress}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <LineChartIcon className="h-5 w-5 text-sky-600" />
                                    Progress Chart
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {progressChart.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Data grafik progres belum tersedia.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex h-44 items-end gap-2 rounded-xl border bg-slate-50/60 p-4">
                                            {progressChart.map((point) => (
                                                <div
                                                    key={point.label}
                                                    className="flex flex-1 flex-col items-center gap-2"
                                                >
                                                    <div className="relative flex h-28 w-full items-end justify-center">
                                                        <div className="w-full max-w-10 rounded-t-md bg-cyan-500/25">
                                                            <div
                                                                className="w-full rounded-t-md bg-cyan-500"
                                                                style={{
                                                                    height: `${Math.max(
                                                                        (point.progress /
                                                                            maxPoint) *
                                                                            110,
                                                                        8
                                                                    )}px`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground">
                                                        {point.label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Tren progress mingguan terapi anak.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <CalendarDays className="h-5 w-5 text-cyan-600" />
                                    Upcoming Therapy Schedule
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {upcomingSchedules.length === 0 ? (
                                    <div className="rounded-xl border border-dashed bg-slate-50 p-8 text-center">
                                        <CalendarDays className="mx-auto h-8 w-8 text-slate-400" />
                                        <p className="mt-3 text-sm font-medium text-slate-700">
                                            Tidak ada jadwal terapi mendatang
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Jadwal baru akan muncul di sini
                                            setelah terapis menambahkan sesi.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {upcomingSchedules.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
                                            >
                                                <div className="space-y-1">
                                                    <p className="font-semibold text-slate-800">
                                                        {item.title}
                                                    </p>
                                                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <CalendarDays className="h-4 w-4" />
                                                        {item.date}
                                                    </p>
                                                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Clock3 className="h-4 w-4" />
                                                        {item.time}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Therapist:{" "}
                                                        {item.therapist}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={scheduleStatusVariant(
                                                        item.status
                                                    )}
                                                >
                                                    {item.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <Card className="rounded-2xl shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <CheckSquare className="h-5 w-5 text-cyan-600" />
                                        Home Practice Recommendation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {homePracticeRecommendations.length ===
                                    0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            Belum ada rekomendasi latihan rumah.
                                        </p>
                                    ) : (
                                        <ul className="space-y-3 text-sm">
                                            {homePracticeRecommendations.map(
                                                (item, index) => (
                                                    <li
                                                        key={`${item}-${index}`}
                                                        className="flex items-start gap-2 rounded-lg border p-3"
                                                    >
                                                        <Target className="mt-0.5 h-4 w-4 text-cyan-600" />
                                                        <span className="text-slate-700">
                                                            {item}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="rounded-2xl shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Bell className="h-5 w-5 text-sky-600" />
                                        Notifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {notifications.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            Tidak ada notifikasi terbaru.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {notifications.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="rounded-xl border p-3"
                                                >
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        {item.message}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {item.date}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <ClipboardList className="h-5 w-5 text-cyan-600" />
                                    Recent Therapy History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentActivities.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Riwayat terapi terbaru belum tersedia.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {recentActivities.map((activity) => (
                                            <div
                                                key={activity.id}
                                                className="rounded-xl border p-4"
                                            >
                                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-slate-800">
                                                            {activity.title}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {activity.date} •{" "}
                                                            {activity.therapist}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {activity.note}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant={resultVariant(
                                                                activity.result
                                                            )}
                                                        >
                                                            {activity.result}
                                                        </Badge>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            View Detail
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
