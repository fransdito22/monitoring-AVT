// resources/js/pages/dashboard.tsx

import {
    Calendar,
    Dumbbell,
    FolderOpen,
    Group,
    History,
    LayoutDashboard,
    LineChart,
    TrendingUp,
    PlayCircle,
    Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DashboardCalendar } from "@/Components/Calendar";
import { AppSidebar } from "@/Components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AppLayout";

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

    const typedProps = props as unknown as {
        summary?: DashboardSummary;
        upcoming?: UpcomingItem[];
    };

    const summary: DashboardSummary = typedProps.summary ?? {
        totalPatients: 0,
        activePatients: 0,
        inTherapyPatients: 0,
        progressRate: 0,
        lessonPlansTotal: 0,
        lessonPlansToday: 0,
        reportsTotal: 0,
        reportsToday: 0,
    };

    const upcoming: UpcomingItem[] = typedProps.upcoming ?? [];

    const queuePatients = upcoming.map((u) => ({
        id: u.id,
        name: u.name,
        image: u.photo ?? undefined,
        time: u.eta,
        status: u.status,
        progress: u.progress,
    }));

    const activities = [
        {
            time: "Hari ini",
            title: `Progres rata-rata: ${summary.progressRate}%`,
            description: "Berdasarkan nilai progress pasien yang terdaftar.",
            icon: TrendingUp,
        },
        {
            time: "Hari ini",
            title: `Lesson Plan hari ini: ${summary.lessonPlansToday}`,
            description: "Jumlah sesi yang dijadwalkan untuk hari ini.",
            icon: Dumbbell,
        },
        {
            time: "Hari ini",
            title: `Tes Artikulasi hari ini: ${summary.reportsToday}`,
            description: "Jumlah tes yang dilakukan hari ini.",
            icon: Upload,
        },
    ];

    const hero = queuePatients[0];

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
            <main className="p-6 pb-24 lg:p-8">
                {/* Welcome */}
                <div className="mb-8">
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
                        Lihat progres pasien dan aktivitas hari ini.
                    </p>
                </div>

                {/* Stats */}
                <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        {
                            title: "Total Pasien",
                            value: summary.totalPatients,
                            icon: Group,
                            color: "text-blue-500",
                            bg: "bg-blue-500/10",
                        },
                        {
                            title: "Pasien Aktif",
                            value: summary.activePatients,
                            icon: Calendar,
                            color: "text-cyan-500",
                            bg: "bg-cyan-500/10",
                        },
                        {
                            title: "Dalam Terapi",
                            value: summary.inTherapyPatients,
                            icon: Dumbbell,
                            color: "text-violet-500",
                            bg: "bg-violet-500/10",
                        },
                        {
                            title: "Progres Rata-rata",
                            value: `${summary.progressRate}%`,
                            icon: TrendingUp,
                            color: "text-amber-500",
                            bg: "bg-amber-500/10",
                        },
                    ].map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card
                                key={stat.title}
                                className="transition-all hover:-translate-y-1 hover:shadow-lg"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div
                                            className={cn(
                                                "rounded-xl p-3",
                                                stat.bg
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    "h-5 w-5",
                                                    stat.color
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
                                        {stat.title}
                                    </p>

                                    <h3 className="text-3xl font-bold">
                                        {stat.value}
                                    </h3>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Left */}
                    <div className="space-y-8 lg:col-span-8">
                        {/* Hero */}
                        <Card className="overflow-hidden border-0 bg-primary text-primary-foreground">
                            <CardContent className="relative p-8">
                                <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

                                <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                                    <div>
                                        <Badge className="mb-4 bg-white/20 text-white hover:bg-white/20">
                                            NEXT SESSION
                                        </Badge>

                                        <h2 className="text-4xl font-bold">
                                            {hero?.name ?? "Pasien"}
                                        </h2>

                                        <p className="mt-2 text-primary-foreground/80">
                                            Status: {hero?.status ?? "—"}
                                        </p>
                                    </div>

                                    <Button
                                        variant="secondary"
                                        className="rounded-2xl px-8 py-6 text-base font-bold"
                                    >
                                        <PlayCircle className="mr-2 h-5 w-5" />
                                        Mulai Lesson Plan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Queue */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Pasien Terbaru</CardTitle>
                                <Button variant="ghost">View All</Button>
                            </CardHeader>

                            <CardContent className="p-0">
                                {queuePatients.length === 0 ? (
                                    <div className="px-6 py-8 text-sm text-muted-foreground">
                                        Belum ada data pasien terbaru.
                                    </div>
                                ) : (
                                    queuePatients.map((patient, index) => (
                                        <div
                                            key={patient.id}
                                            className={cn(
                                                "flex items-center gap-4 px-6 py-5 transition-colors hover:bg-muted/50",
                                                index !==
                                                    queuePatients.length - 1 &&
                                                    "border-b"
                                            )}
                                        >
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src={patient.image}
                                                />
                                                <AvatarFallback>
                                                    {patient.name?.[0] ?? "?"}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1">
                                                <h4 className="font-semibold">
                                                    {patient.name}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Waktu: {patient.time}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={cn(
                                                        "h-2 w-2 rounded-full",
                                                        patient.progress > 0
                                                            ? "animate-pulse bg-green-500"
                                                            : "bg-muted-foreground"
                                                    )}
                                                />
                                                <span className="text-sm text-muted-foreground">
                                                    {patient.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right */}
                    <div className="space-y-8 lg:col-span-4">
                        <DashboardCalendar />

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-6">
                                    {activities.map((activity) => {
                                        const Icon = activity.icon;
                                        return (
                                            <div
                                                key={activity.title}
                                                className="flex gap-4"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                    <Icon className="h-4 w-4" />
                                                </div>

                                                <div className="flex-1">
                                                    <h4 className="font-semibold">
                                                        {activity.title}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {activity.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t bg-background py-3 md:hidden">
                <button className="flex flex-col items-center gap-1 text-primary">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="text-xs">Overview</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-muted-foreground">
                    <LineChart className="h-5 w-5" />
                    <span className="text-xs">Charts</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-muted-foreground">
                    <History className="h-5 w-5" />
                    <span className="text-xs">History</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-muted-foreground">
                    <FolderOpen className="h-5 w-5" />
                    <span className="text-xs">Files</span>
                </button>
            </nav>
        </AuthenticatedLayout>
    );
}
