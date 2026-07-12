import { Card, CardContent } from "@/components/ui/card";

import { Clock3 } from "lucide-react";

import type { TherapyTimelineEvent } from "@/types/therapy";

function sortByDate(events: TherapyTimelineEvent[]) {
    return [...events].sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0;
        const db = b.date ? new Date(b.date).getTime() : 0;
        return da - db;
    });
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toSafeDetailString(value: unknown): string | null {
    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
        return String(value);
    }

    if (typeof value === "boolean") {
        return value ? "Ya" : "Tidak";
    }

    return null;
}

function getTimelineSummary(meta: unknown): string {
    if (!isRecord(meta)) return "Tidak ada detail.";

    // 1) Field yang secara konseptual mungkin jadi "detail" pada meta event
    const candidates = [
        "summary",
        "description",
        "objective",
        "observation",
        "notes",
        "message",
        "title",
        "activity_name",
    ] as const;

    for (const key of candidates) {
        const safe = toSafeDetailString((meta as Record<string, unknown>)[key]);
        if (safe !== null) return safe;
    }

    // 2) Fallback sesuai bentuk meta dari backend (TherapyService::buildTimeline)
    //    - lesson_plan: session_number, id
    //    - lesson_plan_updated: id
    //    - report: progress, id
    const sessionNumber = toSafeDetailString(meta.session_number);
    if (sessionNumber !== null) return `Sesi ${sessionNumber}`;

    const progress = toSafeDetailString(meta.progress);
    if (progress !== null) return `Progress: ${progress}%`;

    const id = toSafeDetailString(meta.id);
    if (id !== null) return `Detail #${id}`;

    return "Tidak ada detail.";
}

export function TherapyTimeline({
    events,
}: {
    events: TherapyTimelineEvent[];
}) {
    const sorted = sortByDate(events);

    if (sorted.length === 0) {
        return (
            <Card className="rounded-2xl border-slate-200 bg-slate-50 shadow-sm">
                <CardContent className="p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                        <Clock3 className="h-5 w-5" />
                    </div>
                    <div className="mt-4 text-base font-semibold text-slate-900">
                        Belum ada timeline
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                        Data Lesson Plan dan Tes Artikulasi akan muncul di sini.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="relative rounded-2xl border border-slate-200 bg-white p-4">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />

            <div className="space-y-4">
                {sorted.map((e, idx) => (
                    <div
                        key={`${e.type}-${e.label}-${idx}`}
                        className="relative flex gap-4"
                    >
                        <div className="mt-1 flex w-24 items-start justify-center">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                                <div className="h-2 w-2 rounded-full bg-sky-500" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">
                                        {e.label}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {e.type}
                                    </div>
                                </div>
                                <div className="text-xs font-medium text-slate-700">
                                    {e.date ?? "-"}
                                </div>
                            </div>

                            {e.meta && typeof e.meta === "object" ? (
                                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                    {getTimelineSummary(e.meta)}
                                </div>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
