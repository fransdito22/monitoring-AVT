import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ResponsiveContainer,
    LineChart as RechartLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

import {
    ArrowLeft,
    Calendar,
    FileText,
    Home,
    ClipboardList,
    Activity,
    Ear,
    Brain,
    MessageSquareText,
    LineChart,
} from "lucide-react";

type LingKey = "m" | "u" | "i" | "a" | "sh" | "s";

type Patient = {
    id: number;
    name: string;
    photo: string | null;
    status: string;
    progress: number;
};

type LessonActivity = {
    id: number;
    activity_name: string;
    objective: string;
    score: number | null;
    observation: string | null;
};

type LessonEvaluation = {
    listening: number;
    speech: number;
    language: number;
    attention: number;
    recommendation: string | null;
};

type LingSixSoundResult = {
    id: number;
    sound: LingKey;
    level: number;
    note: string | null;
};

type LessonPlan = {
    id: number;
    session_date: string;
    session_number: number;
    long_term_goal: string;
    short_term_goal: string;
    home_program: string | null;
    therapist_note: string | null;
    patient: Patient;
    activities: LessonActivity[];
    evaluation: LessonEvaluation | null;
    lingSixSounds: LingSixSoundResult[];
};

type LingChartData = {
    session: string;
    avg_level: number;
    date: string;
};

type EvaluationChartData = {
    session: string;
    listening: number;
    speech: number;
    language: number;
    attention: number;
    date: string;
};

interface Props {
    lessonPlan: LessonPlan;
    lingChartData: LingChartData[];
    evaluationChartData: EvaluationChartData[];
}

export default function DetailReports({
    lessonPlan,
    lingChartData,
    evaluationChartData,
}: Props) {
    const levelLabel = (level: number) => {
        const map: Record<number, string> = {
            0: "not detected",
            1: "detected",
            2: "discriminated",
            3: "identified",
            4: "comprehended",
        };
        return map[level] ?? String(level);
    };

    const soundLabel = (sound: string) => {
        const map: Record<string, string> = {
            m: "m",
            u: "u",
            i: "i",
            a: "a",
            sh: "sh",
            s: "s",
        };
        return map[sound] ?? sound;
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold">
                        Detail Lesson Plan
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {lessonPlan.patient?.name}
                    </p>
                </div>
            }
        >
            <Head title={`Lesson Plan #${lessonPlan.session_number}`} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <Link href={route("lesson-plans.index")}>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                {/* Patient summary */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    {lessonPlan.patient?.photo ? (
                                        <img
                                            src={`/storage/${lessonPlan.patient.photo}`}
                                            alt={lessonPlan.patient.name}
                                            className="h-16 w-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-primary">
                                            {lessonPlan.patient?.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {lessonPlan.patient?.name}
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Status: {lessonPlan.patient?.status}
                                    </p>
                                </div>
                            </div>

                            <div className="text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(
                                        lessonPlan.session_date
                                    ).toLocaleDateString("id-ID")}
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Sesi #{lessonPlan.session_number}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Objectives */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5" />
                                Long Term Goal
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                {lessonPlan.long_term_goal || "-"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="h-5 w-5" />
                                Short Term Goal
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                {lessonPlan.short_term_goal || "-"}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Activities */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Activities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lessonPlan.activities?.length ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kegiatan</TableHead>
                                        <TableHead>Objective</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Observation</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lessonPlan.activities.map((a) => (
                                        <TableRow key={a.id}>
                                            <TableCell>
                                                {a.activity_name}
                                            </TableCell>
                                            <TableCell>{a.objective}</TableCell>
                                            <TableCell>
                                                {a.score ?? "-"}
                                            </TableCell>
                                            <TableCell>
                                                {a.observation ?? "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Tidak ada activities.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Ling Six Sound */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Ear className="h-5 w-5" />
                            Ling Six Sound
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lessonPlan.lingSixSounds?.length ? (
                            <div className="grid gap-3 md:grid-cols-2">
                                {lessonPlan.lingSixSounds.map((s) => (
                                    <div
                                        key={s.id}
                                        className="rounded-lg border p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-semibold">
                                                Sound {soundLabel(s.sound)}
                                            </div>
                                            <Badge variant="outline">
                                                Level {s.level}
                                            </Badge>
                                        </div>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            {levelLabel(s.level)}
                                        </div>
                                        {s.note ? (
                                            <div className="mt-2 text-sm">
                                                <span className="font-medium">
                                                    Note:
                                                </span>
                                                {s.note}
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Tidak ada data Ling Six Sound.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Grafik Perkembangan Ling Six */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LineChart className="h-5 w-5" />
                            Grafik Perkembangan Ling Six Sound
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lingChartData?.length ? (
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartLineChart data={lingChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="session" />
                                        <YAxis domain={[0, 4]} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="avg_level"
                                            stroke="#2563eb"
                                            strokeWidth={3}
                                            name="Rata-rata Level Ling"
                                        />
                                    </RechartLineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Belum ada data grafik Ling Six Sound.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Grafik Perkembangan Evaluasi */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LineChart className="h-5 w-5" />
                            Grafik Perkembangan Evaluasi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {evaluationChartData?.length ? (
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartLineChart
                                        data={evaluationChartData}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="session" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="listening"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                            name="Listening"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="speech"
                                            stroke="#16a34a"
                                            strokeWidth={2}
                                            name="Speech"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="language"
                                            stroke="#f59e0b"
                                            strokeWidth={2}
                                            name="Language"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="attention"
                                            stroke="#7c3aed"
                                            strokeWidth={2}
                                            name="Attention"
                                        />
                                    </RechartLineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Belum ada data grafik evaluasi.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Evaluation */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquareText className="h-5 w-5" />
                            Evaluation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lessonPlan.evaluation ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-lg border p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Listening
                                    </div>
                                    <div className="mt-1 text-2xl font-bold">
                                        {lessonPlan.evaluation.listening}
                                    </div>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Speech
                                    </div>
                                    <div className="mt-1 text-2xl font-bold">
                                        {lessonPlan.evaluation.speech}
                                    </div>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Language
                                    </div>
                                    <div className="mt-1 text-2xl font-bold">
                                        {lessonPlan.evaluation.language}
                                    </div>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Attention
                                    </div>
                                    <div className="mt-1 text-2xl font-bold">
                                        {lessonPlan.evaluation.attention}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <div className="mt-2 rounded-lg border p-4">
                                        <div className="text-sm font-semibold">
                                            Recommendation
                                        </div>
                                        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                                            {lessonPlan.evaluation
                                                .recommendation || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Tidak ada evaluation.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Home program + therapist note */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Home className="h-5 w-5" />
                                Home Program
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                {lessonPlan.home_program || "-"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquareText className="h-5 w-5" />
                                Therapist Note
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                {lessonPlan.therapist_note || "-"}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
