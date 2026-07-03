import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";
import {
    Calendar as CalendarIcon,
    ClipboardList,
    Clock3,
    Search,
    Timer,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

type SessionStatus = "Upcoming" | "Completed" | "Cancelled";

type TherapyObjective = {
    longTermGoal?: string | null;
    shortTermGoal?: string | null;
    homeProgram?: string | null;
};

type PlannedActivity = {
    name?: string | null;
    objective?: string | null;
    score?: number | string | null;
    observation?: string | null;
};

type Evaluation = {
    listening?: string | null;
    speech?: string | null;
    language?: string | null;
    attention?: string | null;
    recommendation?: string | null;
};

type Session = {
    id: string;
    therapyTitle: string;
    date: string | null; // YYYY-MM-DD
    time: string; // HH:mm (backend) or TBD
    therapistName: string;

    status: SessionStatus;

    therapyLocation: string;

    sessionObjectives: TherapyObjective;
    plannedActivities: PlannedActivity[];
    notesForParents: string | null;
    currentStatus: SessionStatus;

    evaluation?: Evaluation | null;
    patientAvatar?: string | null;
};

type Props = {
    sessions: Session[];
};

const statusBadgeClasses: Record<SessionStatus, string> = {
    Upcoming:
        "bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-950/20 dark:text-blue-300",
    Completed:
        "bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-950/20 dark:text-green-300",
    Cancelled:
        "bg-red-50 text-red-700 hover:bg-red-50 dark:bg-red-950/20 dark:text-red-300",
};

function isValidISO(iso: string | null | undefined) {
    return !!iso && /^\d{4}-\d{2}-\d{2}$/.test(iso);
}

function toYM(isoDate: string) {
    const [y, m] = isoDate.split("-");
    if (!y || !m) return "";
    return `${y}-${m}`;
}

function formatMonthLong(ym: string) {
    const [y, m] = ym.split("-").map(Number);
    if (!y || !m) return ym;
    const dt = new Date(y, m - 1, 1);
    return dt.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function formatDateShort(isoDate: string) {
    const [y, m, d] = isoDate.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function safeText(value: string | null | undefined) {
    if (!value) return "—";
    return value;
}

function inferTimeRange(time: string) {
    if (!time || time.toLowerCase().includes("tbd")) return "TBD";
    if (/^\d{2}:\d{2}$/.test(time)) return `${time}–09:30`;
    return time;
}

function StatusBadge({ status }: { status: SessionStatus }) {
    return (
        <Badge className={statusBadgeClasses[status]} variant="secondary">
            {status === "Upcoming"
                ? "Upcoming"
                : status === "Completed"
                ? "Completed"
                : "Cancelled"}
        </Badge>
    );
}

function LabeledRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-muted-foreground">{icon}</div>
            <div className="min-w-0">
                <div className="text-xs font-medium text-muted-foreground">
                    {label}
                </div>
                <div className="mt-0.5 break-words text-sm text-foreground">
                    {value}
                </div>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-slate-50 px-6 py-10 text-center">
            <CalendarIcon className="h-10 w-10 text-slate-400" />
            <p className="text-sm font-medium text-slate-700">
                No therapy sessions have been scheduled yet.
            </p>
        </div>
    );
}

export default function TherapySchedulePage({ sessions }: Props) {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState<"All" | SessionStatus | "Cancelled">(
        "All"
    );
    const [month, setMonth] = useState<string>("All");

    const monthOptions = useMemo(() => {
        const set = new Set<string>();
        for (const s of sessions) {
            if (isValidISO(s.date)) set.add(toYM(s.date as string));
        }
        return Array.from(set)
            .sort((a, b) => b.localeCompare(a))
            .reverse();
    }, [sessions]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        return sessions
            .filter((s) => {
                const matchesText =
                    !q ||
                    (s.therapyTitle ?? "").toLowerCase().includes(q) ||
                    (s.therapistName ?? "").toLowerCase().includes(q);

                const normalizedStatus =
                    status === "Cancelled" ? "Cancelled" : status;
                const matchesStatus =
                    normalizedStatus === "All"
                        ? true
                        : s.status === (normalizedStatus as SessionStatus);

                const matchesMonth =
                    month === "All"
                        ? true
                        : isValidISO(s.date)
                        ? toYM(s.date as string) === month
                        : false;

                return matchesText && matchesStatus && matchesMonth;
            })
            .sort((a, b) => {
                const da = a.date ?? "";
                const db = b.date ?? "";
                if (da === db) return a.time.localeCompare(b.time);
                return da.localeCompare(db);
            });
    }, [sessions, query, status, month]);

    const totalSessions = sessions.length;

    const upcomingCount = useMemo(
        () => sessions.filter((s) => s.status === "Upcoming").length,
        [sessions]
    );

    const completedCount = useMemo(
        () => sessions.filter((s) => s.status === "Completed").length,
        [sessions]
    );

    const nextTherapyDate = useMemo(() => {
        const now = new Date();
        const next = sessions
            .filter((s) => s.status === "Upcoming" && isValidISO(s.date))
            .map((s) => ({ s, dt: new Date(s.date as string) }))
            .filter(({ dt }) => dt >= new Date(now.toDateString()))
            .sort((a, b) => a.dt.getTime() - b.dt.getTime())[0]?.s;

        if (!next?.date) return "—";
        return formatDateShort(next.date);
    }, [sessions]);

    return (
        <AuthenticatedLayout
        header={
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                        Therapy Schedule
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        View your child's upcoming and completed therapy
                        sessions.
                    </p>
            </div>
        }>
            <Head title="Therapy Schedule" />

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                {/* <header className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Therapy Schedule
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        View your child's upcoming and completed therapy
                        sessions.
                    </p>
                </header> */}

                {totalSessions === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* Summary Cards */}
                        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Card className="rounded-xl shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Timer className="h-4 w-4 text-muted-foreground" />
                                        Total Sessions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="text-3xl font-bold">
                                        {totalSessions}
                                    </div>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        All therapy sessions
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-xl shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Clock3 className="h-4 w-4 text-muted-foreground" />
                                        Upcoming Sessions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="text-3xl font-bold">
                                        {upcomingCount}
                                    </div>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        Sessions scheduled for the future
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-xl shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                        Completed Sessions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="text-3xl font-bold">
                                        {completedCount}
                                    </div>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        Sessions that have been completed
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-xl shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        Next Therapy Date
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="text-2xl font-semibold">
                                        {nextTherapyDate}
                                    </div>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        Earliest upcoming session date
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Search & Filter */}
                        <section className="mb-6">
                            <Card className="rounded-xl shadow-sm">
                                <CardContent className="pt-5">
                                    <div className="grid gap-4 md:grid-cols-12">
                                        <div className="md:col-span-5">
                                            <div className="relative">
                                                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    value={query}
                                                    onChange={(e) =>
                                                        setQuery(e.target.value)
                                                    }
                                                    placeholder="Search by therapy title or therapist name"
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-3">
                                            <label className="mb-2 block text-xs font-medium text-muted-foreground">
                                                Status
                                            </label>
                                            <select
                                                value={status}
                                                onChange={(e) =>
                                                    setStatus(
                                                        e.target.value as any
                                                    )
                                                }
                                                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                            >
                                                <option value="All">All</option>
                                                <option value="Upcoming">
                                                    Upcoming
                                                </option>
                                                <option value="Completed">
                                                    Completed
                                                </option>
                                                <option value="Cancelled">
                                                    Cancelled
                                                </option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-4">
                                            <label className="mb-2 block text-xs font-medium text-muted-foreground">
                                                Month
                                            </label>
                                            <select
                                                value={month}
                                                onChange={(e) =>
                                                    setMonth(e.target.value)
                                                }
                                                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                            >
                                                <option value="All">All</option>
                                                {monthOptions.map((m) => (
                                                    <option key={m} value={m}>
                                                        {formatMonthLong(m)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {filtered.length === 0 ? (
                                        <div className="mt-4 text-sm text-muted-foreground">
                                            No sessions match your search and
                                            filters.
                                        </div>
                                    ) : null}
                                </CardContent>
                            </Card>
                        </section>

                        {/* Therapy Schedule List */}
                        <section>
                            {filtered.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <div className="grid gap-4">
                                    {filtered.map((s) => (
                                        <Card
                                            key={s.id}
                                            className="rounded-xl shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <CardHeader className="flex flex-row items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <CardTitle className="flex items-center gap-3 text-lg">
                                                        <span className="truncate">
                                                            {s.therapyTitle}
                                                        </span>
                                                        <StatusBadge
                                                            status={s.status}
                                                        />
                                                    </CardTitle>
                                                    <div className="mt-1 text-sm text-muted-foreground">
                                                        {isValidISO(s.date)
                                                            ? formatDateShort(
                                                                  s.date as string
                                                              )
                                                            : "—"}
                                                    </div>
                                                </div>

                                                <Sheet>
                                                    <SheetTrigger>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </SheetTrigger>
                                                    <SheetContent className="w-full sm:max-w-2xl">
                                                        <SheetHeader>
                                                            <SheetTitle>
                                                                {s.therapyTitle}
                                                            </SheetTitle>
                                                            <SheetDescription>
                                                                Session details
                                                                for parents
                                                            </SheetDescription>
                                                        </SheetHeader>

                                                        <div className="mt-6 space-y-6">
                                                            <div className="space-y-3">
                                                                <LabeledRow
                                                                    icon={
                                                                        <CalendarIcon className="h-4 w-4" />
                                                                    }
                                                                    label="Date"
                                                                    value={
                                                                        isValidISO(
                                                                            s.date
                                                                        )
                                                                            ? formatDateShort(
                                                                                  s.date as string
                                                                              )
                                                                            : "—"
                                                                    }
                                                                />
                                                                <LabeledRow
                                                                    icon={
                                                                        <Clock3 className="h-4 w-4" />
                                                                    }
                                                                    label="Time"
                                                                    value={inferTimeRange(
                                                                        s.time
                                                                    )}
                                                                />
                                                                <LabeledRow
                                                                    icon={
                                                                        <Timer className="h-4 w-4" />
                                                                    }
                                                                    label="Therapist"
                                                                    value={safeText(
                                                                        s.therapistName
                                                                    )}
                                                                />
                                                                <LabeledRow
                                                                    icon={
                                                                        <ClipboardList className="h-4 w-4" />
                                                                    }
                                                                    label="Room / Meeting"
                                                                    value={safeText(
                                                                        s.therapyLocation
                                                                    )}
                                                                />
                                                                <LabeledRow
                                                                    icon={
                                                                        <CalendarIcon className="h-4 w-4" />
                                                                    }
                                                                    label="Current Status"
                                                                    value={
                                                                        <StatusBadge
                                                                            status={
                                                                                s.currentStatus
                                                                            }
                                                                        />
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="rounded-xl border p-4">
                                                                <div className="text-sm font-medium">
                                                                    Session
                                                                    objectives
                                                                </div>
                                                                <div className="mt-3 space-y-3">
                                                                    <LabeledRow
                                                                        icon={
                                                                            <Timer className="h-4 w-4" />
                                                                        }
                                                                        label="Long-term goal"
                                                                        value={safeText(
                                                                            s
                                                                                .sessionObjectives
                                                                                ?.longTermGoal
                                                                        )}
                                                                    />
                                                                    <LabeledRow
                                                                        icon={
                                                                            <Timer className="h-4 w-4" />
                                                                        }
                                                                        label="Short-term goal"
                                                                        value={safeText(
                                                                            s
                                                                                .sessionObjectives
                                                                                ?.shortTermGoal
                                                                        )}
                                                                    />
                                                                    <LabeledRow
                                                                        icon={
                                                                            <Timer className="h-4 w-4" />
                                                                        }
                                                                        label="Home program"
                                                                        value={safeText(
                                                                            s
                                                                                .sessionObjectives
                                                                                ?.homeProgram
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="rounded-xl border p-4">
                                                                <div className="text-sm font-medium">
                                                                    Planned
                                                                    activities
                                                                </div>
                                                                <div className="mt-3 space-y-3">
                                                                    {s
                                                                        .plannedActivities
                                                                        ?.length ? (
                                                                        s.plannedActivities.map(
                                                                            (
                                                                                a,
                                                                                idx
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        idx
                                                                                    }
                                                                                    className="rounded-lg border bg-background p-3"
                                                                                >
                                                                                    <div className="flex items-start justify-between gap-3">
                                                                                        <div className="min-w-0">
                                                                                            <div className="truncate text-sm font-medium">
                                                                                                {safeText(
                                                                                                    a.name
                                                                                                )}
                                                                                            </div>
                                                                                            <div className="mt-1 text-xs text-muted-foreground">
                                                                                                Objective:{" "}
                                                                                                {safeText(
                                                                                                    a.objective
                                                                                                )}
                                                                                            </div>
                                                                                            <div className="mt-2 text-xs text-muted-foreground">
                                                                                                Observation:{" "}
                                                                                                {safeText(
                                                                                                    a.observation
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )
                                                                    ) : (
                                                                        <div className="text-sm text-muted-foreground">
                                                                            —
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="rounded-xl border p-4">
                                                                <div className="text-sm font-medium">
                                                                    Notes for
                                                                    parents
                                                                </div>
                                                                <div className="mt-3 text-sm text-foreground">
                                                                    {safeText(
                                                                        s.notesForParents
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SheetContent>
                                                </Sheet>
                                            </CardHeader>

                                            <CardContent className="space-y-4">
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <LabeledRow
                                                        icon={
                                                            <CalendarIcon className="h-4 w-4" />
                                                        }
                                                        label="Therapy date"
                                                        value={
                                                            isValidISO(s.date)
                                                                ? formatDateShort(
                                                                      s.date as string
                                                                  )
                                                                : "—"
                                                        }
                                                    />
                                                    <LabeledRow
                                                        icon={
                                                            <Clock3 className="h-4 w-4" />
                                                        }
                                                        label="Time"
                                                        value={inferTimeRange(
                                                            s.time
                                                        )}
                                                    />
                                                    <LabeledRow
                                                        icon={
                                                            <Timer className="h-4 w-4" />
                                                        }
                                                        label="Therapist"
                                                        value={safeText(
                                                            s.therapistName
                                                        )}
                                                    />
                                                    <LabeledRow
                                                        icon={
                                                            <ClipboardList className="h-4 w-4" />
                                                        }
                                                        label="Location"
                                                        value={safeText(
                                                            s.therapyLocation
                                                        )}
                                                    />
                                                    <LabeledRow
                                                        icon={
                                                            <ClipboardList className="h-4 w-4" />
                                                        }
                                                        label="Session type"
                                                        value={"—"}
                                                    />
                                                    <LabeledRow
                                                        icon={
                                                            <Timer className="h-4 w-4" />
                                                        }
                                                        label="Duration"
                                                        value={"—"}
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                                                    <Sheet>
                                                        <SheetTrigger>
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                            >
                                                                View Details
                                                            </Button>
                                                        </SheetTrigger>
                                                        <SheetContent className="w-full sm:max-w-2xl">
                                                            <SheetHeader>
                                                                <SheetTitle>
                                                                    {
                                                                        s.therapyTitle
                                                                    }
                                                                </SheetTitle>
                                                                <SheetDescription>
                                                                    Session
                                                                    details for
                                                                    parents
                                                                </SheetDescription>
                                                            </SheetHeader>
                                                            <div className="mt-6 space-y-6">
                                                                <div className="space-y-3">
                                                                    <LabeledRow
                                                                        icon={
                                                                            <CalendarIcon className="h-4 w-4" />
                                                                        }
                                                                        label="Date"
                                                                        value={
                                                                            isValidISO(
                                                                                s.date
                                                                            )
                                                                                ? formatDateShort(
                                                                                      s.date as string
                                                                                  )
                                                                                : "—"
                                                                        }
                                                                    />
                                                                    <LabeledRow
                                                                        icon={
                                                                            <Clock3 className="h-4 w-4" />
                                                                        }
                                                                        label="Time"
                                                                        value={inferTimeRange(
                                                                            s.time
                                                                        )}
                                                                    />
                                                                    <LabeledRow
                                                                        icon={
                                                                            <Timer className="h-4 w-4" />
                                                                        }
                                                                        label="Therapist"
                                                                        value={safeText(
                                                                            s.therapistName
                                                                        )}
                                                                    />
                                                                    <LabeledRow
                                                                        icon={
                                                                            <ClipboardList className="h-4 w-4" />
                                                                        }
                                                                        label="Room / Meeting"
                                                                        value={safeText(
                                                                            s.therapyLocation
                                                                        )}
                                                                    />
                                                                    <LabeledRow
                                                                        icon={
                                                                            <CalendarIcon className="h-4 w-4" />
                                                                        }
                                                                        label="Current Status"
                                                                        value={
                                                                            <StatusBadge
                                                                                status={
                                                                                    s.currentStatus
                                                                                }
                                                                            />
                                                                        }
                                                                    />
                                                                </div>

                                                                <div className="rounded-xl border p-4">
                                                                    <div className="text-sm font-medium">
                                                                        Session
                                                                        objectives
                                                                    </div>
                                                                    <div className="mt-3 space-y-3">
                                                                        <LabeledRow
                                                                            icon={
                                                                                <Timer className="h-4 w-4" />
                                                                            }
                                                                            label="Long-term goal"
                                                                            value={safeText(
                                                                                s
                                                                                    .sessionObjectives
                                                                                    ?.longTermGoal
                                                                            )}
                                                                        />
                                                                        <LabeledRow
                                                                            icon={
                                                                                <Timer className="h-4 w-4" />
                                                                            }
                                                                            label="Short-term goal"
                                                                            value={safeText(
                                                                                s
                                                                                    .sessionObjectives
                                                                                    ?.shortTermGoal
                                                                            )}
                                                                        />
                                                                        <LabeledRow
                                                                            icon={
                                                                                <Timer className="h-4 w-4" />
                                                                            }
                                                                            label="Home program"
                                                                            value={safeText(
                                                                                s
                                                                                    .sessionObjectives
                                                                                    ?.homeProgram
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="rounded-xl border p-4">
                                                                    <div className="text-sm font-medium">
                                                                        Planned
                                                                        activities
                                                                    </div>
                                                                    <div className="mt-3 space-y-3">
                                                                        {s
                                                                            .plannedActivities
                                                                            ?.length ? (
                                                                            s.plannedActivities.map(
                                                                                (
                                                                                    a,
                                                                                    idx
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            idx
                                                                                        }
                                                                                        className="rounded-lg border bg-background p-3"
                                                                                    >
                                                                                        <div className="text-sm font-medium">
                                                                                            {safeText(
                                                                                                a.name
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="mt-1 text-xs text-muted-foreground">
                                                                                            Objective:{" "}
                                                                                            {safeText(
                                                                                                a.objective
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="mt-2 text-xs text-muted-foreground">
                                                                                            Observation:{" "}
                                                                                            {safeText(
                                                                                                a.observation
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            )
                                                                        ) : (
                                                                            <div className="text-sm text-muted-foreground">
                                                                                —
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="rounded-xl border p-4">
                                                                    <div className="text-sm font-medium">
                                                                        Notes
                                                                        for
                                                                        parents
                                                                    </div>
                                                                    <div className="mt-3 text-sm text-foreground">
                                                                        {safeText(
                                                                            s.notesForParents
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </SheetContent>
                                                    </Sheet>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled
                                                    >
                                                        Add to Calendar
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
