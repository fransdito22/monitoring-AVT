import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { CalendarDays, HeartPulse, UserRound } from "lucide-react";

import type { TherapyPatient } from "@/types/therapy";

export function PatientSummaryCard({
    patient,
    progressPercent,
}: {
    patient: TherapyPatient;
    progressPercent: number;
}) {
    const getStatusLabel = (status: string) => {
        switch (status) {
            case "aktif":
                return "Aktif";
            case "dalam_terapi":
                return "Dalam Terapi";
            case "tinjau_ulang":
                return "Tinjau Ulang";
            default:
                return status;
        }
    };

    const getGenderLabel = (gender: string | null) => {
        if (!gender) return "-";
        if (gender === "L") return "Laki-laki";
        if (gender === "P") return "Perempuan";
        return gender;
    };

    const progressHint = (progress: number) => {
        if (progress >= 75) return "bg-emerald-100 text-emerald-700";
        if (progress >= 50) return "bg-blue-100 text-blue-700";
        return "bg-orange-100 text-orange-700";
    };

    const initials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .filter(Boolean)
            .join("")
            .slice(0, 2)
            .toUpperCase();

    return (
        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-lg">Patient Summary</CardTitle>
                <div className="flex items-center gap-2">
                    <Badge className="rounded-full border-0 bg-slate-100 text-slate-700">
                        {patient.id ? `#${patient.id}` : "-"}
                    </Badge>
                    <Badge
                        className={`${progressHint(
                            progressPercent
                        )} rounded-full border-0`}
                    >
                        {progressPercent}%
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        {patient.photo ? (
                            <img
                                src={patient.photo}
                                alt={patient.name}
                                className="h-16 w-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                                {initials(patient.name)}
                            </div>
                        )}

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-semibold text-slate-900">
                                    {patient.name}
                                </h1>
                                <Badge
                                    variant="secondary"
                                    className="rounded-full"
                                >
                                    {getStatusLabel(patient.status)}
                                </Badge>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" />
                                    {patient.age ?? "-"} th
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <UserRound className="h-4 w-4" />
                                    {getGenderLabel(patient.gender)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:max-w-[420px]">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <div className="text-sm text-slate-600">
                                        Progress Keseluruhan
                                    </div>
                                    <div className="mt-1 flex items-center gap-2">
                                        <HeartPulse className="h-4 w-4 text-sky-600" />
                                        <span className="text-2xl font-bold text-slate-900">
                                            {progressPercent}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <Progress value={progressPercent} />
                            </div>

                            <div className="mt-3 grid w-full grid-cols-2 gap-2 text-sm">
                                <div className="min-w-0 rounded-xl bg-white px-3 py-2">
                                    <div className="text-xs text-slate-500">
                                        Orang Tua
                                    </div>
                                    <div className="truncate font-medium text-slate-900">
                                        {patient.parent?.name ?? "-"}
                                    </div>
                                </div>
                                <div className="min-w-0 rounded-xl bg-white px-3 py-2">
                                    <div className="text-xs text-slate-500">
                                        Praktisi
                                    </div>
                                    <div className="truncate font-medium text-slate-900">
                                        {patient.therapist?.name ?? "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
