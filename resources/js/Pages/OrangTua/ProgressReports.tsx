import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { useMemo, useState } from "react";
// NOTE: read-only view + download.

import {
    BadgeCheck,
    Calendar,
    CalendarDays,
    Download,
    FileText,
    FolderArchive,
    Home,
    Search,
    Sparkles,
    Stethoscope,
    Target,
    UserRound,
    Users,
    XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

type ReportPeriod = "month" | "year";
type ReportType = "Monthly" | "Quarterly" | "Final Report";

type TherapyObjectiveKey =
    | "Sound Detection"
    | "Sound Discrimination"
    | "Word Recognition"
    | "Speech Imitation"
    | "Verbal Communication";

type ObjectiveProgress = {
    key: TherapyObjectiveKey;
    progress: number; // 0..100
    status: "Not Started" | "In Progress" | "Completed";
};

type TherapistEvaluation = {
    overallAssessment: string;
    strengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
};

type HomePracticeRecommendation = {
    title: string;
    description: string;
};

type Report = {
    id: string;
    title: string;
    reportingPeriodLabel: string;
    childName: string;
    therapistName: string;
    completedSessions: number;
    progressPercentage: number;
    createdAt: string; // ISO
    status: "Available" | "Draft";

    pdfUrl: string;

    therapySummary: {
        totalScheduledSessions: number;
        completedSessions: number;
        missedSessions: number;
        attendancePercentage: number;
    };

    objectives: ObjectiveProgress[];
    therapistEvaluation: TherapistEvaluation;
    homePracticeRecommendations: HomePracticeRecommendation[];
    conclusion: string;
};

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
}

function formatDate(iso: string) {
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return iso;
    return dt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "2-digit",
    });
}

function badgeVariantForStatus(status: Report["status"]) {
    return status === "Available"
        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
        : "bg-slate-100 text-slate-700 border-slate-200";
}

function statusPillVariant(status: ObjectiveProgress["status"]) {
    switch (status) {
        case "Completed":
            return "bg-emerald-100 text-emerald-700 border-emerald-200";
        case "In Progress":
            return "bg-cyan-100 text-cyan-700 border-cyan-200";
        default:
            return "bg-slate-100 text-slate-700 border-slate-200";
    }
}

