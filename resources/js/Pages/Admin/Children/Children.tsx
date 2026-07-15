import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Baby, UserPlus2, UserRoundCheck, UserRoundPlus } from "lucide-react";

type Parent = {
    id: number;
    name: string;
    email: string;
};

type Child = {
    id: number;
    name: string;
    birth_date: string | null;
    gender: "L" | "P" | null;
    photo: string | null;
    status: "aktif" | "dalam_terapi" | "tinjau_ulang" | "lulus" | string;
    progress: number;
    therapist_id?: number | null;
    parent?: {
        id: number | null;
        name: string | null;
    };
};

const statusLabel: Record<string, string> = {
    aktif: "Aktif",
    dalam_terapi: "Dalam Terapi",
    tinjau_ulang: "Tinjau Ulang",
    lulus: "Lulus",
};

const genderLabel: Record<string, string> = {
    L: "Laki-laki",
    P: "Perempuan",
};

export default function AdminChildren({
    parents,
    therapists,
    children,
    filters,
}: {
    parents: Parent[];
    therapists: Array<{ id: number; name: string }>;
    children: Child[];
    filters: { parent_id?: string | null; therapist_id?: string | null };
}) {
    const [selectedParentId, setSelectedParentId] = useState<
        string | null | undefined
    >(filters?.parent_id ?? null);
    const [selectedTherapistId, setSelectedTherapistId] = useState<
        string | null | undefined
    >(filters?.therapist_id ?? null);
    const [isCreating, setIsCreating] = useState(false);

    const createForm = useForm({
        parent_id: selectedParentId ? String(selectedParentId) : "",
        therapist_id: selectedTherapistId
            ? String(selectedTherapistId)
            : ("" as string | ""),
        name: "",
        birth_date: "",
        gender: "" as "" | "L" | "P",
        photo: "",
        status: "aktif" as Child["status"],
        progress: 0,
    });

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Manajemen Pasien
                </h2>
            }
        >
            <Head title="Manajemen Anak" />

            <div className="space-y-6">
                <Card className="border bg-card/80">
                    <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Kelola data anak, parent, dan terapis dalam satu
                                halaman.
                            </p>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight">
                                Halaman Manajemen Pasien
                            </h1>
                        </div>
                        <Badge
                            variant="secondary"
                            className="h-fit rounded-full"
                        >
                            <Baby className="mr-1 h-3.5 w-3.5" />
                            Total {children.length} anak
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <UserRoundPlus className="h-4 w-4" />
                            <CardTitle>Data Anak</CardTitle>
                        </div>
                        <Button
                            size="sm"
                            variant={isCreating ? "secondary" : "default"}
                            onClick={() => setIsCreating(!isCreating)}
                        >
                            <UserPlus2 className="mr-1 h-4 w-4" />
                            {isCreating ? "Tutup Form Anak" : "Tambah Anak"}
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-0">
                        {(selectedParentId || selectedTherapistId) && (
                            <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2 font-medium text-foreground">
                                    <UserRoundCheck className="h-4 w-4" />
                                    Filter aktif
                                </div>
                                <div className="mt-1">
                                    Parent: {selectedParentId ?? "-"} | Terapis:{" "}
                                    {selectedTherapistId ?? "-"}
                                </div>
                            </div>
                        )}

                        {isCreating && (
                            <div className="rounded-lg border p-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Nama Anak
                                        </div>
                                        <Input
                                            value={createForm.data.name}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="contoh: Mia Chen"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Tanggal Lahir
                                        </div>
                                        <Input
                                            type="date"
                                            value={createForm.data.birth_date}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    "birth_date",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Gender
                                        </div>
                                        <select
                                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                            value={createForm.data.gender}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    "gender",
                                                    e.target.value as "L" | "P"
                                                )
                                            }
                                        >
                                            <option value="">
                                                Pilih Gender...
                                            </option>
                                            <option value="L">L</option>
                                            <option value="P">P</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Terapis
                                        </div>
                                        <select
                                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                            value={createForm.data.therapist_id}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    "therapist_id",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Pilih Terapis...
                                            </option>
                                            {therapists.map((t) => (
                                                <option
                                                    key={t.id}
                                                    value={String(t.id)}
                                                >
                                                    {t.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <div className="text-sm font-medium">
                                            Parent
                                        </div>
                                        <select
                                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                            value={createForm.data.parent_id}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    "parent_id",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Pilih parent...
                                            </option>
                                            {parents.map((p) => (
                                                <option
                                                    key={p.id}
                                                    value={String(p.id)}
                                                >
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 md:col-span-2">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                createForm.reset();
                                                createForm.setData(
                                                    "parent_id",
                                                    selectedParentId
                                                        ? String(
                                                              selectedParentId
                                                          )
                                                        : ""
                                                );
                                                createForm.setData(
                                                    "therapist_id",
                                                    selectedTherapistId
                                                        ? String(
                                                              selectedTherapistId
                                                          )
                                                        : ""
                                                );
                                                createForm.setData(
                                                    "status",
                                                    "aktif"
                                                );
                                            }}
                                            disabled={createForm.processing}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                createForm.post(
                                                    route(
                                                        "admin.children.store"
                                                    ),
                                                    {
                                                        preserveScroll: true,
                                                        onSuccess: () => {
                                                            createForm.reset();
                                                            createForm.setData(
                                                                "parent_id",
                                                                selectedParentId
                                                                    ? String(
                                                                          selectedParentId
                                                                      )
                                                                    : ""
                                                            );
                                                            createForm.setData(
                                                                "therapist_id",
                                                                selectedTherapistId
                                                                    ? String(
                                                                          selectedTherapistId
                                                                      )
                                                                    : ""
                                                            );
                                                            window.location.href =
                                                                route(
                                                                    "admin.children.index"
                                                                );
                                                        },
                                                    }
                                                );
                                            }}
                                            disabled={createForm.processing}
                                        >
                                            Simpan Anak
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Parent</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Terapis</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {children.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                Belum ada data anak terdaftar.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        children.map((c) => (
                                            <TableRow key={c.id}>
                                                <TableCell className="font-medium">
                                                    {c.name}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {c.parent?.name ?? "-"}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {genderLabel[
                                                            c.gender ?? ""
                                                        ] ?? "-"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                                                            value={c.status}
                                                            onChange={(e) => {
                                                                const next =
                                                                    e.target
                                                                        .value;
                                                                router.patch(
                                                                    route(
                                                                        "admin.children.status.update",
                                                                        c.id
                                                                    ),
                                                                    {
                                                                        status: next,
                                                                    },
                                                                    {
                                                                        preserveScroll:
                                                                            true,
                                                                        preserveState:
                                                                            true,
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            <option value="aktif">
                                                                aktif
                                                            </option>
                                                            <option value="dalam_terapi">
                                                                dalam_terapi
                                                            </option>
                                                            <option value="tinjau_ulang">
                                                                tinjau_ulang
                                                            </option>
                                                            <option value="lulus">
                                                                lulus
                                                            </option>
                                                        </select>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {(() => {
                                                        const tid =
                                                            c.therapist_id;
                                                        if (!tid) return "-";
                                                        const t =
                                                            therapists.find(
                                                                (tt) =>
                                                                    tt.id ===
                                                                    tid
                                                            );
                                                        return (
                                                            t?.name ??
                                                            String(tid)
                                                        );
                                                    })()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
