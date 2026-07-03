import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

import { ClipboardCheck, FileText, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Patient {
    id: number;
    name: string;
    photo: string | null;
    status: string;
    progress: number;
    total_reports: number;
    parent?: {
        name?: string;
    };
}

interface Props {
    patients: Patient[];
    filters: {
        search?: string;
    };
}

export default function Reports({ patients, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");

    const handleSearch = () => {
        router.get(
            route("reports.index"),
            {
                search,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const statusColor = (status: string) => {
        switch (status) {
            case "aktif":
                return "bg-green-100 text-green-700";

            case "dalam_terapi":
                return "bg-blue-100 text-blue-700";

            case "tinjau_ulang":
                return "bg-yellow-100 text-yellow-700";

            case "lulus":
                return "bg-purple-100 text-purple-700";

            default:
                return "";
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold">Tes Artikulasi</h2>

                    <p className="text-sm text-muted-foreground">
                        Monitoring perkembangan terapi pasien
                    </p>
                </div>
            }
        >
            <Head title="Laporan AVT" />

            <div className="space-y-6 my-6">
                {/* Search */}
                <Card>
                    <CardContent className="p-5">
                        <div className="flex gap-3">
                            <Input
                                placeholder="Cari pasien..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <Button onClick={handleSearch}>
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Patient List */}
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {patients.map((patient) => (
                        <Card
                            key={patient.id}
                            className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
                        >
                            <CardHeader className="border-b bg-muted/30">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                        {patient.photo ? (
                                            <img
                                                src={`/storage/${patient.photo}`}
                                                alt={patient.name}
                                                className="h-14 w-14 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-lg font-bold text-primary">
                                                {patient.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <CardTitle className="text-base">
                                            {patient.name}
                                        </CardTitle>

                                        <p className="text-xs text-muted-foreground">
                                            Orang Tua :{" "}
                                            {patient.parent?.name ?? "-"}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4 p-5">
                                <div className="flex items-center justify-between">
                                    {/* <Badge
                                        className={statusColor(
                                            patient.status
                                        )}
                                    >
                                        {patient.status}
                                    </Badge> */}
                                </div>

                                <div>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span>Progress Terapi</span>

                                        <span>{patient.progress}%</span>
                                    </div>

                                    <div className="h-2 rounded-full bg-muted">
                                        <div
                                            className="h-2 rounded-full bg-primary transition-all"
                                            style={{
                                                width: `${patient.progress}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-muted/30 p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Total Laporan
                                    </p>

                                    <p className="text-xl font-bold">
                                        {patient.total_reports}
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Link
                                        href={route("reports.create", {
                                            childId: patient.id,
                                        })}
                                    >
                                        <Button className="w-full gap-2">
                                            <ClipboardCheck className="h-4 w-4" />
                                            Tambah Penilaian
                                        </Button>
                                    </Link>

                                    <Link
                                        href={route("reports.show", {
                                            childId: patient.id,
                                        })}
                                    >
                                        <Button
                                            variant="outline"
                                            className="w-full gap-2"
                                        >
                                            <FileText className="h-4 w-4" />
                                            Detail Laporan
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {patients.length === 0 && (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <FileText className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

                            <h3 className="font-semibold">
                                Data pasien tidak ditemukan
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Coba gunakan kata kunci lain.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
