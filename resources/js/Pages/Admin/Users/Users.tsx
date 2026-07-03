import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ShieldCheck, Trash2, RotateCcw, Users, UserPlus } from "lucide-react";

type User = {
    id: number;
    name: string;
    email: string;
    role: "praktisi_avt" | "orangtua" | "admin" | string;
    email_verified_at: string | null;
};

const roleLabel: Record<string, string> = {
    admin: "Admin",
    orangtua: "Orang Tua",
    orang_tua: "Orang Tua",
    praktisi_avt: "Terapis",
};

export default function AdminUsers({ users }: { users: User[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [resetId, setResetId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const updateForm = useForm({
        name: "",
        email: "",
        role: "praktisi_avt" as User["role"],
    });

    const resetForm = useForm({
        password: "",
    });

    const createForm = useForm({
        name: "",
        email: "",
        role: "praktisi_avt" as User["role"],
        password: "",
    });

    const startEdit = (u: User) => {
        setEditingId(u.id);
        updateForm.setData({
            name: u.name,
            email: u.email,
            role: u.role as any,
        });
    };

    const saveEdit = (id: number) => {
        updateForm.put(route("admin.users.update", id), {
            onSuccess: () => setEditingId(null),
        });
    };

    const startReset = (u: User) => {
        setResetId(u.id);
        resetForm.setData("password", "");
    };

    const submitReset = (id: number) => {
        resetForm.post(route("admin.users.reset-password", id), {
            onSuccess: () => setResetId(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Manajemen Akun
                </h2>
            }
        >
            <Head title="Manajemen Akun" />

            <div className="space-y-6">
                <Card className="border bg-card/80">
                    <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Kelola akun admin, terapis, dan orang tua.
                            </p>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight">
                                Halaman Manajemen Akun
                            </h1>
                        </div>
                        <Badge
                            variant="secondary"
                            className="h-fit rounded-full"
                        >
                            <Users className="mr-1 h-3.5 w-3.5" />
                            Total {users.length} akun
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            <CardTitle>Data User</CardTitle>
                        </div>
                        <Button
                            size="sm"
                            variant={isCreating ? "secondary" : "default"}
                            onClick={() => setIsCreating(!isCreating)}
                        >
                            <UserPlus className="mr-1 h-4 w-4" />
                            {isCreating ? "Tutup Form" : "Tambah User"}
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {isCreating && (
                            <Card className="border-dashed">
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Form Tambah User
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        className="space-y-4"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            createForm.post(
                                                route("admin.users.store"),
                                                {
                                                    onSuccess: () => {
                                                        setIsCreating(false);
                                                        createForm.reset();
                                                    },
                                                }
                                            );
                                        }}
                                    >
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium">
                                                    Nama
                                                </div>
                                                <Input
                                                    value={createForm.data.name}
                                                    onChange={(e) =>
                                                        createForm.setData(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Nama lengkap"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium">
                                                    Email
                                                </div>
                                                <Input
                                                    type="email"
                                                    value={
                                                        createForm.data.email
                                                    }
                                                    onChange={(e) =>
                                                        createForm.setData(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="email@domain.com"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium">
                                                    Role
                                                </div>
                                                <select
                                                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                                    value={
                                                        createForm.data
                                                            .role as any
                                                    }
                                                    onChange={(e) =>
                                                        createForm.setData(
                                                            "role",
                                                            e.target
                                                                .value as any
                                                        )
                                                    }
                                                >
                                                    <option value="praktisi_avt">
                                                        praktisi_avt
                                                    </option>
                                                    <option value="orangtua">
                                                        orangtua
                                                    </option>
                                                    <option value="admin">
                                                        admin
                                                    </option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium">
                                                    Password
                                                </div>
                                                <Input
                                                    type="password"
                                                    value={
                                                        createForm.data.password
                                                    }
                                                    onChange={(e) =>
                                                        createForm.setData(
                                                            "password",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="min 8 karakter"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => {
                                                    setIsCreating(false);
                                                    createForm.reset();
                                                }}
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={createForm.processing}
                                            >
                                                Simpan Akun
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        <div className="overflow-x-auto rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="w-[360px]">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((u) => {
                                        const isEditing = editingId === u.id;
                                        const isResetting = resetId === u.id;

                                        return (
                                            <TableRow key={u.id}>
                                                <TableCell>
                                                    {isEditing ? (
                                                        <Input
                                                            value={
                                                                updateForm.data
                                                                    .name
                                                            }
                                                            onChange={(e) =>
                                                                updateForm.setData(
                                                                    "name",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <span className="font-medium">
                                                            {u.name}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {isEditing ? (
                                                        <Input
                                                            type="email"
                                                            value={
                                                                updateForm.data
                                                                    .email
                                                            }
                                                            onChange={(e) =>
                                                                updateForm.setData(
                                                                    "email",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            {u.email}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {isEditing ? (
                                                        <select
                                                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                                            value={
                                                                updateForm.data
                                                                    .role as any
                                                            }
                                                            onChange={(e) =>
                                                                updateForm.setData(
                                                                    "role",
                                                                    e.target
                                                                        .value as any
                                                                )
                                                            }
                                                        >
                                                            <option value="praktisi_avt">
                                                                praktisi_avt
                                                            </option>
                                                            <option value="orangtua">
                                                                orangtua
                                                            </option>
                                                            <option value="admin">
                                                                admin
                                                            </option>
                                                        </select>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            {roleLabel[
                                                                u.role
                                                            ] ?? u.role}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {isEditing ? (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        saveEdit(
                                                                            u.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        updateForm.processing
                                                                    }
                                                                >
                                                                    Simpan
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="secondary"
                                                                    onClick={() =>
                                                                        setEditingId(
                                                                            null
                                                                        )
                                                                    }
                                                                >
                                                                    Batal
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="secondary"
                                                                    onClick={() =>
                                                                        startEdit(
                                                                            u
                                                                        )
                                                                    }
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="secondary"
                                                                    onClick={() =>
                                                                        startReset(
                                                                            u
                                                                        )
                                                                    }
                                                                >
                                                                    <RotateCcw className="mr-1 h-4 w-4" />
                                                                    Reset
                                                                    Password
                                                                </Button>
                                                            </>
                                                        )}

                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => {
                                                                if (
                                                                    u.role ===
                                                                    "admin"
                                                                ) {
                                                                    alert(
                                                                        "Tidak diizinkan menghapus akun admin."
                                                                    );
                                                                    return;
                                                                }
                                                                if (
                                                                    !confirm(
                                                                        "Hapus user ini?"
                                                                    )
                                                                )
                                                                    return;
                                                                window.location.href =
                                                                    route(
                                                                        "admin.users.destroy",
                                                                        u.id
                                                                    );
                                                            }}
                                                        >
                                                            <Trash2 className="mr-1 h-4 w-4" />
                                                            Hapus
                                                        </Button>
                                                    </div>

                                                    {isResetting && (
                                                        <div className="mt-3 flex w-full items-center gap-2 rounded-md border bg-muted/30 p-2">
                                                            <Input
                                                                type="password"
                                                                placeholder="Password baru (min 8)"
                                                                value={
                                                                    resetForm
                                                                        .data
                                                                        .password
                                                                }
                                                                onChange={(e) =>
                                                                    resetForm.setData(
                                                                        "password",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            <Button
                                                                size="sm"
                                                                onClick={() =>
                                                                    submitReset(
                                                                        u.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    resetForm.processing
                                                                }
                                                            >
                                                                Update
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                onClick={() =>
                                                                    setResetId(
                                                                        null
                                                                    )
                                                                }
                                                            >
                                                                Batal
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