function SummaryCard(props: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    description: string;
}) {
    return (
        <Card className="rounded-2xl shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                    {props.icon}
                    {props.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="text-3xl font-bold text-slate-900">{props.value}</div>
                <p className="mt-1 text-sm text-muted-foreground">{props.description}</p>
            </CardContent>
        </Card>
    );
}

function ObjectiveProgressRow(props: { item: ObjectiveProgress }) {
    return (
        <div className="rounded-xl border bg-background p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-semibold text-slate-800">{props.item.key}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {props.item.progress}% progress
                    </p>
                </div>
                <Badge
                    variant="outline"
                    className={`border ${statusPillVariant(props.item.status)}`}
                >
                    {props.item.status}
                </Badge>
            </div>
            <div className="mt-3">
                <Progress value={clamp(props.item.progress, 0, 100)} className="h-2" />
            </div>
        </div>
    );
}

type Props = {
    reports?: Report[];
    summary?: {
        totalReports?: number;
        latestReportDate?: string | null;
        completedSessions?: number;
        overallProgressAvg?: number;
    };
};

export default function ProgressReportsPage({
    reports: reportsProp = [],
    summary: summaryProp,
}: Props) {
    const reports = reportsProp;
    const summary = summaryProp ?? {};

    // Filters: server-driven
    const [period, setPeriod] = useState<ReportPeriod>("month");
    const [reportType, setReportType] = useState<ReportType | "All">("All");
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return reports;
        return reports.filter((r) => r.title.toLowerCase().includes(q));
    }, [reports, search]);

    const [activeReport, setActiveReport] = useState<Report | null>(null);

    const totalReports = reports.length;
    const latestReportDate = reports.map((r) => r.createdAt).sort().at(-1) ?? null;

    const completedSessions = reports.reduce(
        (sum, r) => sum + r.completedSessions,
        0
    );

    const overallProgressAvg =
        reports.length === 0
            ? 0
            : Math.round(
                  reports.reduce((sum, r) => sum + r.progressPercentage, 0) / reports.length
              );

    const applyFilters = (next?: Partial<{ period: ReportPeriod; reportType: ReportType | "All" }>) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const p = next?.period ?? period;
        const rt = next?.reportType ?? reportType;

        router.get(
            route("progress-reports.orangtua") as any,
            {
                periodType: p,
                reportType: rt,
                year: year.toString(),
                month: month.toString(),
            },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold leading-tight">Progress Reports</h2>
                    <p className="text-sm text-muted-foreground">
                        View and download your child's therapy progress reports.
                    </p>
                </div>
            }
        >
            <div className="mx-auto max-w-6xl space-y-6 py-2">
                {/* Summary Cards */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        icon={<FileText className="h-4 w-4 text-cyan-600" />}
                        title="Total Reports"
                        value={totalReports}
                        description="All generated progress documents"
                    />
                    <SummaryCard
                        icon={<CalendarDays className="h-4 w-4 text-sky-600" />}
                        title="Latest Report Date"
                        value={
                            latestReportDate
                                ? formatDate(latestReportDate)
                                : "—"
                        }
                        description="Most recently created report"
                    />
                    <SummaryCard
                        icon={
                            <BadgeCheck className="h-4 w-4 text-emerald-600" />
                        }
                        title="Completed Therapy Sessions"
                        value={completedSessions}
                        description="Total completed sessions across reports"
                    />
                    <SummaryCard
                        icon={<Sparkles className="h-4 w-4 text-indigo-600" />}
                        title="Overall Progress"
                        value={`${overallProgressAvg}%`}
                        description="Average overall progress"
                    />
                </section>

                {/* Filters */}
                <section className="grid gap-3 rounded-2xl border bg-background p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <div className="min-w-[220px] flex-1">
                                <p className="mb-1 text-sm font-medium text-slate-800">
                                    Report Period
                                </p>
                                <Select
                                    value={period}
                                    onValueChange={(v) =>
                                        setPeriod(v as ReportPeriod)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="month">
                                            Month
                                        </SelectItem>
                                        <SelectItem value="year">
                                            Year
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="min-w-[220px] flex-1">
                                <p className="mb-1 text-sm font-medium text-slate-800">
                                    Report Type
                                </p>
                                <Select
                                    value={reportType}
                                    onValueChange={(v) =>
                                        setReportType(v as any)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select report type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="Monthly">
                                            Monthly
                                        </SelectItem>
                                        <SelectItem value="Quarterly">
                                            Quarterly
                                        </SelectItem>
                                        <SelectItem value="Final Report">
                                            Final Report
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="min-w-[240px] flex-1">
                                <p className="mb-1 text-sm font-medium text-slate-800">
                                    Search by report title
                                </p>
                                <div className="relative">
                                    <Input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="e.g., May 2026"
                                        className="pl-9"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setPeriod("month");
                                    setReportType("All");
                                    setSearch("");

                                    const now = new Date();
                                    router.get(
                                        route(
                                            "progress-reports.orangtua"
                                        ) as any,
                                        {
                                            periodType: "month",
                                            reportType: "All",
                                            year: now.getFullYear(),
                                            month: now.getMonth() + 1,
                                        },
                                        { preserveState: true, replace: true }
                                    );
                                }}
                            >
                                Reset Filter
                            </Button>

                            <Button
                                onClick={() => {
                                    const now = new Date();
                                    const year = now.getFullYear();
                                    const month = now.getMonth() + 1;

                                    router.get(
                                        route(
                                            "progress-reports.orangtua"
                                        ) as any,
                                        {
                                            periodType: period,
                                            reportType: reportType,
                                            year: year.toString(),
                                            month: month.toString(),
                                        },
                                        { preserveState: true, replace: true }
                                    );
                                }}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Reports */}
                {filtered.length === 0 ? (
                    <div className="rounded-2xl border border-dashed bg-slate-50 p-10 text-center">
                        <FolderArchive className="mx-auto h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-3 text-base font-semibold text-slate-800">
                            No progress reports are available yet
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Reports will be generated after therapy sessions
                            have been completed.
                        </p>
                    </div>
                ) : (
                    <Card className="rounded-2xl shadow-sm">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <div className="hidden sm:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Report title
                                                </TableHead>
                                                <TableHead>
                                                    Reporting period
                                                </TableHead>
                                                <TableHead>Child</TableHead>
                                                <TableHead>Therapist</TableHead>
                                                <TableHead>Sessions</TableHead>
                                                <TableHead>Progress</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filtered.map((r) => (
                                                <TableRow key={r.id}>
                                                    <TableCell>
                                                        <div className="font-medium text-slate-800">
                                                            {r.title}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {r.reportingPeriodLabel}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <UserRound className="h-4 w-4 text-cyan-600" />
                                                            <span className="text-sm font-medium">
                                                                {r.childName}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {r.therapistName}
                                                    </TableCell>
                                                    <TableCell>
                                                        {r.completedSessions} /{" "}
                                                        {
                                                            r.therapySummary
                                                                .totalScheduledSessions
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Progress
                                                                value={
                                                                    r.progressPercentage
                                                                }
                                                                className="h-2 w-24"
                                                            />
                                                            <span className="text-sm font-medium">
                                                                {
                                                                    r.progressPercentage
                                                                }
                                                                %
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {formatDate(
                                                            r.createdAt
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={badgeVariantForStatus(
                                                                r.status
                                                            )}
                                                        >
                                                            {r.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Dialog>
                                                                <DialogTrigger>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            setActiveReport(
                                                                                r
                                                                            )
                                                                        }
                                                                    >
                                                                        View
                                                                        Report
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-3xl p-0">
                                                                    {/* modal content set below */}
                                                                    {activeReport &&
                                                                        activeReport.id ===
                                                                            r.id && (
                                                                            <div className="p-6">
                                                                                <DialogHeader>
                                                                                    <DialogTitle className="flex items-center gap-2 text-xl">
                                                                                        <FileText className="h-5 w-5 text-cyan-600" />
                                                                                        {
                                                                                            activeReport.title
                                                                                        }
                                                                                    </DialogTitle>
                                                                                    <DialogDescription>
                                                                                        Detailed
                                                                                        read-only
                                                                                        report
                                                                                        preview
                                                                                        for
                                                                                        parents.
                                                                                    </DialogDescription>
                                                                                </DialogHeader>

                                                                                <div className="mt-5 space-y-6">
                                                                                    {/* Report Information */}
                                                                                    <section className="grid gap-4 md:grid-cols-2">
                                                                                        <Card className="rounded-2xl shadow-none">
                                                                                            <CardContent className="p-5">
                                                                                                <div className="flex items-start gap-3">
                                                                                                    <Calendar className="mt-0.5 h-5 w-5 text-sky-600" />
                                                                                                    <div>
                                                                                                        <p className="text-xs font-semibold text-muted-foreground">
                                                                                                            Reporting
                                                                                                            period
                                                                                                        </p>
                                                                                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                                                                                            {
                                                                                                                activeReport.reportingPeriodLabel
                                                                                                            }
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="mt-4 flex items-start gap-3">
                                                                                                    <Users className="mt-0.5 h-5 w-5 text-cyan-600" />
                                                                                                    <div>
                                                                                                        <p className="text-xs font-semibold text-muted-foreground">
                                                                                                            Child
                                                                                                        </p>
                                                                                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                                                                                            {
                                                                                                                activeReport.childName
                                                                                                            }
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="mt-4 flex items-start gap-3">
                                                                                                    <Stethoscope className="mt-0.5 h-5 w-5 text-sky-600" />
                                                                                                    <div>
                                                                                                        <p className="text-xs font-semibold text-muted-foreground">
                                                                                                            Therapist
                                                                                                        </p>
                                                                                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                                                                                            {
                                                                                                                activeReport.therapistName
                                                                                                            }
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="mt-4 flex items-start gap-3">
                                                                                                    <CalendarDays className="mt-0.5 h-5 w-5 text-slate-500" />
                                                                                                    <div>
                                                                                                        <p className="text-xs font-semibold text-muted-foreground">
                                                                                                            Date
                                                                                                            created
                                                                                                        </p>
                                                                                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                                                                                            {formatDate(
                                                                                                                activeReport.createdAt
                                                                                                            )}
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </CardContent>
                                                                                        </Card>

                                                                                        <Card className="rounded-2xl shadow-none">
                                                                                            <CardContent className="p-5">
                                                                                                <div className="flex items-start gap-3">
                                                                                                    <Target className="mt-0.5 h-5 w-5 text-indigo-600" />
                                                                                                    <div>
                                                                                                        <p className="text-xs font-semibold text-muted-foreground">
                                                                                                            Attendance
                                                                                                        </p>
                                                                                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                                                                                            {Math.round(
                                                                                                                activeReport
                                                                                                                    .therapySummary
                                                                                                                    .attendancePercentage
                                                                                                            )}

                                                                                                            %
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="mt-4 space-y-3">
                                                                                                    <div className="flex items-center justify-between">
                                                                                                        <span className="text-sm text-muted-foreground">
                                                                                                            Total
                                                                                                            scheduled
                                                                                                        </span>
                                                                                                        <span className="text-sm font-medium text-slate-800">
                                                                                                            {
                                                                                                                activeReport
                                                                                                                    .therapySummary
                                                                                                                    .totalScheduledSessions
                                                                                                            }
                                                                                                        </span>
                                                                                                    </div>
                                                                                                    <div className="flex items-center justify-between">
                                                                                                        <span className="text-sm text-muted-foreground">
                                                                                                            Completed
                                                                                                        </span>
                                                                                                        <span className="text-sm font-medium text-slate-800">
                                                                                                            {
                                                                                                                activeReport
                                                                                                                    .therapySummary
                                                                                                                    .completedSessions
                                                                                                            }
                                                                                                        </span>
                                                                                                    </div>
                                                                                                    <div className="flex items-center justify-between">
                                                                                                        <span className="text-sm text-muted-foreground">
                                                                                                            Missed
                                                                                                        </span>
                                                                                                        <span className="text-sm font-medium text-slate-800">
                                                                                                            {
                                                                                                                activeReport
                                                                                                                    .therapySummary
                                                                                                                    .missedSessions
                                                                                                            }
                                                                                                        </span>
                                                                                                    </div>

                                                                                                    <div className="mt-2">
                                                                                                        <Progress
                                                                                                            value={
                                                                                                                activeReport
                                                                                                                    .therapySummary
                                                                                                                    .attendancePercentage
                                                                                                            }
                                                                                                            className="h-2"
                                                                                                        />
                                                                                                        <p className="mt-2 text-xs text-muted-foreground">
                                                                                                            Based
                                                                                                            on
                                                                                                            scheduled
                                                                                                            session
                                                                                                            attendance.
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </CardContent>
                                                                                        </Card>
                                                                                    </section>

                                                                                    {/* Progress Summary */}
                                                                                    <section>
                                                                                        <div className="mb-3 flex items-center gap-2">
                                                                                            <Sparkles className="h-5 w-5 text-cyan-600" />
                                                                                            <h3 className="text-base font-semibold text-slate-800">
                                                                                                Progress
                                                                                                Summary
                                                                                            </h3>
                                                                                        </div>

                                                                                        <div className="grid gap-4 md:grid-cols-2">
                                                                                            {activeReport.objectives.map(
                                                                                                (
                                                                                                    obj
                                                                                                ) => (
                                                                                                    <ObjectiveProgressRow
                                                                                                        key={
                                                                                                            obj.key
                                                                                                        }
                                                                                                        item={
                                                                                                            obj
                                                                                                        }
                                                                                                    />
                                                                                                )
                                                                                            )}
                                                                                        </div>
                                                                                    </section>

                                                                                    {/* Therapist Evaluation */}
                                                                                    <section className="grid gap-4 md:grid-cols-2">
                                                                                        <Card className="rounded-2xl shadow-none">
                                                                                            <CardHeader>
                                                                                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                                                                                    <Stethoscope className="h-5 w-5 text-sky-600" />
                                                                                                    Overall
                                                                                                    assessment
                                                                                                </CardTitle>
                                                                                            </CardHeader>
                                                                                            <CardContent>
                                                                                                <p className="text-sm leading-relaxed text-slate-700">
                                                                                                    “
                                                                                                    {
                                                                                                        activeReport
                                                                                                            .therapistEvaluation
                                                                                                            .overallAssessment
                                                                                                    }

                                                                                                    ”
                                                                                                </p>
                                                                                            </CardContent>
                                                                                        </Card>

                                                                                        <Card className="rounded-2xl shadow-none">
                                                                                            <CardHeader>
                                                                                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                                                                                    <BadgeCheck className="h-5 w-5 text-emerald-600" />
                                                                                                    Recommendations
                                                                                                </CardTitle>
                                                                                            </CardHeader>
                                                                                            <CardContent>
                                                                                                <ul className="space-y-2 text-sm text-muted-foreground">
                                                                                                    {activeReport.therapistEvaluation.recommendations.map(
                                                                                                        (
                                                                                                            s: string
                                                                                                        ) => (
                                                                                                            <li
                                                                                                                key={
                                                                                                                    s
                                                                                                                }
                                                                                                                className="flex items-start gap-2"
                                                                                                            >
                                                                                                                <BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
                                                                                                                <span>
                                                                                                                    {
                                                                                                                        s
                                                                                                                    }
                                                                                                                </span>
                                                                                                            </li>
                                                                                                        )
                                                                                                    )}
                                                                                                </ul>
                                                                                            </CardContent>
                                                                                        </Card>
                                                                                    </section>

                                                                                    <section className="grid gap-4 md:grid-cols-2">
                                                                                        <Card className="rounded-2xl shadow-none">
                                                                                            <CardHeader>
                                                                                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                                                                                    <Download className="h-5 w-5 text-cyan-600" />
                                                                                                    Strengths
                                                                                                </CardTitle>
                                                                                            </CardHeader>
                                                                                            <CardContent>
                                                                                                <ul className="space-y-2 text-sm text-muted-foreground">
                                                                                                    {activeReport.therapistEvaluation.strengths.map(
                                                                                                        (
                                                                                                            s
                                                                                                        ) => (
                                                                                                            <li
                                                                                                                key={
                                                                                                                    s
                                                                                                                }
                                                                                                                className="flex items-start gap-2"
                                                                                                            >
                                                                                                                <BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
                                                                                                                <span>
                                                                                                                    {
                                                                                                                        s
                                                                                                                    }
                                                                                                                </span>
                                                                                                            </li>
                                                                                                        )
                                                                                                    )}
                                                                                                </ul>
                                                                                            </CardContent>
                                                                                        </Card>

                                                                                        <Card className="rounded-2xl shadow-none">
                                                                                            <CardHeader>
                                                                                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                                                                                    <XCircle className="h-5 w-5 text-amber-600" />
                                                                                                    Areas
                                                                                                    needing
                                                                                                    improvement
                                                                                                </CardTitle>
                                                                                            </CardHeader>
                                                                                            <CardContent>
                                                                                                <ul className="space-y-2 text-sm text-muted-foreground">
                                                                                                    {activeReport.therapistEvaluation.areasForImprovement.map(
                                                                                                        (
                                                                                                            s
                                                                                                        ) => (
                                                                                                            <li
                                                                                                                key={
                                                                                                                    s
                                                                                                                }
                                                                                                                className="flex items-start gap-2"
                                                                                                            >
                                                                                                                <XCircle className="mt-0.5 h-4 w-4 text-amber-600" />
                                                                                                                <span>
                                                                                                                    {
                                                                                                                        s
                                                                                                                    }
                                                                                                                </span>
                                                                                                            </li>
                                                                                                        )
                                                                                                    )}
                                                                                                </ul>
                                                                                            </CardContent>
                                                                                        </Card>
                                                                                    </section>

                                                                                    {/* Home Practice */}
                                                                                    <section>
                                                                                        <div className="mb-3 flex items-center gap-2">
                                                                                            <Home className="h-5 w-5 text-cyan-600" />
                                                                                            <h3 className="text-base font-semibold text-slate-800">
                                                                                                Home
                                                                                                Practice
                                                                                                Recommendations
                                                                                            </h3>
                                                                                        </div>

                                                                                        <div className="space-y-3">
                                                                                            {activeReport.homePracticeRecommendations.map(
                                                                                                (
                                                                                                    rec
                                                                                                ) => (
                                                                                                    <div
                                                                                                        key={
                                                                                                            rec.title
                                                                                                        }
                                                                                                        className="rounded-2xl border bg-background p-4"
                                                                                                    >
                                                                                                        <p className="font-semibold text-slate-800">
                                                                                                            {
                                                                                                                rec.title
                                                                                                            }
                                                                                                        </p>
                                                                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                                                                            {
                                                                                                                rec.description
                                                                                                            }
                                                                                                        </p>
                                                                                                    </div>
                                                                                                )
                                                                                            )}
                                                                                        </div>
                                                                                    </section>

                                                                                    {/* Conclusion */}
                                                                                    <section className="rounded-2xl border bg-slate-50/60 p-5">
                                                                                        <p className="text-xs font-semibold text-muted-foreground">
                                                                                            Report
                                                                                            conclusion
                                                                                        </p>
                                                                                        <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                                                                            {
                                                                                                activeReport.conclusion
                                                                                            }
                                                                                        </p>
                                                                                    </section>
                                                                                </div>

                                                                                <DialogFooter className="mt-6">
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        onClick={() => {
                                                                                            window.open(
                                                                                                activeReport.pdfUrl,
                                                                                                "_blank"
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        <Download className="h-4 w-4" />
                                                                                        Download
                                                                                        PDF
                                                                                    </Button>

                                                                                    <Button
                                                                                        onClick={() =>
                                                                                            setActiveReport(
                                                                                                null
                                                                                            )
                                                                                        }
                                                                                        variant="secondary"
                                                                                    >
                                                                                        Close
                                                                                    </Button>
                                                                                </DialogFooter>
                                                                            </div>
                                                                        )}
                                                                </DialogContent>
                                                            </Dialog>

                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={
                                                                    r.status !==
                                                                    "Available"
                                                                }
                                                                onClick={() => {
                                                                    window.open(
                                                                        r.pdfUrl,
                                                                        "_blank"
                                                                    );
                                                                }}
                                                            >
                                                                <Download className="h-4 w-4" />
                                                                Download PDF
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile: simple stacked cards */}
                                <div className="sm:hidden p-4 space-y-4">
                                    {filtered.map((r) => (
                                        <Card
                                            key={r.id}
                                            className="rounded-2xl shadow-none"
                                        >
                                            <CardHeader className="pb-2">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <CardTitle className="text-base">
                                                            {r.title}
                                                        </CardTitle>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {
                                                                r.reportingPeriodLabel
                                                            }{" "}
                                                            • {r.childName}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className={badgeVariantForStatus(
                                                            r.status
                                                        )}
                                                    >
                                                        {r.status}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            Sessions
                                                        </span>
                                                        <span className="text-sm font-medium text-slate-800">
                                                            {
                                                                r.completedSessions
                                                            }{" "}
                                                            /{" "}
                                                            {
                                                                r.therapySummary
                                                                    .totalScheduledSessions
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            Progress
                                                        </span>
                                                        <span className="text-sm font-medium text-slate-800">
                                                            {
                                                                r.progressPercentage
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={
                                                            r.progressPercentage
                                                        }
                                                        className="h-2"
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-muted-foreground">
                                                        Created:{" "}
                                                        {formatDate(
                                                            r.createdAt
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Dialog>
                                                        <DialogTrigger>
                                                            <Button
                                                                variant="outline"
                                                                className="flex-1"
                                                                onClick={() =>
                                                                    setActiveReport(
                                                                        r
                                                                    )
                                                                }
                                                            >
                                                                View Report
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-3xl p-0">
                                                            {activeReport &&
                                                                activeReport.id ===
                                                                    r.id && (
                                                                    <div className="p-6">
                                                                        <DialogHeader>
                                                                            <DialogTitle className="flex items-center gap-2 text-xl">
                                                                                <FileText className="h-5 w-5 text-cyan-600" />
                                                                                {
                                                                                    activeReport.title
                                                                                }
                                                                            </DialogTitle>
                                                                            <DialogDescription>
                                                                                Detailed
                                                                                read-only
                                                                                report
                                                                                preview
                                                                                for
                                                                                parents.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="mt-5 space-y-6">
                                                                            {/* Reuse same modal content by showing only the essential pieces on mobile */}
                                                                            <section className="grid gap-4">
                                                                                <Card className="rounded-2xl shadow-none">
                                                                                    <CardContent className="p-5 space-y-2">
                                                                                        <p className="text-xs font-semibold text-muted-foreground">
                                                                                            Reporting
                                                                                            period
                                                                                        </p>
                                                                                        <p className="text-sm font-medium text-slate-800">
                                                                                            {
                                                                                                activeReport.reportingPeriodLabel
                                                                                            }
                                                                                        </p>

                                                                                        <p className="text-xs font-semibold text-muted-foreground pt-3">
                                                                                            Child
                                                                                            &
                                                                                            therapist
                                                                                        </p>
                                                                                        <p className="text-sm text-slate-700">
                                                                                            {
                                                                                                activeReport.childName
                                                                                            }{" "}
                                                                                            •{" "}
                                                                                            {
                                                                                                activeReport.therapistName
                                                                                            }
                                                                                        </p>
                                                                                    </CardContent>
                                                                                </Card>

                                                                                <div>
                                                                                    <div className="flex items-center gap-2 mb-3">
                                                                                        <Target className="h-5 w-5 text-cyan-600" />
                                                                                        <h3 className="text-base font-semibold text-slate-800">
                                                                                            Progress
                                                                                            Summary
                                                                                        </h3>
                                                                                    </div>
                                                                                    <div className="space-y-3">
                                                                                        {activeReport.objectives.map(
                                                                                            (
                                                                                                obj
                                                                                            ) => (
                                                                                                <ObjectiveProgressRow
                                                                                                    key={
                                                                                                        obj.key
                                                                                                    }
                                                                                                    item={
                                                                                                        obj
                                                                                                    }
                                                                                                />
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                </div>

                                                                                <section className="rounded-2xl border bg-slate-50/60 p-5">
                                                                                    <p className="text-xs font-semibold text-muted-foreground">
                                                                                        Report
                                                                                        conclusion
                                                                                    </p>
                                                                                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                                                                        {
                                                                                            activeReport.conclusion
                                                                                        }
                                                                                    </p>
                                                                                </section>
                                                                            </section>
                                                                        </div>
                                                                        <DialogFooter className="mt-6">
                                                                            <Button
                                                                                variant="outline"
                                                                                onClick={() =>
                                                                                    window.open(
                                                                                        activeReport.pdfUrl,
                                                                                        "_blank"
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Download className="h-4 w-4" />
                                                                                Download
                                                                                PDF
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() =>
                                                                                    setActiveReport(
                                                                                        null
                                                                                    )
                                                                                }
                                                                                variant="secondary"
                                                                            >
                                                                                Close
                                                                            </Button>
                                                                        </DialogFooter>
                                                                    </div>
                                                                )}
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Button
                                                        variant="outline"
                                                        className="flex-1"
                                                        disabled={
                                                            r.status !==
                                                            "Available"
                                                        }
                                                        onClick={() => {
                                                            window.open(
                                                                r.pdfUrl,
                                                                "_blank"
                                                            );
                                                        }}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        PDF
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
