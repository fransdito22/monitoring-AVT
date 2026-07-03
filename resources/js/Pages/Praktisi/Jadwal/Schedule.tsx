import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";

import { useMemo, useState } from "react";

import { Calendar, Clock3, MessageSquareText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar as CalendarComp } from "@/components/ui/calendar";

type Session = {
    id: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm (diproxy dari session_number)
    therapyType: string;
    patientName: string;
    patientAvatar?: string | null;
    status: "Draft" | "Requested" | "Approved" | "Scheduled";
    therapistNote?: string | null;
};

type Patient = {
    id: number;
    name: string;
    photo?: string | null;
};

type Props = {
    sessions: Session[];
    patients: Patient[];
};

const pad2 = (n: number) => String(n).padStart(2, "0");

function toISODate(d: Date) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function formatDay(isoDate: string) {
    const [y, m, d] = isoDate.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, {
        weekday: "long",
        day: "2-digit",
        month: "short",
    });
}

export default function JadwalPraktisi({ sessions, patients }: Props) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );

    const [queryPatient, setQueryPatient] = useState("");
    const [pickedPatientId, setPickedPatientId] = useState<number | null>(
        patients[0]?.id ?? null
    );

    const pickedPatient =
        patients.find((p) => p.id === pickedPatientId) ?? null;

    const selectedISO = selectedDate ? toISODate(selectedDate) : "";

    const sessionsForSelected = useMemo(() => {
        if (!selectedISO) return [];
        return sessions
            .filter((s) => s.date === selectedISO)
            .sort((a, b) => a.time.localeCompare(b.time));
    }, [sessions, selectedISO]);

    const patientOptions = useMemo(() => {
        const q = queryPatient.trim().toLowerCase();
        if (!q) return patients;
        return patients.filter((p) => p.name.toLowerCase().includes(q));
    }, [patients, queryPatient]);

    const sessionCount = sessionsForSelected.length;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Jadwal Terapi
                </h2>
            }
        >
            <Head title="Jadwal" />

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Desktop: Kalender + Detail Sesi; Mobile: Kalender saja dulu */}
                <div className="lg:col-span-8">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Kalender Jadwal
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="grid gap-4  xl:grid-cols-[280px_1fr]">
                                {/* Kalender */}
                                <div className="space-y-4 py-20 px-10  ">
                                    <CalendarComp
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        className="rounded-xl border shadow-sm"
                                    />
                                </div>

                                {/* Daftar Sesi */}
                                <div>
                                    {selectedDate && (
                                        <>
                                            <div className="mb-6 flex items-center justify-between">
                                                <div>
                                                    <p className="text-2xl">
                                                        Jadwal terapi yang
                                                        tersedia
                                                    </p>
                                                </div>
                                            </div>

                                            {sessionCount === 0 ? (
                                                <div className="flex h-80 items-center justify-center rounded-2xl border border-dashed">
                                                    <div className="text-center">
                                                        <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

                                                        <h3 className="font-semibold">
                                                            Tidak ada sesi
                                                            terapi
                                                        </h3>

                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            Belum ada jadwal
                                                            pada tanggal ini
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="rounded-2xl border border-dashed">
                                                    {sessionsForSelected.map(
                                                        (s) => {
                                                            const initials =
                                                                s.patientName
                                                                    .split(" ")
                                                                    .map(
                                                                        (w) =>
                                                                            w[0]
                                                                    )
                                                                    .join("")
                                                                    .slice(0, 2)
                                                                    .toUpperCase();

                                                            return (
                                                                <Sheet
                                                                    key={s.id}
                                                                >
                                                                    <SheetTrigger className="w-full">
                                                                        <div className="flex w-full items-center justify-between rounded-2xl bg-card p-5 text-left transition-all duration-200 hover:border">
                                                                            <div className="flex items-center gap-4">
                                                                                <Avatar className="h-16 w-16">
                                                                                    <AvatarImage
                                                                                        src={
                                                                                            s.patientAvatar ??
                                                                                            undefined
                                                                                        }
                                                                                    />
                                                                                    <AvatarFallback>
                                                                                        {
                                                                                            initials
                                                                                        }
                                                                                    </AvatarFallback>
                                                                                </Avatar>

                                                                                <div className="mx-10">
                                                                                    <h4 className="text-lg font-semibold">
                                                                                        {
                                                                                            s.patientName
                                                                                        }
                                                                                    </h4>

                                                                                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                                                        <Clock3 className="h-4 w-4" />
                                                                                        {
                                                                                            s.time
                                                                                        }
                                                                                    </div>

                                                                                    <div className="mt-1 mx-12 text-sm text-muted-foreground">
                                                                                        {
                                                                                            s.therapyType
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <Badge
                                                                                className="px-4 py-1"
                                                                                variant={
                                                                                    s.status ===
                                                                                    "Scheduled"
                                                                                        ? "default"
                                                                                        : "secondary"
                                                                                }
                                                                            >
                                                                                {
                                                                                    s.status
                                                                                }
                                                                            </Badge>
                                                                        </div>
                                                                    </SheetTrigger>

                                                                    <SheetContent
                                                                        side="right"
                                                                        className="sm:max-w-lg"
                                                                    >
                                                                        <SheetHeader>
                                                                            <SheetTitle>
                                                                                Detail
                                                                                Sesi
                                                                            </SheetTitle>

                                                                            <SheetDescription>
                                                                                {
                                                                                    s.patientName
                                                                                }{" "}
                                                                                •{" "}
                                                                                {formatDay(
                                                                                    s.date
                                                                                )}{" "}
                                                                                •{" "}
                                                                                {
                                                                                    s.time
                                                                                }
                                                                            </SheetDescription>
                                                                        </SheetHeader>

                                                                        <div className="mt-6 space-y-4">
                                                                            {/* Layout detail sesuai request */}
                                                                            <div className="rounded-2xl border bg-card p-4">
                                                                                {/* Header */}
                                                                                <div className="flex items-center gap-4">
                                                                                    <Avatar className="h-14 w-14">
                                                                                        <AvatarImage
                                                                                            src={
                                                                                                s.patientAvatar ??
                                                                                                undefined
                                                                                            }
                                                                                        />
                                                                                        <AvatarFallback>
                                                                                            {s.patientName
                                                                                                .split(
                                                                                                    " "
                                                                                                )
                                                                                                .map(
                                                                                                    (
                                                                                                        w
                                                                                                    ) =>
                                                                                                        w[0]
                                                                                                )
                                                                                                .join(
                                                                                                    ""
                                                                                                )
                                                                                                .slice(
                                                                                                    0,
                                                                                                    2
                                                                                                )
                                                                                                .toUpperCase()}
                                                                                        </AvatarFallback>
                                                                                    </Avatar>

                                                                                    <div className="min-w-0">
                                                                                        <div className="text-lg font-semibold truncate">
                                                                                            {
                                                                                                s.patientName
                                                                                            }
                                                                                        </div>
                                                                                        <div className="mt-1 text-sm text-muted-foreground">
                                                                                            {formatDay(
                                                                                                s.date
                                                                                            )}{" "}
                                                                                            •{" "}
                                                                                            {
                                                                                                s.time
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Divider */}
                                                                                <div className="mt-4 space-y-0">
                                                                                    <div className="border-t" />
                                                                                    <div className="grid gap-0">
                                                                                        <div className="py-3">
                                                                                            <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                                                Informasi
                                                                                                Pasien
                                                                                            </div>
                                                                                            <div className="mt-1 text-sm font-medium">
                                                                                                Status:{" "}
                                                                                                {
                                                                                                    s.status
                                                                                                }
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="border-t" />

                                                                                        <div className="py-3">
                                                                                            <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                                                Lesson
                                                                                                Plan
                                                                                            </div>
                                                                                            <div className="mt-1 text-sm font-medium">
                                                                                                {
                                                                                                    s.therapyType
                                                                                                }
                                                                                            </div>
                                                                                            <div className="mt-1 text-sm text-muted-foreground">
                                                                                                Detail
                                                                                                lesson
                                                                                                plan
                                                                                                akan
                                                                                                tersedia
                                                                                                saat
                                                                                                sudah
                                                                                                terhubung
                                                                                                ke
                                                                                                backend.
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="border-t" />

                                                                                        <div className="py-3">
                                                                                            <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                                                Target
                                                                                                Terapi
                                                                                            </div>
                                                                                            <div className="mt-1 text-sm text-muted-foreground">
                                                                                                Target
                                                                                                terapi
                                                                                                akan
                                                                                                muncul
                                                                                                dari
                                                                                                Lesson
                                                                                                Plan
                                                                                                /
                                                                                                Evaluasi.
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="border-t" />

                                                                                        <div className="py-3">
                                                                                            <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                                                Ling
                                                                                                Six
                                                                                                Sound
                                                                                                Terakhir
                                                                                            </div>
                                                                                            <div className="mt-1 text-sm text-muted-foreground">
                                                                                                Belum
                                                                                                tersedia
                                                                                                (mock).
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="border-t" />

                                                                                        <div className="py-3">
                                                                                            <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                                                Catatan
                                                                                                Terapis
                                                                                            </div>
                                                                                            <div className="mt-2 flex items-start gap-3 rounded-xl border bg-muted/20 p-3">
                                                                                                <MessageSquareText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                                                                <div className="text-sm text-muted-foreground">
                                                                                                    {s.therapistNote ||
                                                                                                        "Catatan sesi belum tersedia."}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="border-t" />

                                                                                        <div className="py-3">
                                                                                            <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                                                Home
                                                                                                Program
                                                                                            </div>
                                                                                            <div className="mt-1 text-sm text-muted-foreground">
                                                                                                Home
                                                                                                program
                                                                                                akan
                                                                                                muncul
                                                                                                dari
                                                                                                lesson
                                                                                                plan.
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Actions */}
                                                                                    <div className="pt-4">
                                                                                        <div className="grid gap-3 sm:grid-cols-2">
                                                                                            <a
                                                                                                href="#"
                                                                                                className="inline-flex items-center justify-center rounded-xl border bg-background px-3 py-2 text-sm font-medium hover:bg-muted/40 transition"
                                                                                                onClick={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    e.preventDefault()
                                                                                                }
                                                                                            >
                                                                                                Lihat
                                                                                                Lesson
                                                                                                Plan
                                                                                            </a>
                                                                                            <a
                                                                                                href="#"
                                                                                                className="inline-flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                                                                                                onClick={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    e.preventDefault()
                                                                                                }
                                                                                            >
                                                                                                Mulai
                                                                                                Sesi
                                                                                            </a>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </SheetContent>
                                                                </Sheet>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Desktop: Detail Sesi */}
                <div className="hidden lg:block lg:col-span-4">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Ringkasan Jadwal</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="rounded-xl border p-4">
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                                    Tanggal Dipilih
                                </p>

                                <p className="mt-2 font-semibold">
                                    {selectedDate
                                        ? formatDay(selectedISO)
                                        : "Belum dipilih"}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-xl border p-4">
                                    <p className="text-xs text-muted-foreground">
                                        Total Sesi
                                    </p>

                                    <p className="mt-2 text-2xl font-bold">
                                        {sessionCount}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/20">
                                <p className="font-medium text-blue-700 dark:text-blue-400">
                                    Informasi
                                </p>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Klik salah satu sesi terapi untuk melihat
                                    lesson plan, target terapi, dan hasil
                                    evaluasi pasien.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
