import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    CalendarDays,
    UserRound,
    Activity,
    HeartPulse,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PersonRef {
    id?: number | null;
    name?: string | null;
}

interface PatientDetail {
    id: number;
    name: string;
    photo?: string | null;
    status: string;
    progress: number;
    birth_date?: string | null;
    age?: number | null;
    gender?: string | null;
    parent?: PersonRef | null;
    therapist?: PersonRef | null;
    created_at?: string | null;
    updated_at?: string | null;
}

interface Props {
    patient: PatientDetail;
}

export default function DetailPatient({ patient }: Props) {
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

    const getGenderLabel = (gender?: string | null) => {
        if (!gender) return "-";
        if (gender === "L") return "Laki-laki";
        if (gender === "P") return "Perempuan";
        return gender;
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 75) return "bg-emerald-100 text-emerald-700";
        if (progress >= 50) return "bg-blue-100 text-blue-700";
        return "bg-orange-100 text-orange-700";
    };

    const formatDate = (date?: string | null) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Detail Pasien</h2>
                        <p className="text-sm text-muted-foreground">
                            Informasi lengkap pasien praktisi
                        </p>
                    </div>
                    <Link href={route("patients.praktisi")}>
                        <Button variant="outline" className="rounded-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Daftar Pasien
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={`Detail Pasien - ${patient.name}`} />

            <div className="space-y-6 p-6">
                <Card className="rounded-3xl">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                {patient.photo ? (
                                    <img
                                        src={patient.photo}
                                        alt={patient.name}
                                        className="h-20 w-20 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                                        {patient.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 2)}
                                    </div>
                                )}

                                <div>
                                    <h1 className="text-2xl font-bold">
                                        {patient.name}
                                    </h1>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="rounded-full"
                                        >
                                            {patient.age ?? "-"} th
                                        </Badge>
                                        <Badge className="rounded-full border-0">
                                            {getStatusLabel(patient.status)}
                                        </Badge>
                                        <Badge
                                            className={`${getProgressColor(
                                                patient.progress
                                            )} rounded-full border-0`}
                                        >
                                            {patient.progress}% progres
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-muted-foreground">
                                ID Pasien:{" "}
                                <span className="font-medium text-foreground">
                                    #{patient.id}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="rounded-3xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserRound className="h-5 w-5" />
                                Biodata Pasien
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-muted-foreground">
                                    Nama
                                </span>
                                <span className="font-medium">
                                    {patient.name}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-muted-foreground">
                                    Jenis Kelamin
                                </span>
                                <span className="font-medium">
                                    {getGenderLabel(patient.gender)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-muted-foreground">
                                    Tanggal Lahir
                                </span>
                                <span className="font-medium">
                                    {formatDate(patient.birth_date)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Usia
                                </span>
                                <span className="font-medium">
                                    {patient.age ?? "-"} tahun
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <HeartPulse className="h-5 w-5" />
                                Informasi Terapi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-muted-foreground">
                                    Status
                                </span>
                                <span className="font-medium">
                                    {getStatusLabel(patient.status)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-muted-foreground">
                                    Progress
                                </span>
                                <span className="font-medium">
                                    {patient.progress}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-muted-foreground">
                                    Caregiver
                                </span>
                                <span className="font-medium">
                                    {patient.parent?.name ??
                                        "Belum ada caregiver"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Praktisi
                                </span>
                                <span className="font-medium">
                                    {patient.therapist?.name ?? "-"}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-3xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            Metadata Data
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 text-sm md:grid-cols-2">
                        <div className="rounded-2xl border p-4">
                            <div className="mb-1 text-muted-foreground">
                                Dibuat pada
                            </div>
                            <div className="font-medium">
                                {formatDate(patient.created_at)}
                            </div>
                        </div>
                        <div className="rounded-2xl border p-4">
                            <div className="mb-1 text-muted-foreground">
                                Diupdate pada
                            </div>
                            <div className="font-medium">
                                {formatDate(patient.updated_at)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl">
                    <CardContent className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
                        <Activity className="h-5 w-5" />
                        Halaman ini menampilkan detail profil pasien untuk
                        kebutuhan monitoring praktisi.
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
