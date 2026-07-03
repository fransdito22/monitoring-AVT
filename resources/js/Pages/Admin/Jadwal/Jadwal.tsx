import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";

import { useMemo, useState } from "react";
import {
    Calendar,
    Clock3,
    MessageSquareText,
    ShieldCheck,
    XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    time: string; // HH:mm
    therapyType: string;
    patientName: string;
    patientAvatar?: string;
    status: "Draft" | "Requested" | "Approved" | "Scheduled";
    therapistNote?: string;
};

type Request = {
    id: string;
    date: string;
    time: string;
    patientName: string;
    therapyType: string;
    status: "Pending" | "Approved" | "Rejected";
};

const pad2 = (n: number) => String(n).padStart(2, "0");
function toISODate(d: Date) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function addDays(base: Date, days: number) {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
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

const mockRequestsInitial: Request[] = (() => {
    const base = new Date();
    return [
        {
            id: "r-1",
            date: toISODate(addDays(base, 2)),
            time: "10:15",
            patientName: "Leo Thompson",
            therapyType: "Auditory Integration",
            status: "Pending",
        },
        {
            id: "r-2",
            date: toISODate(addDays(base, 4)),
            time: "13:00",
            patientName: "Mia Chen",
            therapyType: "Speech & Language",
            status: "Pending",
        },
    ];
})();

const mockSessionsInitial: Session[] = (() => {
    const base = new Date();
    return [
        {
            id: "s-1",
            date: toISODate(addDays(base, 1)),
            time: "09:00",
            therapyType: "Auditory Integration",
            patientName: "Leo Thompson",
            patientAvatar:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAAFY7B2ER-GrRA9oVAeet9VFWxvMpq9befeQuh7lOPXj9B89az4vytDTzhHl2-7c95JVdc0EA6ridbvaVfFnFSMKJxH4-Q0O_zlSkvSU2fyiGbqgjkeCWXh9JUpNXYya8j-wfvhOSkou16Yo00RN0xdzwkan4VNIH96_ulgYKCDxvEfunbHhKDxqEMTj3MsZOHK4TSOtVZad6zbOjK29Ja1nWHQR3fdmZ7qIgI2n2Z6a51GsUAGurhXpiR15N6rCpVYNAx_-sDHCQ",
            status: "Scheduled",
        },
    ];
})();

export default function JadwalAdmin() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );
    const [requests, setRequests] = useState<Request[]>(mockRequestsInitial);
    const [sessions, setSessions] = useState<Session[]>(mockSessionsInitial);

    const selectedISO = selectedDate ? toISODate(selectedDate) : "";

    const sessionsForSelected = useMemo(() => {
        if (!selectedISO) return [];
        return sessions
            .filter((s) => s.date === selectedISO)
            .sort((a, b) => a.time.localeCompare(b.time));
    }, [sessions, selectedISO]);

    const [patientName, setPatientName] = useState("Leo Thompson");
    const [therapyType, setTherapyType] = useState("Auditory Integration");
    const [time, setTime] = useState("10:00");

    function approveRequest(reqId: string) {
        setRequests((prev) =>
            prev.map((r) => {
                if (r.id !== reqId) return r;
                return { ...r, status: "Approved" };
            })
        );

        const req = requests.find((r) => r.id === reqId);
        if (!req) return;

        setSessions((prev) => [
            {
                id: `s-${Math.random().toString(16).slice(2)}`,
                date: req.date,
                time: req.time,
                therapyType: req.therapyType,
                patientName: req.patientName,
                status: "Scheduled",
            },
            ...prev,
        ]);
    }

    function rejectRequest(reqId: string) {
        setRequests((prev) =>
            prev.map((r) => {
                if (r.id !== reqId) return r;
                return { ...r, status: "Rejected" };
            })
        );
    }

    function adminSchedule() {
        if (!selectedISO) return;

        setSessions((prev) => [
            {
                id: `s-${Math.random().toString(16).slice(2)}`,
                date: selectedISO,
                time,
                therapyType,
                patientName,
                status: "Scheduled",
            },
            ...prev,
        ]);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Jadwal & Approval
                </h2>
            }
        >
            <Head title="Jadwal Admin" />

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between gap-3">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Kalender (Admin)
                            </CardTitle>
                            <Badge variant="secondary">Admin</Badge>
                        </CardHeader>
                        <CardContent>
                            <CalendarComp
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="w-full rounded-md border"
                            />

                            {selectedDate && (
                                <div className="mt-4 text-sm text-muted-foreground">
                                    {formatDay(selectedISO)} •{" "}
                                    {sessionsForSelected.length} sesi
                                </div>
                            )}

                            <div className="mt-4 grid gap-3">
                                {sessionsForSelected.length === 0 ? (
                                    <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                                        Belum ada sesi pada tanggal ini.
                                    </div>
                                ) : (
                                    sessionsForSelected.map((s) => {
                                        const initials = s.patientName
                                            .split(" ")
                                            .map((w) => w[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase();

                                        return (
                                            <Sheet key={s.id}>
                                                <SheetTrigger>
                                                    <button
                                                        type="button"
                                                        className="w-full text-left"
                                                    >
                                                        <div className="flex items-start justify-between gap-3 rounded-xl border bg-card p-4 hover:bg-muted/30 transition">
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                                                        <Clock3 className="h-4 w-4" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-semibold">
                                                                            {
                                                                                s.patientName
                                                                            }
                                                                        </div>
                                                                        <div className="text-sm text-muted-foreground">
                                                                            {
                                                                                s.time
                                                                            }{" "}
                                                                            •{" "}
                                                                            {
                                                                                s.therapyType
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Badge variant="secondary">
                                                                {s.status}
                                                            </Badge>
                                                        </div>
                                                    </button>
                                                </SheetTrigger>

                                                <SheetContent className="w-full sm:max-w-lg">
                                                    <SheetHeader>
                                                        <SheetTitle>
                                                            Detail Sesi
                                                        </SheetTitle>
                                                        <SheetDescription>
                                                            {s.patientName} •{" "}
                                                            {formatDay(s.date)}
                                                        </SheetDescription>
                                                    </SheetHeader>

                                                    <div className="mt-4 space-y-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-12 w-12">
                                                                <AvatarImage
                                                                    src={
                                                                        s.patientAvatar
                                                                    }
                                                                />
                                                                <AvatarFallback>
                                                                    {initials}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="text-base font-semibold">
                                                                    {
                                                                        s.patientName
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {formatDay(
                                                                        s.date
                                                                    )}{" "}
                                                                    • {s.time}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <Card>
                                                            <CardContent className="p-4 space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="text-sm font-medium">
                                                                        Jenis
                                                                        terapi
                                                                    </div>
                                                                    <Badge>
                                                                        {
                                                                            s.therapyType
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <div className="text-sm font-medium">
                                                                        Status
                                                                    </div>
                                                                    <Badge variant="secondary">
                                                                        {
                                                                            s.status
                                                                        }
                                                                    </Badge>
                                                                </div>

                                                                <div className="flex items-start gap-3 rounded-xl border bg-muted/20 p-3">
                                                                    <MessageSquareText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {s.therapistNote ??
                                                                            "Catatan sesi (mock)"}
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </SheetContent>
                                            </Sheet>
                                        );
                                    })
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex items-center justify-between gap-3">
                            <CardTitle>Admin: Set Jadwal Manual</CardTitle>
                            <Badge variant="secondary">Jadwalkan</Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Nama pasien
                                    </div>
                                    <Input
                                        value={patientName}
                                        onChange={(e) =>
                                            setPatientName(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Jenis terapi
                                    </div>
                                    <Input
                                        value={therapyType}
                                        onChange={(e) =>
                                            setTherapyType(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <div className="text-sm font-medium">
                                        Waktu
                                    </div>
                                    <Input
                                        value={time}
                                        onChange={(e) =>
                                            setTime(e.target.value)
                                        }
                                        placeholder="HH:mm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <div className="text-sm text-muted-foreground">
                                    Jadwal akan masuk ke kalender pada tanggal
                                    terpilih.
                                </div>
                                <Button onClick={adminSchedule}>
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Jadwalkan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6 lg:col-span-4">
                    <Card>
                        <CardHeader className="flex items-center justify-between gap-3">
                            <CardTitle>Request Terapi (Pending)</CardTitle>
                            <Badge variant="secondary">Approve / Reject</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3">
                                {requests.length === 0 ? (
                                    <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                                        Tidak ada request.
                                    </div>
                                ) : (
                                    requests
                                        .filter((r) => r.status === "Pending")
                                        .map((r) => (
                                            <div
                                                key={r.id}
                                                className="rounded-xl border bg-card p-4"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="font-semibold truncate">
                                                            {r.patientName}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {formatDay(r.date)}{" "}
                                                            • {r.time}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {r.therapyType}
                                                        </div>
                                                    </div>
                                                    <Badge>{r.status}</Badge>
                                                </div>

                                                <div className="mt-3 flex gap-2">
                                                    <Button
                                                        className="flex-1"
                                                        onClick={() =>
                                                            approveRequest(r.id)
                                                        }
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        className="flex-1"
                                                        onClick={() =>
                                                            rejectRequest(r.id)
                                                        }
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                )}

                                {requests.filter((r) => r.status === "Pending")
                                    .length === 0 && (
                                    <div className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
                                        Tidak ada request pending.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Catatan</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Admin bisa approve request dan jadwal manual (dummy,
                            UI saja).
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
