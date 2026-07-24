import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope } from "lucide-react";
import type { NextSchedulePayload } from "@/types/dashboard";

type Props = {
    nextSchedule: NextSchedulePayload | null;
};

export function NextScheduleCard({ nextSchedule }: Props) {
    const formatDate = (value: string | null) => {
        if (!value) return "Belum dijadwalkan";
        const d = new Date(value + "T00:00:00");
        if (Number.isNaN(d.getTime())) return value;
        return d.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const formatTime = (start: string | null, end: string | null) => {
        const s = start ?? "Belum ditentukan";
        const e = end ? ` - ${end}` : "";
        return `${s}${e} WIB`;
    };

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Stethoscope className="h-5 w-5 text-sky-600" />
                    Next Therapy Schedule
                </CardTitle>
            </CardHeader>

            <CardContent>
                {!nextSchedule ? (
                    <p className="text-sm text-muted-foreground">
                        Belum ada jadwal terapi berikutnya.
                    </p>
                ) : (
                    <div className="space-y-3">
                        <div className="rounded-xl border p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Tanggal
                                    </p>
                                    <p className="font-semibold text-slate-800">
                                        {formatDate(nextSchedule.schedule_date)}
                                    </p>
                                </div>

                                <Badge
                                    variant="secondary"
                                    className="rounded-full"
                                >
                                    {nextSchedule.status ?? "Scheduled"}
                                </Badge>
                            </div>

                            <div className="mt-3 space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Jam:{" "}
                                    {formatTime(
                                        nextSchedule.schedule_time,
                                        nextSchedule.end_time
                                    )}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    Praktisi:{" "}
                                    {nextSchedule.therapist?.name ??
                                        "Belum ditentukan"}
                                </p>

                                {/* <p className="text-sm text-muted-foreground">
                                    📖 Nomor Sesi:{" "}
                                    {nextSchedule.session_number ??
                                        "Belum ditentukan"}
                                </p> */}

                                {/* {nextSchedule.location ? (
                                    <p className="text-sm text-muted-foreground">
                                        📍 Lokasi: {nextSchedule.location}
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        📍 Lokasi: Belum ditentukan
                                    </p>
                                )} */}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
