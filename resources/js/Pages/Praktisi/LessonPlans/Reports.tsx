import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
    FileText,
    Calendar,
    User,
    ArrowRight,
    Plus,
    Search,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

type Patient = {
    id: number;
    name: string;
    photo: string | null;
    status: string;
    progress: number;
};

type LessonPlanListItem = {
    id: number;
    session_date: string;
    session_number: number;
    long_term_goal: string | null;
    short_term_goal: string | null;
    home_program: string | null;
    therapist_note: string | null;
    patient: Patient;
};

type SessionItem = {
    id: number;
    session_date: string;
    session_number: number;
};

type PatientSessionsGroup = {
    patient: Patient;
    sessions: SessionItem[];
};

interface Props {
    lessonPlans: LessonPlanListItem[];
}

export default function Reports({ lessonPlans }: Props) {
    const [query, setQuery] = useState<string>("");

    const filteredLessonPlans = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return lessonPlans;

        return lessonPlans.filter((lp) => {
            const patientName = lp.patient.name?.toLowerCase() ?? "";
            const dateStr = lp.session_date
                ? new Date(lp.session_date)
                      .toLocaleDateString("id-ID")
                      .toLowerCase()
                : "";
            const sessionNum = String(lp.session_number);

            return (
                patientName.includes(q) ||
                dateStr.includes(q) ||
                sessionNum.includes(q)
            );
        });
    }, [lessonPlans, query]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Lesson Plan</h2>
                        <p className="text-sm text-muted-foreground">
                            Sesi terakhir per pasien
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Lesson Plan" />
            <div className="space-y-6 my-6">
                    <Card>
                        <CardContent className="p-5">
                            <div className="flex gap-3">
                                <Link href={route("lesson-plans.create")}>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Lesson Plan
                                    </Button>
                                </Link>
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Cari pasien / sesi / tanggal"
                                    className="pl-9"
                                />
                            </div>
                        </CardContent>
                    </Card>
            </div>

            <div className="space-y-6">
                {filteredLessonPlans.length > 0 ? (
                    // Group per pasien, lalu tampilkan list sesi di dalamnya
                    <div className="space-y-6">
                        {(() => {
                            const map = new Map<number, PatientSessionsGroup>();
                            for (const lp of filteredLessonPlans) {
                                const pid = lp.patient.id;
                                if (!map.has(pid)) {
                                    map.set(pid, {
                                        patient: lp.patient,
                                        sessions: [],
                                    });
                                }
                                map.get(pid)!.sessions.push({
                                    id: lp.id,
                                    session_date: lp.session_date,
                                    session_number: lp.session_number,
                                });
                            }

                            return Array.from(map.values()).map((group) => (
                                <Card
                                    key={group.patient.id}
                                    className="overflow-hidden transition-all"
                                >
                                    <CardHeader className="border-b bg-muted/30">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                                    {group.patient.photo ? (
                                                        <img
                                                            src={`/storage/${group.patient.photo}`}
                                                            alt={
                                                                group.patient
                                                                    .name
                                                            }
                                                            className="h-14 w-14 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-lg font-bold text-primary">
                                                            {group.patient.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <CardTitle className="text-base truncate">
                                                        {group.patient.name}
                                                    </CardTitle>
                                                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                        <User className="h-3.5 w-3.5" />
                                                        <span>
                                                            Status:{" "}
                                                            {
                                                                group.patient
                                                                    .status
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="min-w-[180px]">
                                                <div className="mb-2 flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Progress Terapi
                                                    </span>
                                                    <span className="font-semibold">
                                                        {group.patient.progress}
                                                        %
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={
                                                        group.patient.progress
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4 p-5">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-semibold">
                                                Daftar Sesi
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {group.sessions.length} sesi
                                            </div>
                                        </div>

                                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                            {group.sessions.map((s) => (
                                                <div
                                                    key={s.id}
                                                    className="rounded-lg border bg-muted/30 p-4"
                                                >
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            Sesi
                                                        </span>
                                                        <span className="font-semibold">
                                                            #{s.session_number}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>
                                                            {new Date(
                                                                s.session_date
                                                            ).toLocaleDateString(
                                                                "id-ID"
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 grid">
                                                        <Link
                                                            href={route(
                                                                "lesson-plans.show",
                                                                s.id
                                                            )}
                                                        >
                                                            <Button className="w-full gap-2">
                                                                <FileText className="h-4 w-4" />
                                                                Detail
                                                                <ArrowRight className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ));
                        })()}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-primary/10" />
                            <h3 className="font-semibold">
                                Belum ada Lesson Plan
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Tidak ditemukan sesi lesson plan untuk pasien
                                Anda.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
