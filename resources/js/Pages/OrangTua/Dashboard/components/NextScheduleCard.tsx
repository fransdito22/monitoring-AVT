import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope } from "lucide-react";

type NextSchedulePayload = {
    id: string;
    date: string | null;
    time: string | null;
    therapist: string | null;

    // computed in backend (DashboardController)
    sessionNumber?: string | null;
    status?: string | null;

    lokasi: string | null;
};

type Props = {
    nextSchedule: NextSchedulePayload | null;
};

export function NextScheduleCard({ nextSchedule }: Props) {
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
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="font-semibold text-slate-800">
                                    {nextSchedule.date ?? "Belum tersedia"}
                                </p>

                                <Badge variant="secondary" className="rounded-full">
                                    {nextSchedule.status ?? "Scheduled"}
                                </Badge>
                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Jam mulai: {nextSchedule.time ?? "Belum tersedia"}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Praktisi: {nextSchedule.therapist ?? "Belum tersedia"}
                            </p>

                            {nextSchedule.lokasi ? (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Lokasi: {nextSchedule.lokasi}
                                </p>
                            ) : null}

                            <p className="mt-1 text-sm text-muted-foreground">
                                Nomor sesi: {nextSchedule.sessionNumber ?? "Belum tersedia"}
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
