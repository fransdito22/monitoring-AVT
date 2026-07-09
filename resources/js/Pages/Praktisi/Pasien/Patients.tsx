import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Search, UserRound, TrendingUp, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Parent {
    name: string;
}

interface Patient {
    id: number;
    name: string;
    age: number;
    status: string;
    progress: number;
    parent?: Parent;
    photo?: string | null;
}

interface Props {
    patients: {
        data: Patient[];
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function Patients({ patients, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route("patients.praktisi"),
                {
                    search,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

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

    const getProgressColor = (progress: number) => {
        if (progress >= 75) {
            return "bg-emerald-100 text-emerald-700";
        }

        if (progress >= 50) {
            return "bg-blue-100 text-blue-700";
        }

        return "bg-orange-100 text-orange-700";
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Pasien</h2>
                        <p className="text-sm text-muted-foreground">
                            Ringkasan pasien & sesi hari ini
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Pasien" />

            <div className="space-y-8 p-6">
                {/* Search */}
                <Card className="rounded-3xl border">
                    <CardContent>
                        <div className="space-y-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="relative w-full max-w-2xl mt-6">
                                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Ketik nama, caregiver, atau status..."
                                        className="pl-11 rounded-full "
                                    />
                                </div>

                                {/* <div className="flex gap-3">
                                    <Button
                                        variant="secondary"
                                        className="rounded-full"
                                    >
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Filter
                                    </Button>

                                    <Button
                                        className="rounded-full"
                                        onClick={() =>
                                            router.visit(
                                                route(
                                                    "patients.create"
                                                )
                                            )
                                        }
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah
                                        Pasien
                                    </Button>
                                </div> */}
                            </div>

                            <p className="text-muted-foreground">
                                Menampilkan{" "}
                                <span className="font-semibold text-foreground">
                                    {patients.total}
                                </span>{" "}
                                pasien.
                            </p>
                        </div>
                    </CardContent>
                </Card>
                {/* Patient Cards */}
                {patients.data.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {patients.data.map((patient) => (
                            <Card
                                key={patient.id}
                                className="rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <CardContent className="p-6">
                                    <div className="flex justify-between">
                                        <div className="flex gap-4">
                                            {patient.photo ? (
                                                <img
                                                    src={patient.photo}
                                                    alt={patient.name}
                                                    className="h-16 w-16 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                                                    {patient.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .slice(0, 2)}
                                                </div>
                                            )}

                                            <div>
                                                <h3 className="text-2xl font-semibold">
                                                    {patient.name}
                                                </h3>

                                                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                                                    <div className="h-2 w-2 rounded-full bg-sky-500" />

                                                    {getStatusLabel(
                                                        patient.status
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Badge
                                            variant="secondary"
                                            className="rounded-full"
                                        >
                                            {patient.age} th
                                        </Badge>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <Badge
                                            className={`${getProgressColor(
                                                patient.progress
                                            )} rounded-full border-0`}
                                        >
                                            {patient.progress}% progres
                                        </Badge>

                                        <Badge
                                            variant="secondary"
                                            className="rounded-full"
                                        >
                                            <TrendingUp className="mr-1 h-3 w-3" />
                                            Minggu ini
                                        </Badge>
                                    </div>

                                    <div className="mt-8 flex items-center gap-3 text-muted-foreground">
                                        <UserRound className="h-5 w-5" />

                                        <span>
                                            {patient.parent?.name ??
                                                "Belum ada caregiver"}
                                        </span>
                                    </div>

                                    <div className="mt-6">
                                        <Link
                                            href={route(
                                                "therapy.show",
                                                patient.id
                                            )}
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-full"
                                            >
                                                Detail Terapi
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="rounded-3xl">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <UserRound className="mb-4 h-12 w-12 text-muted-foreground" />

                            <h3 className="text-lg font-semibold">
                                Tidak ada pasien ditemukan
                            </h3>

                            <p className="mt-2 text-center text-sm text-muted-foreground">
                                Coba ubah kata kunci pencarian atau tambahkan
                                pasien baru.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
