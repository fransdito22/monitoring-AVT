import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReportList({ reports }: { reports: any[] }) {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="text-sm font-semibold">
                            Daftar Laporan
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {reports.length} sesi ditemukan
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {reports.length ? (
                        reports.map((r) => (
                            <div
                                key={r.id}
                                className="flex items-start justify-between gap-4 rounded-xl border bg-background p-4"
                            >
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-slate-800">
                                        {r.patient ?? "—"}
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        Terapis: {r.therapist ?? "—"}
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        Tanggal sesi: {r.session_date ?? "—"}
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        Progress: {r.progress ?? 0}%
                                    </div>
                                </div>

                                <div className="shrink-0">
                                    {/* Sheet/dialog handles detail, so just show CTA placeholder */}
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            // no-op: selection handled in ReportDetailDialog
                                            window.dispatchEvent(
                                                new CustomEvent(
                                                    "progress-report:select",
                                                    {
                                                        detail: { id: r.id },
                                                    }
                                                )
                                            );
                                        }}
                                    >
                                        Lihat Detail
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center text-sm text-muted-foreground">
                            Belum ada laporan terapi.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
