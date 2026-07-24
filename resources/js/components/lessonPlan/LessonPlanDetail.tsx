import { Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Calendar,
    ClipboardCheck,
    Ear,
    FileText,
    Target,
    User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { LessonPlan } from "@/types/lessonPlan";

interface Props {
    lessonPlan: LessonPlan;
}

const SCORE = ["-", "1", "2", "3", "4", "5"];

export default function LessonPlanDetail({ lessonPlan }: Props) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Detail Sesi</h1>

                    <p className="text-muted-foreground">
                        Informasi lengkap hasil sesi terapi.
                    </p>
                </div>

                <Button asChild variant="outline">
                    <Link href={route("lesson-plans.index")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Link>
                </Button>
            </div>
            {/* Informasi */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informasi Sesi
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Info
                        label="Pasien"
                        value={lessonPlan.schedule?.patient?.name}
                    />

                    <Info
                        label="Terapis"
                        value={lessonPlan.schedule?.status ?? "-"}
                    />

                    <Info label="Tanggal" value={lessonPlan.session_date} />

                    <Info
                        label="Sesi"
                        value={`Sesi ${lessonPlan.session_number}`}
                    />

                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>

                        <Badge>{lessonPlan.status}</Badge>
                    </div>
                </CardContent>
            </Card>
            {/* Goal */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2 items-center">
                            <Target className="h-5 w-5" />
                            Long Term Goal
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {lessonPlan.long_term_goal || "-"}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2 items-center">
                            <Target className="h-5 w-5" />
                            Short Term Goal
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {lessonPlan.short_term_goal || "-"}
                    </CardContent>
                </Card>
            </div>
            {/* Home Program */}
            <Card>
                <CardHeader>
                    <CardTitle>Home Program</CardTitle>
                </CardHeader>

                <CardContent>
                    {(() => {
                        const raw = lessonPlan.home_program as unknown;
                        const homePrograms: import("@/types/lessonPlan").HomeExercise[] =
                            Array.isArray(raw)
                                ? raw
                                : typeof raw === "string"
                                ? raw
                                      .split("\n")
                                      .map((line: string) => line.trim())
                                      .filter(Boolean)
                                      .map((title: string) => ({
                                          title,
                                          instruction: "",
                                          frequency: "",
                                      }))
                                : [];

                        return homePrograms.length ? (
                            <div className="space-y-4">
                                {homePrograms.map(
                                    (
                                        item: import("@/types/lessonPlan").HomeExercise,
                                        i: number
                                    ) => (
                                        <div key={i}>
                                            <p className="font-medium">
                                                {item.title}
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                {item.instruction}
                                            </p>

                                            <Badge className="mt-2">
                                                {item.frequency}
                                            </Badge>

                                            {i !== homePrograms.length - 1 && (
                                                <Separator className="mt-4" />
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">
                                Tidak ada Home Program.
                            </p>
                        );
                    })()}
                </CardContent>
            </Card>
            {/* Aktivitas */}
            <Card>
                <CardHeader>
                    <CardTitle>Aktivitas Terapi</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        {lessonPlan.activities?.map((activity) => (
                            <div
                                key={activity.id}
                                className="rounded-lg border p-4"
                            >
                                <h3 className="font-semibold">
                                    {activity.activity_name}
                                </h3>

                                <p className="text-sm mt-1">
                                    {activity.objective}
                                </p>

                                <div className="mt-3 flex gap-3">
                                    <Badge variant="secondary">
                                        Skor : {activity.score ?? "-"}
                                    </Badge>
                                </div>

                                {activity.observation && (
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        {activity.observation}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            {/* Ling */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Ear className="h-5 w-5" />
                        Ling Six Sound
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {lessonPlan.ling_six_sounds?.map((sound) => (
                            <Card key={sound.sound}>
                                <CardContent className="p-4 text-center">
                                    <div className="text-3xl font-bold">
                                        /{sound.sound}/
                                    </div>

                                    <Badge className="mt-3">
                                        Level {sound.level}
                                    </Badge>

                                    {sound.note && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {sound.note}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
            {/* Evaluasi */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex gap-2 items-center">
                        <ClipboardCheck className="h-5 w-5" />
                        Evaluasi
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Info
                        label="Listening"
                        value={lessonPlan.evaluation?.listening}
                    />

                    <Info
                        label="Speech"
                        value={lessonPlan.evaluation?.speech}
                    />

                    <Info
                        label="Language"
                        value={lessonPlan.evaluation?.language}
                    />

                    <Info
                        label="Attention"
                        value={lessonPlan.evaluation?.attention}
                    />

                    <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground mb-2">
                            Recommendation
                        </p>

                        <p>{lessonPlan.evaluation?.recommendation || "-"}</p>
                    </div>
                </CardContent>
            </Card>
            {/* Catatan */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex gap-2 items-center">
                        <FileText className="h-5 w-5" />
                        Catatan Terapis
                    </CardTitle>
                </CardHeader>

                <CardContent>{lessonPlan.therapist_note || "-"}</CardContent>
            </Card>
        </div>
    );
}

function Info({
    label,
    value,
}: {
    label: string;
    value?: string | number | null;
}) {
    return (
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>

            <p className="font-medium">{value || "-"}</p>
        </div>
    );
}
