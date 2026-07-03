import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { useMemo, useState } from "react";

import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type LingKey = "m" | "u" | "i" | "a" | "sh" | "s";

type ActivityRow = {
    activity_name: string;
    objective: string;
    score: string;
    observation: string;
};

type Evaluation = {
    listening: number;
    speech: number;
    language: number;
    attention: number;
    recommendation: string;
};

interface SchedulePatient {
    id: number;
    name: string;
    photo: string | null;
    progress: number;
    status: string;
    therapist_id?: number;
}

interface ScheduleOption {
    id: number;
    schedule_date: string;
    schedule_time: string;
    status: string;
    notes?: string | null;
    patient: SchedulePatient;
}

interface Props {
    schedules: ScheduleOption[];
}

export default function CreateLessonPlan({ schedules }: Props) {
    const [scheduleId, setScheduleId] = useState<number | "">(
        schedules[0]?.id ?? ""
    );

    const [sessionDate, setSessionDate] = useState(() => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    });

    const [sessionNumber, setSessionNumber] = useState<number>(1);

    const [longTermGoal, setLongTermGoal] = useState("");
    const [shortTermGoal, setShortTermGoal] = useState("");

    const lingKeys: LingKey[] = useMemo(
        () => ["m", "u", "i", "a", "sh", "s"],
        []
    );

    const [ling, setLing] = useState<Record<LingKey, number>>({
        m: 0,
        u: 0,
        i: 0,
        a: 0,
        sh: 0,
        s: 0,
    });

    const [activities, setActivities] = useState<ActivityRow[]>([
        {
            activity_name: "",
            objective: "",
            score: "",
            observation: "",
        },
    ]);

    const [evaluation, setEvaluation] = useState<Evaluation>({
        listening: 0,
        speech: 0,
        language: 0,
        attention: 0,
        recommendation: "",
    });

    const [homeProgram, setHomeProgram] = useState("");
    const [therapistNote, setTherapistNote] = useState("");

    const selectedSchedule = useMemo(() => {
        if (scheduleId === "") return null;
        return schedules.find((s) => s.id === scheduleId) ?? null;
    }, [scheduleId, schedules]);

    const selectedPatient = selectedSchedule?.patient ?? null;

    const addActivity = () => {
        setActivities([
            ...activities,
            {
                activity_name: "",
                objective: "",
                score: "",
                observation: "",
            },
        ]);
    };

    const removeActivity = (index: number) => {
        setActivities(activities.filter((_, i) => i !== index));
    };

    const updateActivity = (
        index: number,
        field: keyof ActivityRow,
        value: string
    ) => {
        setActivities((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const handleSubmit = () => {
        router.post(route("lesson-plans.store"), {
            schedule_id: scheduleId,
            session_date: sessionDate,
            session_number: sessionNumber,
            long_term_goal: longTermGoal,
            short_term_goal: shortTermGoal,
            home_program: homeProgram,
            therapist_note: therapistNote,
            ling,
            activities: activities.map((a) => ({
                activity_name: a.activity_name,
                objective: a.objective,
                score: a.score ? Number(a.score) : null,
                observation: a.observation ? a.observation : null,
            })),
            evaluation: {
                listening: evaluation.listening,
                speech: evaluation.speech,
                language: evaluation.language,
                attention: evaluation.attention,
                recommendation: evaluation.recommendation,
            },
        });
    };

    const levelLabel = (level: number) => {
        const map: Record<number, string> = {
            0: "no response",
            1: "correct response",
            2: "detection",
        };
        return map[level] ?? String(level);
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold">
                        Lesson Plan Create
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Buat rancangan terapi untuk sesi pasien
                    </p>
                </div>
            }
        >
            <Head title="Lesson Plan Create" />

            <div className="space-y-6">
                {/* Top actions */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                </div>

                {/* Patient Select */}
                <Card>
                    <CardHeader>
                        <CardTitle>Schedule Select</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm">
                                    Pilih jadwal
                                </label>
                                <select
                                    required
                                    className="w-full rounded-md border p-2"
                                    value={scheduleId}
                                    onChange={(e) =>
                                        setScheduleId(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : ""
                                        )
                                    }
                                >
                                    {schedules.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.patient.name} - {s.schedule_date}{" "}
                                            {s.schedule_time}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                    {selectedPatient?.photo ? (
                                        <img
                                            src={`/storage/${selectedPatient.photo}`}
                                            alt={selectedPatient.name}
                                            className="h-14 w-14 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-lg font-bold">
                                            {selectedPatient?.name?.charAt(0) ??
                                                "-"}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <div className="font-medium">
                                        {selectedPatient?.name ?? ""}
                                    </div>
                                    <div className="mt-1 flex gap-2">
                                        {selectedPatient ? (
                                            <>
                                                <Badge>
                                                    {selectedPatient.status}
                                                </Badge>
                                                <Badge variant="outline">
                                                    Progress{" "}
                                                    {selectedPatient.progress}%
                                                </Badge>
                                                <Badge variant="secondary">
                                                    {
                                                        selectedSchedule?.schedule_date
                                                    }{" "}
                                                    {
                                                        selectedSchedule?.schedule_time
                                                    }
                                                </Badge>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Session header */}
                <Card>
                    <CardHeader>
                        <CardTitle>Session</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm">
                                    Session Date
                                </label>
                                <Input
                                    required
                                    type="date"
                                    value={sessionDate}
                                    onChange={(e) =>
                                        setSessionDate(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm">
                                    Session Number
                                </label>
                                <Input
                                    required
                                    type="number"
                                    min={1}
                                    value={sessionNumber}
                                    onChange={(e) =>
                                        setSessionNumber(Number(e.target.value))
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* GOALS */}
                <Card>
                    <CardHeader>
                        <CardTitle>GOALS</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm">
                                Long Term Goal
                            </label>
                            <textarea
                                required
                                className="min-h-28 w-full rounded-md border p-3"
                                value={longTermGoal}
                                onChange={(e) =>
                                    setLongTermGoal(e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm">
                                Short Term Goal
                            </label>
                            <textarea
                                required
                                className="min-h-28 w-full rounded-md border p-3"
                                value={shortTermGoal}
                                onChange={(e) =>
                                    setShortTermGoal(e.target.value)
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* LING SIX SOUND */}
                <Card>
                    <CardHeader>
                        <CardTitle>LING SIX SOUND</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {lingKeys.map((key) => (
                                <div
                                    key={key}
                                    className="rounded-lg border p-4"
                                >
                                    <label className="mb-2 block text-sm font-medium">
                                        {key}
                                    </label>
                                    <select
                                        required
                                        className="w-full rounded-md border p-2"
                                        value={ling[key]}
                                        onChange={(e) =>
                                            setLing((prev) => ({
                                                ...prev,
                                                [key]: Number(e.target.value),
                                            }))
                                        }
                                    >
                                        <option value={0}>
                                            0 - {levelLabel(0)}
                                        </option>
                                        <option value={1}>
                                            1 - {levelLabel(1)}
                                        </option>
                                        <option value={2}>
                                            2 - {levelLabel(2)}
                                        </option>
                                    </select>
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        Level: {levelLabel(ling[key])}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* ACTIVITIES */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>ACTIVITIES</CardTitle>
                        <Button onClick={addActivity} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Activity
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activities.map((a, index) => (
                            <div key={index} className="rounded-lg border p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="font-medium">
                                        Activity #{index + 1}
                                    </div>
                                    {activities.length > 1 ? (
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() =>
                                                removeActivity(index)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    ) : null}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm">
                                            Name
                                        </label>
                                        <Input
                                            required
                                            value={a.activity_name}
                                            onChange={(e) =>
                                                updateActivity(
                                                    index,
                                                    "activity_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm">
                                            Objective
                                        </label>
                                        <Input
                                            required
                                            value={a.objective}
                                            onChange={(e) =>
                                                updateActivity(
                                                    index,
                                                    "objective",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm">
                                            Score
                                        </label>
                                        <Input
                                            required
                                            type="number"
                                            value={a.score}
                                            onChange={(e) =>
                                                updateActivity(
                                                    index,
                                                    "score",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm">
                                            Observation
                                        </label>
                                        <Input
                                            required
                                            value={a.observation}
                                            onChange={(e) =>
                                                updateActivity(
                                                    index,
                                                    "observation",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* EVALUATION */}
                <Card>
                    <CardHeader>
                        <CardTitle>EVALUATION</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(
                            [
                                ["listening", "Listening"],
                                ["speech", "Speech"],
                                ["language", "Language"],
                                ["attention", "Attention"],
                            ] as const
                        ).map(([key, label]) => (
                            <div
                                key={key}
                                className="grid grid-cols-[140px_1fr] items-center gap-3"
                            >
                                <label className="text-sm font-medium">
                                    {label}
                                </label>
                                <Input
                                    required
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={evaluation[key]}
                                    onChange={(e) =>
                                        setEvaluation((prev) => ({
                                            ...prev,
                                            [key]: Number(e.target.value),
                                        }))
                                    }
                                />
                            </div>
                        ))}

                        <div>
                            <label className="mb-2 block text-sm">
                                Recommendation
                            </label>
                            <textarea
                                required
                                className="min-h-28 w-full rounded-md border p-3"
                                value={evaluation.recommendation}
                                onChange={(e) =>
                                    setEvaluation((prev) => ({
                                        ...prev,
                                        recommendation: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* HOME PROGRAM */}
                <Card>
                    <CardHeader>
                        <CardTitle>HOME PROGRAM</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            required
                            className="min-h-28 w-full rounded-md border p-3"
                            value={homeProgram}
                            onChange={(e) => setHomeProgram(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* THERAPIST NOTE */}
                <Card>
                    <CardHeader>
                        <CardTitle>THERAPIST NOTE</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            required
                            className="min-h-28 w-full rounded-md border p-3"
                            value={therapistNote}
                            onChange={(e) => setTherapistNote(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* SAVE */}
                <Card>
                    <CardContent className="flex justify-end p-5">
                        <Button
                            size="lg"
                            onClick={handleSubmit}
                            disabled={scheduleId === ""}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Save
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
