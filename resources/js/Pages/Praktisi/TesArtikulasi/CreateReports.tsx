import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";

import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Patient {
    id: number;
    name: string;
    photo: string | null;
    progress: number;
    status: string;
}

interface Props {
    patient: Patient;
}

type Category = "Normal" | "Omisi" | "Distorsi" | "Adisi" | "Substitusi";

interface DetailRow {
    target_word: string;
    target_phoneme: string;
    category: Category;
    note: string;
}

export default function CreateReports({ patient }: Props) {
    const [summary, setSummary] = useState("");

    const [details, setDetails] = useState<DetailRow[]>([
        {
            target_word: "",
            target_phoneme: "",
            category: "Normal",
            note: "",
        },
    ]);

    const addRow = () => {
        setDetails([
            ...details,
            {
                target_word: "",
                target_phoneme: "",
                category: "Normal",
                note: "",
            },
        ]);
    };

    const removeRow = (index: number) => {
        setDetails(details.filter((_, i) => i !== index));
    };

    const updateRow = (
        index: number,
        field: keyof DetailRow,
        value: string
    ) => {
        const updated = [...details];

        updated[index] = {
            ...updated[index],
            [field]: value,
        };

        setDetails(updated);
    };

    const handleSubmit = () => {
        router.post(route("reports.store"), {
            patient_id: patient.id,
            summary,
            details: details.map((d) => ({
                target_word: d.target_word,
                target_phoneme: d.target_phoneme,
                category: d.category as string,
                note: d.note,
            })),
        });
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
            <Head title="Tambah Penilaian" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                </div>

                {/* Patient Card */}
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                {patient.photo ? (
                                    <img
                                        src={`/storage/${patient.photo}`}
                                        alt={patient.name}
                                        className="h-16 w-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xl font-bold">
                                        {patient.name.charAt(0)}
                                    </span>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">
                                    {patient.name}
                                </h3>

                                <div className="mt-1 flex gap-2">
                                    <Badge>{patient.status}</Badge>

                                    <Badge variant="outline">
                                        Progress {patient.progress}%
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary */}
                {/* <Card>
                    <CardHeader>
                        <CardTitle>Catatan</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <textarea
                            className="min-h-30 w-full rounded-md border p-3"
                            placeholder="Tuliskan kesimpulan terapi..."
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                    </CardContent>
                </Card> */}

                {/* Detail Penilaian */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Detail Penilaian Fonem</CardTitle>

                        <Button onClick={addRow} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {details.map((detail, index) => (
                            <div key={index} className="rounded-lg border p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <h4 className="font-medium">
                                        Penilaian #{index + 1}
                                    </h4>

                                    {details.length > 1 && (
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeRow(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm">
                                            Kata Target
                                        </label>

                                        <Input
                                            value={detail.target_word}
                                            onChange={(e) =>
                                                updateRow(
                                                    index,
                                                    "target_word",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm">
                                            Fonem Target
                                        </label>

                                        <Input
                                            value={detail.target_phoneme}
                                            onChange={(e) =>
                                                updateRow(
                                                    index,
                                                    "target_phoneme",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="mb-2 block text-sm">
                                        Kategori
                                    </label>

                                    <select
                                        className="w-full rounded-md border p-2"
                                        value={detail.category}
                                        onChange={(e) =>
                                            updateRow(
                                                index,
                                                "category",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option>Normal</option>

                                        <option>Omisi</option>

                                        <option>Distorsi</option>

                                        <option>Adisi</option>

                                        <option>Substitusi</option>
                                    </select>
                                </div>

                                <div className="mt-4">
                                    <label className="mb-2 block text-sm">
                                        Catatan
                                    </label>

                                    <textarea
                                        className="min-h-22.5 w-full rounded-md border p-3"
                                        value={detail.note}
                                        onChange={(e) =>
                                            updateRow(
                                                index,
                                                "note",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Submit */}
                <Card>
                    <CardContent className="flex justify-end p-5">
                        <Button size="lg" onClick={handleSubmit}>
                            <Save className="mr-2 h-4 w-4" />
                            Simpan Penilaian
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
