import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";
import { ClipboardCheck, Home, NotebookPen, Target, Timer } from "lucide-react";

interface Activity {
    id: number;
    activity_name: string;
    objective?: string | null;
    score?: number | null;
    observation?: string | null;
}

interface Evaluation {
    listening?: number | null;
    speech?: number | null;
    language?: number | null;
    attention?: number | null;
    recommendation?: string | null;
}

interface LingSixSound {
    sound: string;
    level: number | boolean;
    note: string;
}

interface HomeProgram {
    title: string;
    instruction: string;
    frequency: string;
}

interface LessonPlan {
    id: number;
    session_date: string;
    session_number: number;
    long_term_goal?: string | null;
    short_term_goal?: string | null;

    home_program?: HomeProgram[];

    therapist_note?: string | null;
    status: string;

    activities?: Activity[];
    evaluation?: Evaluation | null;
}

interface Props {
    lessonPlan: LessonPlan;
}

const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
};

function SectionTitle({
    icon: Icon,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    children: ReactNode;
}) {
    return (
        <div className="mb-4 flex items-center gap-2">
            <Icon className="h-5 w-5 text-sky-600" />
            <h3 className="font-semibold">{children}</h3>
        </div>
    );
}

function TherapyGoalCard({ lessonPlan }: { lessonPlan: LessonPlan }) {
    return (
        <Card className="transition-all hover:border-slate-200">
            <CardContent className="p-4">
                <SectionTitle icon={Target}>Target Terapi</SectionTitle>

                <div className="space-y-4">
                    <div>
                        <p className="text-xs uppercase text-muted-foreground">
                            Long Term Goal
                        </p>
                        <p className="mt-1">
                            {lessonPlan.long_term_goal || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs uppercase text-muted-foreground">
                            Short Term Goal
                        </p>
                        <p className="mt-1">
                            {lessonPlan.short_term_goal || "-"}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ActivityTimeline({ lessonPlan }: { lessonPlan: LessonPlan }) {
    return (
        <Card className="transition-all hover:border-slate-200">
            <CardContent className="p-4">
                <SectionTitle icon={Timer}>Aktivitas Terapi</SectionTitle>

                {lessonPlan.activities?.length ? (
                    <div className="space-y-3">
                        {lessonPlan.activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="group rounded-xl bg-muted/40 p-5 transition-all hover:bg-muted"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="font-medium">
                                        {activity.activity_name}
                                    </div>

                                    <div className="rounded-lg bg-background/60 px-3 py-1 text-xs text-muted-foreground ring-1 ring-border/50 transition-all group-hover:bg-background">
                                        Skor:{" "}
                                        <span className="font-semibold text-foreground">
                                            {activity.score ?? "-"}
                                        </span>
                                    </div>
                                </div>

                                {activity.objective && (
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        {activity.objective}
                                    </div>
                                )}

                                {activity.observation && (
                                    <div className="mt-2 text-sm">
                                        {activity.observation}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">
                        Belum ada aktivitas.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function TherapistNoteCard({ lessonPlan }: { lessonPlan: LessonPlan }) {
    return (
        <Card className="transition-all hover:border-slate-200">
            <CardContent className="p-4">
                <SectionTitle icon={NotebookPen}>Catatan Terapis</SectionTitle>

                <p className="whitespace-pre-line text-sm text-foreground/90">
                    {lessonPlan.therapist_note || "-"}
                </p>
            </CardContent>
        </Card>
    );
}

function EvaluationCard({ lessonPlan }: { lessonPlan: LessonPlan }) {
    return (
        <Card className="transition-all hover:border-slate-200">
            <CardContent className="p-4">
                <SectionTitle icon={ClipboardCheck}>Evaluasi</SectionTitle>

                {lessonPlan.evaluation ? (
                    <>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                ["Listening", lessonPlan.evaluation.listening],
                                ["Speech", lessonPlan.evaluation.speech],
                                ["Language", lessonPlan.evaluation.language],
                                ["Attention", lessonPlan.evaluation.attention],
                            ].map(([label, value]) => (
                                <div
                                    key={String(label)}
                                    className="rounded-xl bg-muted/40 p-4 text-center transition-all hover:bg-muted"
                                >
                                    <div className="text-xs text-muted-foreground">
                                        {label}
                                    </div>
                                    <div className="mt-2 text-2xl font-bold">
                                        {value ?? "-"}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {lessonPlan.evaluation.recommendation && (
                            <div className="mt-4 rounded-lg bg-muted p-4">
                                <div className="text-xs text-muted-foreground">
                                    Rekomendasi
                                </div>
                                <div className="mt-2">
                                    {lessonPlan.evaluation.recommendation}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-muted-foreground">Belum ada evaluasi.</p>
                )}
            </CardContent>
        </Card>
    );
}

function HomeProgramCard({ lessonPlan }: { lessonPlan: LessonPlan }) {
    return (
        <Card className="transition-all hover:border-slate-200">
            <CardContent className="p-4">
                <SectionTitle icon={Home}>Home Program</SectionTitle>

                {lessonPlan.home_program?.length ? (
                    <div className="space-y-3">
                        {lessonPlan.home_program.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-lg border p-3 transition-all hover:border-slate-300"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <h4 className="font-semibold">
                                        {item.title}
                                    </h4>
                                    <Badge
                                        variant="secondary"
                                        className="shrink-0"
                                    >
                                        {item.frequency}
                                    </Badge>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {item.instruction}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">
                        Tidak ada home program.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function LessonPlanHeader({ lessonPlan }: { lessonPlan: LessonPlan }) {
    const isCompleted = lessonPlan.status === "completed";

    return (
        <div className="rounded-2xl border bg-gradient-to-br from-sky-50 via-background to-background p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                            {formatDate(lessonPlan.session_date)}
                        </p>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight">
                        Sesi {lessonPlan.session_number}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Detail Lesson Plan Terapi AVT
                    </p>
                </div>

                <Badge
                    className="w-fit px-4 py-2 text-sm capitalize transition-all"
                    variant={isCompleted ? "default" : "secondary"}
                >
                    {lessonPlan.status}
                </Badge>
            </div>
        </div>
    );
}

export default function LessonPlanCard({ lessonPlan }: Props) {
    return (
        <Card className="rounded-2xl border shadow-sm">
            <CardContent className="p-6">
                {/* Header (full width) */}
                <LessonPlanHeader lessonPlan={lessonPlan} />

                {/* Main layout */}
                <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
                    {/* LEFT */}
                    <div className="flex w-full flex-col space-y-6 lg:w-1/2">
                        <TherapyGoalCard lessonPlan={lessonPlan} />
                        <ActivityTimeline lessonPlan={lessonPlan} />
                        {/* Catatan Terapis must be tepat di bawah Aktivitas Terapi */}
                        <TherapistNoteCard lessonPlan={lessonPlan} />
                    </div>

                    {/* RIGHT */}
                    <div className="flex w-full flex-col space-y-6 lg:w-1/2">
                        <EvaluationCard lessonPlan={lessonPlan} />
                        <HomeProgramCard lessonPlan={lessonPlan} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
