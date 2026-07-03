import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import {
    BadgeCheck,
    BookOpenCheck,
    CalendarDays,
    CheckCircle2,
    CircleDot,
    Clock3,
    Ear,
    ExternalLink,
    Flag,
    Goal,
    Hand,
    Heart,
    Home,
    LineChart as LineChartIcon,
    MessagesSquare,
    Milestone,
    Sparkles,
    Stethoscope,
    Target,
    Trophy,
    UserRound,
    Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type TherapyGoalStatus = "Not Started" | "In Progress" | "Completed";

type TherapyGoal = {
    id: string;
    title: string;
    completion: number; // 0..100
    status: TherapyGoalStatus;
};

type TimelineItem = {
    sessionNumber: number;
    date: string; // YYYY-MM-DD or ISO
    therapistName: string;
    evaluation: string;
    improvementNotes: string;
};

type LatestEvaluation = {
    date: string;
    therapistName: string;
    overallAssessment: string;
    strengths: string[];
    areasForImprovement: string[];
    homePracticeRecommendations: string[];
};

type MilestoneItem = {
    id: string;
    title: string;
    achievementDate: string;
    description: string;
    completed: boolean;
};

type MonthlyProgressRow = {
    id: string;
    month: string;
    sessionsCompleted: number;
    progressPercentage: number;
    therapistRating: string;
};

type ParentNote = {
    id: string;
    date: string;
    therapistName: string;
    content: string;
};

type ChildProgressPageProps = {
    summary?: {
        totalTherapySessions: number;
        completedSessions: number;
        currentProgressPercentage: number;
        latestEvaluationDate?: string | null;
    };
    therapyLevel?: string;
    therapySummary?: string;
    goals?: TherapyGoal[];
    timeline?: TimelineItem[];
    latestEvaluation?: LatestEvaluation | null;
    milestones?: MilestoneItem[];
    monthlyProgress?: MonthlyProgressRow[];
    parentNotes?: ParentNote[];
};

function formatDate(date: string | null | undefined) {
    if (!date) return "—";
    const [y, m, d] = date.split("-").map(Number);
    if (!y || !m || !d) {
        // fallback
        const dt = new Date(date);
        if (Number.isNaN(dt.getTime())) return date;
        return dt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    }

    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
}

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
}

function goalStatusBadgeVariant(status: TherapyGoalStatus): string {
    switch (status) {
        case "Completed":
            return "bg-emerald-100 text-emerald-700 border-emerald-200";
        case "In Progress":
            return "bg-cyan-100 text-cyan-700 border-cyan-200";
        default:
            return "bg-slate-100 text-slate-700 border-slate-200";
    }
}

function milestoneAccentClass(completed: boolean) {
    if (completed) return "border-emerald-200 bg-emerald-50/50";
    return "border-slate-200 bg-slate-50";
}

function isEmptyData(props: ChildProgressPageProps) {
    const goals = props.goals ?? [];
    const timeline = props.timeline ?? [];
    const milestones = props.milestones ?? [];
    const notes = props.parentNotes ?? [];

    return (
        goals.length === 0 &&
        timeline.length === 0 &&
        milestones.length === 0 &&
        notes.length === 0
    );
}

const defaultSummary = {
    totalTherapySessions: 0,
    completedSessions: 0,
    currentProgressPercentage: 0,
    latestEvaluationDate: null,
};

