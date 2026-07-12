import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { LingSound } from "@/types/lessonPlan";
import type { TherapyLessonPlan } from "@/types/therapy";

type Props = {
    lessonPlans: TherapyLessonPlan[];
};

type LingSoundLevelRaw = number | boolean | null | undefined;

type LingSixSoundHistoryRow = {
    session: string; // "S1", "S2", ...
    m: number | null;
    u: number | null;
    a: number | null;
    i: number | null;
    sh: number | null;
    s: number | null;
};

const COLORS: Record<"m" | "u" | "a" | "i" | "sh" | "s", string> = {
    m: "#2563eb",
    u: "#16a34a",
    a: "#f59e0b",
    i: "#7c3aed",
    sh: "#db2777",
    s: "#0ea5e9",
};

const LABELS: Record<"m" | "u" | "a" | "i" | "sh" | "s", string> = {
    m: "/m/",
    u: "/u/",
    a: "/a/",
    i: "/i/",
    sh: "/sh/",
    s: "/s/",
};

function mapLevel(level: LingSoundLevelRaw): number | null {
    if (level == null) return null;
    if (typeof level === "boolean") return level ? 1 : 0;
    if (typeof level === "number") return level;
    return null;
}
function toHistory(
    lessonPlans: TherapyLessonPlan[] | null | undefined
): LingSixSoundHistoryRow[] {
    type SoundRow = {
        sound: string;
        level: LingSoundLevelRaw;
    };

    type LessonPlanWithLing = TherapyLessonPlan & {
        session_number?: number | null;
        tanggal?: string | null;
        session_date?: string | null;

        lingSixSounds?: SoundRow[] | null;
        ling_six_sounds?: SoundRow[] | null;
    };

    const list = (lessonPlans ?? [])
        .map((lp) => lp as LessonPlanWithLing)
        .filter((lp) => {
            const hasSessionNumber = typeof lp.session_number === "number";
            const hasTanggal = typeof lp.tanggal === "string" && lp.tanggal;
            const hasSessionDate =
                typeof lp.session_date === "string" && lp.session_date;
            return hasSessionNumber || hasTanggal || hasSessionDate;
        });

    // Sort deterministically for fallback session numbering
    list.sort((a, b) => {
        const na =
            typeof a.session_number === "number"
                ? a.session_number
                : Number.NaN;
        const nb =
            typeof b.session_number === "number"
                ? b.session_number
                : Number.NaN;

        if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;

        const da = new Date(a.tanggal ?? a.session_date ?? "").getTime();
        const db = new Date(b.tanggal ?? b.session_date ?? "").getTime();

        if (Number.isFinite(da) && Number.isFinite(db)) return da - db;
        if (Number.isFinite(da)) return -1;
        if (Number.isFinite(db)) return 1;
        return 0;
    });

    const soundsFor = (lp: LessonPlanWithLing): SoundRow[] => {
        return lp.lingSixSounds ?? lp.ling_six_sounds ?? [];
    };

    const get = (sounds: SoundRow[], match: string): number | null => {
        const found = sounds.find((s) => s.sound === match);
        return mapLevel(found?.level ?? null);
    };

    return list.map((lp, idx) => {
        const sessionNumber =
            typeof lp.session_number === "number" ? lp.session_number : idx + 1;
        const sounds = soundsFor(lp);

        return {
            session: `S${sessionNumber}`,
            m: get(sounds, "m"),
            u: get(sounds, "u"),
            a: get(sounds, "a"),
            i: get(sounds, "i"),
            sh: get(sounds, "sh"),
            s: get(sounds, "s"),
        };
    });
}

export default function LingSixSoundChart({ lessonPlans }: Props) {
    const history = toHistory(lessonPlans);

    if (history.length === 0) {
        return (
            <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">
                        Ling Six Sound Assessment
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        No Ling Six Sound history available.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader>
                <CardTitle className="text-base">
                    Ling Six Sound Assessment
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={history}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                            />
                            <XAxis dataKey="session" />
                            <YAxis domain={[0, 2]} ticks={[0, 1, 2]} />
                            <Legend />

                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (
                                        !active ||
                                        !payload ||
                                        payload.length === 0
                                    )
                                        return null;

                                    const sessionLabel =
                                        typeof label === "string" ? label : "";

                                    const getStatus = (
                                        value: number | null
                                    ) => {
                                        if (value === null)
                                            return "Data tidak tersedia";
                                        return value === 1
                                            ? "Detected"
                                            : "Not Detected";
                                    };

                                    const points: Array<{
                                        key: keyof typeof COLORS;
                                        value: number | null;
                                    }> = (
                                        [
                                            ["m", "m"],
                                            ["u", "u"],
                                            ["a", "a"],
                                            ["i", "i"],
                                            ["sh", "sh"],
                                            ["s", "s"],
                                        ] as const
                                    ).map(([key]) => {
                                        const found = payload.find(
                                            (p) => p.name === key
                                        );

                                        const raw = found?.value;
                                        const value =
                                            typeof raw === "number"
                                                ? raw
                                                : null;

                                        return { key, value };
                                    });

                                    return (
                                        <div className="max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                                            <div className="text-sm font-semibold text-slate-900">
                                                {sessionLabel}
                                            </div>

                                            <div className="mt-2 space-y-1">
                                                {points.map((p) => (
                                                    <div
                                                        key={p.key}
                                                        className="text-sm text-slate-700"
                                                    >
                                                        <div className="font-medium">
                                                            {LABELS[p.key]}
                                                        </div>
                                                        <div>
                                                            Nilai:{" "}
                                                            <span className="font-semibold">
                                                                {p.value ===
                                                                null
                                                                    ? "-"
                                                                    : p.value}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            Status:{" "}
                                                            <span className="font-semibold">
                                                                {getStatus(
                                                                    p.value
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="m"
                                name="m"
                                stroke={COLORS.m}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                connectNulls
                            />
                            <Line
                                type="monotone"
                                dataKey="u"
                                name="u"
                                stroke={COLORS.u}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                connectNulls
                            />
                            <Line
                                type="monotone"
                                dataKey="a"
                                name="a"
                                stroke={COLORS.a}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                connectNulls
                            />
                            <Line
                                type="monotone"
                                dataKey="i"
                                name="i"
                                stroke={COLORS.i}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                connectNulls
                            />
                            <Line
                                type="monotone"
                                dataKey="sh"
                                name="sh"
                                stroke={COLORS.sh}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                connectNulls
                            />
                            <Line
                                type="monotone"
                                dataKey="s"
                                name="s"
                                stroke={COLORS.s}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                connectNulls
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
