import { useEffect, useMemo, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";

export default function ReportDetailDialog({ reports }: { reports: any[] }) {
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            const ce = e as CustomEvent;
            const id = ce?.detail?.id;
            if (!id) return;
            setSelectedId(String(id));
            setOpen(true);
        };

        window.addEventListener(
            "progress-report:select",
            handler as EventListener
        );
        return () =>
            window.removeEventListener(
                "progress-report:select",
                handler as EventListener
            );
    }, []);

    const selected = useMemo(() => {
        if (!selectedId) return null;
        return reports.find((r) => String(r.id) === selectedId) ?? null;
    }, [reports, selectedId]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="right" className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Detail Laporan</SheetTitle>
                </SheetHeader>

                {selected ? (
                    <div className="mt-4 space-y-4">
                        <Card className="rounded-2xl shadow-sm">
                            <CardContent className="p-4 space-y-2">
                                <div className="text-sm font-semibold">
                                    {selected.patient ?? "—"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Terapis: {selected.therapist ?? "—"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Tanggal sesi: {selected.session_date ?? "—"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Progress: {selected.progress ?? 0}%
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardContent className="p-4">
                                <div className="text-sm font-semibold mb-2">
                                    Rincian Target
                                </div>
                                {selected.details?.length ? (
                                    <div className="space-y-3">
                                        {selected.details.map(
                                            (d: any, idx: number) => (
                                                <div
                                                    key={`${selected.id}-detail-${idx}`}
                                                    className="rounded-xl border bg-background p-3"
                                                >
                                                    <div className="text-xs text-muted-foreground">
                                                        Kategori:{" "}
                                                        {d.category ?? "—"}
                                                    </div>
                                                    <div className="mt-1 text-sm font-semibold text-slate-800">
                                                        Word:{" "}
                                                        {d.target_word ?? "—"}
                                                    </div>
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        Fonem:{" "}
                                                        {d.target_phoneme ??
                                                            "—"}
                                                    </div>
                                                    {d.note ? (
                                                        <div className="mt-2 text-sm leading-relaxed text-slate-700">
                                                            {d.note}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground">
                                        Detail penilaian belum tersedia.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="mt-6 text-sm text-muted-foreground">
                        Pilih laporan untuk melihat detail.
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
