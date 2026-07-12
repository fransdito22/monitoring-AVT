import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/dashboard/EmptyState";
import { CalendarDays, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type NextLessonPlanCardPayload = {
    lesson_plan_pending: boolean;
    schedule: {
        id: number;
        date: string;
        time: string;
        status: string;
        notes?: string | null;
        patient: {
            id: number;
            name: string;
            photo?: string | null;
        } | null;
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

type NextLessonPlanCardProps = {
    nextItem: NextLessonPlanCardPayload | null;
};

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID");
}

export function NextLessonPlanCard({ nextItem }: NextLessonPlanCardProps) {
    return (
        <Card className="rounded-xl shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-base font-semibold">
                            Next Lesson Plan
                        </CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Jadwal berikutnya untuk sesi lesson plan.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border bg-muted/30 px-3 py-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">
                            Queue
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {!nextItem ? (
                    <EmptyState
                        icon={<PlayCircle className="h-5 w-5" />}
                        title="Belum ada lesson plan berikutnya."
                        description="Saat ini tidak ada jadwal lesson plan yang dapat dimulai."
                    />
                ) : nextItem.lesson_plan_pending ? (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium">
                                    {nextItem.schedule.patient?.name ?? "—"}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {formatDate(nextItem.schedule.date)} •{" "}
                                    {nextItem.schedule.time}
                                </p>
                            </div>

                            <span className="rounded-full border bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
                                Menunggu Lesson Plan
                            </span>
                        </div>

                        {nextItem.schedule.notes ? (
                            <p className="text-sm text-muted-foreground">
                                Catatan: {nextItem.schedule.notes}
                            </p>
                        ) : null}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium">
                                    {nextItem.schedule.patient?.name ?? "—"}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {formatDate(nextItem.schedule.date)} •{" "}
                                    {nextItem.schedule.time}
                                </p>
                            </div>

                            <span className="rounded-full border bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
                                Lesson Plan Ready
                            </span>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                Sesi ke-
                                {nextItem.lessonPlan?.session_number ?? "—"}
                            </p>
                            {nextItem.lessonPlan?.therapist_note ? (
                                <p className="text-sm text-muted-foreground">
                                    Catatan Terapis:{" "}
                                    {nextItem.lessonPlan.therapist_note}
                                </p>
                            ) : null}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
