import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { Check, ChevronsUpDown, Calendar, Save, Users } from "lucide-react";

interface Parent {
    id: number;
    name: string;
    email: string;
}

interface Props {
    parents: Parent[];
}

export default function CreatePatient({ parents }: Props) {
    const [openParent, setOpenParent] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        birth_date: "",
        gender: "",
        parent_id: "",
        status: "aktif",
        notes: "",
        photo: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("patients.store"));
    };

    const selectedParent = parents.find(
        (parent) => String(parent.id) === data.parent_id
    );

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Pasien" />

            <div className="space-y-6">
                <Card className="border bg-card/80">
                    <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Tambahkan data pasien baru untuk terapi AVT.
                            </p>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight">
                                Form Tambah Pasien
                            </h1>
                        </div>
                        <div className="inline-flex h-fit items-center rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground">
                            <Users className="mr-1 h-3.5 w-3.5" />
                            Data Pasien
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border">
                    <CardHeader className="border-b">
                        <CardTitle className="text-xl font-semibold">
                            Tambah Pasien
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Lengkapi semua informasi berikut untuk membuat data
                            pasien baru.
                        </p>
                    </CardHeader>

                    <CardContent className="p-6 md:p-8">
                        <form onSubmit={submit} className="space-y-8">
                            {/* Foto */}
                            <div className="space-y-3">
                                <Label>Foto Pasien</Label>

                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="cursor-pointer"
                                    onChange={(e) =>
                                        setData(
                                            "photo",
                                            e.target.files?.[0] ?? null
                                        )
                                    }
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Nama */}
                                <div className="space-y-3">
                                    <Label>Nama Pasien</Label>

                                    <Input
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Masukkan nama pasien"
                                    />

                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Tanggal Lahir */}
                                <div className="space-y-3">
                                    <Label>Tanggal Lahir</Label>

                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                                        <Input
                                            type="date"
                                            className="pl-10"
                                            value={data.birth_date}
                                            onChange={(e) =>
                                                setData(
                                                    "birth_date",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Gender */}
                                <div className="space-y-3">
                                    <Label>Jenis Kelamin</Label>

                                    <Select
                                        value={data.gender}
                                        onValueChange={(value) =>
                                            setData("gender", String(value))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis kelamin" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="L">
                                                Laki-laki
                                            </SelectItem>

                                            <SelectItem value="P">
                                                Perempuan
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Orang Tua */}
                                <div className="space-y-3">
                                    <Label>Orang Tua</Label>

                                    <Popover
                                        open={openParent}
                                        onOpenChange={setOpenParent}
                                    >
                                    <PopoverTrigger>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                                {selectedParent ? (
                                                    selectedParent.name
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        Pilih orang tua
                                                    </span>
                                                )}

                                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-[420px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Cari nama orang tua..." />

                                                <CommandList>
                                                    <CommandEmpty>
                                                        Tidak ditemukan
                                                    </CommandEmpty>

                                                    <CommandGroup>
                                                        {parents.map(
                                                            (parent) => (
                                                                <CommandItem
                                                                    key={
                                                                        parent.id
                                                                    }
                                                                    value={`${parent.name} ${parent.email}`}
                                                                    onSelect={() => {
                                                                        setData(
                                                                            "parent_id",
                                                                            String(
                                                                                parent.id
                                                                            )
                                                                        );

                                                                        setOpenParent(
                                                                            false
                                                                        );
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={`mr-2 h-4 w-4 ${
                                                                            data.parent_id ===
                                                                            String(
                                                                                parent.id
                                                                            )
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        }`}
                                                                    />

                                                                    <div>
                                                                        <p className="font-medium">
                                                                            {
                                                                                parent.name
                                                                            }
                                                                        </p>

                                                                        <p className="text-xs text-muted-foreground">
                                                                            {
                                                                                parent.email
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </CommandItem>
                                                            )
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    {errors.parent_id && (
                                        <p className="text-sm text-red-500">
                                            {errors.parent_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-3">
                                <Label>Status Terapi</Label>

                                <Select
                                    value={data.status}
                                    onValueChange={(value) =>
                                        setData("status", String(value))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="aktif">
                                            Aktif
                                        </SelectItem>

                                        <SelectItem value="dalam_terapi">
                                            Dalam Terapi
                                        </SelectItem>

                                        <SelectItem value="tinjau_ulang">
                                            Tinjau Ulang
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Catatan */}
                            <div className="space-y-3">
                                <Label>Catatan Awal</Label>

                                <Textarea
                                    rows={5}
                                    placeholder="Masukkan catatan awal terapi pasien..."
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                />
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 border-t pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.visit(route("patients.praktisi"))
                                    }
                                >
                                    Batal
                                </Button>

                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Pasien
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