export default function ChildProgressPage({
    summary = defaultSummary,
    therapyLevel = "—",
    therapySummary = "",
    goals = [],
    timeline = [],
    latestEvaluation = null,
    milestones = [],
    monthlyProgress = [],
    parentNotes = [],
}: ChildProgressPageProps) {
    const progressPct = clamp(summary.currentProgressPercentage ?? 0, 0, 100);

    const empty = isEmptyData({
        summary,
        therapyLevel,
        therapySummary,
        goals,
        timeline,
        latestEvaluation,
        milestones,
        monthlyProgress,
        parentNotes,
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold leading-tight">
                        Child Progress
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Track your child's progress throughout the therapy
                        program.
                    </p>
                </div>
            }
        >
            <Head title="Child Progress" />

            {empty ? (
                <div className="mx-auto max-w-6xl px-0 py-2">
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-slate-50 px-6 py-12 text-center">
                        <Milestone className="h-10 w-10 text-slate-400" />
                        <p className="text-sm font-medium text-slate-700">
                            No progress data is available yet. Progress will
                            appear after therapy sessions have been completed.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mx-auto max-w-6xl space-y-6 px-0">
                    {/* Summary Cards */}
                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="rounded-2xl shadow-sm transition-shadow hover:shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Clock3 className="h-4 w-4 text-sky-600" />
                                    Total Therapy Sessions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="text-3xl font-bold text-slate-900">
                                    {summary.totalTherapySessions}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    All scheduled sessions
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm transition-shadow hover:shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    Completed Sessions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="text-3xl font-bold text-slate-900">
                                    {summary.completedSessions}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Sessions already completed
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm transition-shadow hover:shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <LineChartIcon className="h-4 w-4 text-cyan-600" />
                                    Current Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="text-3xl font-bold text-slate-900">
                                    {progressPct}%
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Based on latest evaluations
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm transition-shadow hover:shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <CalendarDays className="h-4 w-4 text-sky-600" />
                                    Latest Evaluation Date
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="text-2xl font-semibold text-slate-900">
                                    {formatDate(summary.latestEvaluationDate)}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Most recent therapist review
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Overall Progress */}
                    <section className="grid gap-6 md:grid-cols-2">
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <LineChartIcon className="h-5 w-5 text-cyan-600" />
                                    Overall Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-end justify-between gap-4">
                                        <div className="text-5xl font-bold tracking-tight text-slate-900">
                                            {progressPct}%
                                        </div>
                                        <Badge
                                            className="border-0 bg-cyan-500/10 text-cyan-700"
                                            variant="outline"
                                        >
                                            Level: {therapyLevel}
                                        </Badge>
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Progress
                                            </span>
                                            <span className="font-medium">
                                                {progressPct}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={progressPct}
                                            className="h-2"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-xl border bg-slate-50/60 p-4">
                                    <p className="text-sm font-medium text-slate-800">
                                        Summary
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {therapySummary ||
                                            "The child is showing consistent improvement in listening and verbal communication skills."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Therapy Goals */}
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <Target className="h-5 w-5 text-cyan-600" />
                                    Therapy Goals
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {goals.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No goals available.
                                    </p>
                                ) : (
                                    goals.map((g) => (
                                        <div
                                            key={g.id}
                                            className="rounded-xl border bg-background p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-slate-800">
                                                        {g.title}
                                                    </p>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        {g.completion}%
                                                        completed
                                                    </p>
                                                </div>
                                                <Badge
                                                    className={`border ${goalStatusBadgeVariant(
                                                        g.status
                                                    )}`}
                                                    variant="outline"
                                                >
                                                    {g.status}
                                                </Badge>
                                            </div>

                                            <div className="mt-3">
                                                <Progress
                                                    value={clamp(
                                                        g.completion,
                                                        0,
                                                        100
                                                    )}
                                                    className="h-2"
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    {/* Timeline + Latest Evaluation */}
                    <section className="grid gap-6 lg:grid-cols-2">
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <Clock3 className="h-5 w-5 text-cyan-600" />
                                    Progress Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {timeline.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Timeline will appear after sessions are
                                        completed.
                                    </p>
                                ) : (
                                    <ol className="space-y-4">
                                        {timeline.map((item, idx) => (
                                            <li
                                                key={`${item.sessionNumber}-${item.date}-${idx}`}
                                                className="relative rounded-2xl border bg-background p-4 pl-10"
                                            >
                                                <span className="absolute left-4 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200">
                                                    <CircleDot className="h-4 w-4" />
                                                </span>

                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Badge variant="secondary">
                                                            Session #
                                                            {item.sessionNumber}
                                                        </Badge>
                                                        <span className="text-sm text-muted-foreground">
                                                            {formatDate(
                                                                item.date
                                                            )}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm font-medium text-slate-800">
                                                        Evaluation by{" "}
                                                        {item.therapistName}
                                                    </p>
                                                    <p className="text-sm text-slate-700">
                                                        “{item.evaluation}”
                                                    </p>
                                                    <div className="rounded-xl bg-slate-50/70 p-3">
                                                        <p className="text-xs font-semibold text-muted-foreground">
                                                            Improvement Notes
                                                        </p>
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            {
                                                                item.improvementNotes
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <Stethoscope className="h-5 w-5 text-cyan-600" />
                                    Latest Therapist Evaluation
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!latestEvaluation ? (
                                    <p className="text-sm text-muted-foreground">
                                        No evaluation has been recorded yet.
                                    </p>
                                ) : (
                                    <div className="rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <Badge
                                                    variant="secondary"
                                                    className="w-fit"
                                                >
                                                    {formatDate(
                                                        latestEvaluation.date
                                                    )}
                                                </Badge>
                                                <p className="mt-2 text-sm font-semibold text-slate-800">
                                                    {
                                                        latestEvaluation.therapistName
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground">
                                                    Overall assessment
                                                </p>
                                                <p className="mt-2 text-sm text-slate-700">
                                                    “
                                                    {
                                                        latestEvaluation.overallAssessment
                                                    }
                                                    ”
                                                </p>
                                            </div>

                                            <div className="grid gap-3 md:grid-cols-2">
                                                <div className="rounded-xl border bg-background p-4">
                                                    <p className="text-xs font-semibold text-muted-foreground">
                                                        Strengths
                                                    </p>
                                                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                                        {latestEvaluation
                                                            .strengths
                                                            ?.length ? (
                                                            latestEvaluation.strengths.map(
                                                                (s, i) => (
                                                                    <li
                                                                        key={`${s}-${i}`}
                                                                        className="flex items-start gap-2"
                                                                    >
                                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                                                                        <span>
                                                                            {s}
                                                                        </span>
                                                                    </li>
                                                                )
                                                            )
                                                        ) : (
                                                            <li>—</li>
                                                        )}
                                                    </ul>
                                                </div>

                                                <div className="rounded-xl border bg-background p-4">
                                                    <p className="text-xs font-semibold text-muted-foreground">
                                                        Areas for improvement
                                                    </p>
                                                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                                        {latestEvaluation
                                                            .areasForImprovement
                                                            ?.length ? (
                                                            latestEvaluation.areasForImprovement.map(
                                                                (s, i) => (
                                                                    <li
                                                                        key={`${s}-${i}`}
                                                                        className="flex items-start gap-2"
                                                                    >
                                                                        <BadgeCheck className="mt-0.5 h-4 w-4 text-cyan-600" />
                                                                        <span>
                                                                            {s}
                                                                        </span>
                                                                    </li>
                                                                )
                                                            )
                                                        ) : (
                                                            <li>—</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="rounded-xl border bg-background p-4">
                                                <p className="text-xs font-semibold text-muted-foreground">
                                                    Home practice
                                                    recommendations
                                                </p>
                                                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                                    {latestEvaluation
                                                        .homePracticeRecommendations
                                                        ?.length ? (
                                                        latestEvaluation.homePracticeRecommendations.map(
                                                            (s, i) => (
                                                                <li
                                                                    key={`${s}-${i}`}
                                                                    className="flex items-start gap-2"
                                                                >
                                                                    <Home className="mt-0.5 h-4 w-4 text-emerald-600" />
                                                                    <span>
                                                                        {s}
                                                                    </span>
                                                                </li>
                                                            )
                                                        )
                                                    ) : (
                                                        <li>—</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    {/* Milestones + Monthly Progress */}
                    <section className="grid gap-6 lg:grid-cols-2">
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <Trophy className="h-5 w-5 text-cyan-600" />
                                    Milestones
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {milestones.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No milestones yet.
                                    </p>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {milestones.map((m) => (
                                            <div
                                                key={m.id}
                                                className={`rounded-2xl border p-4 ${milestoneAccentClass(
                                                    m.completed
                                                )}`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                                                            <Milestone className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-800">
                                                                {m.title}
                                                            </p>
                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                Achieved:{" "}
                                                                {formatDate(
                                                                    m.achievementDate
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {m.completed ? (
                                                        <Badge
                                                            className="border-emerald-200 bg-emerald-100 text-emerald-700"
                                                            variant="outline"
                                                        >
                                                            Completed
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            In progress
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="mt-3 text-sm text-muted-foreground">
                                                    {m.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <CalendarDays className="h-5 w-5 text-cyan-600" />
                                    Monthly Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {monthlyProgress.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Monthly progress will appear here.
                                    </p>
                                ) : (
                                    <div className="overflow-hidden rounded-xl border">
                                        <div className="grid gap-0 bg-background p-3 text-xs font-semibold text-muted-foreground sm:grid-cols-4">
                                            <div>Month</div>
                                            <div>Sessions</div>
                                            <div>Progress</div>
                                            <div>Therapist Rating</div>
                                        </div>
                                        <div className="divide-y">
                                            {monthlyProgress.map((row) => (
                                                <div
                                                    key={row.id}
                                                    className="grid gap-0 p-3 text-sm sm:grid-cols-4"
                                                >
                                                    <div className="font-medium text-slate-800">
                                                        {row.month}
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        {row.sessionsCompleted}
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        {row.progressPercentage}
                                                        %
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        {row.therapistRating}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    {/* Parent Notes */}
                    <section>
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <MessagesSquare className="h-5 w-5 text-cyan-600" />
                                    Parent Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {parentNotes.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No therapist notes yet.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {parentNotes
                                            .slice()
                                            .sort((a, b) =>
                                                (b.date ?? "").localeCompare(
                                                    a.date ?? ""
                                                )
                                            )
                                            .map((note) => (
                                                <div
                                                    key={note.id}
                                                    className="rounded-2xl border bg-background p-4 transition-shadow hover:shadow-md"
                                                >
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">
                                                                {
                                                                    note.therapistName
                                                                }
                                                            </p>
                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                {formatDate(
                                                                    note.date
                                                                )}
                                                            </p>
                                                        </div>
                                                        <Badge
                                                            className="w-fit"
                                                            variant="secondary"
                                                        >
                                                            Therapist note
                                                        </Badge>
                                                    </div>
                                                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                                        {note.content}
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
