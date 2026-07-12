import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

export default function ReportFilter({ reports }: { reports: any[] }) {
    const [query, setQuery] = useState("");

    const filteredCount = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return reports.length;

        return reports.filter((r) => {
            const therapist = (r?.therapist ?? "").toLowerCase();
            const patient = (r?.patient ?? "").toLowerCase();
            const session = (r?.session_date ?? "").toLowerCase();
            return (
                therapist.includes(q) ||
                patient.includes(q) ||
                session.includes(q)
            );
        }).length;
    }, [query, reports]);

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="text-sm font-semibold">Filter</div>
                        <div className="text-xs text-muted-foreground">
                            Cari berdasarkan nama therapist / pasien / tanggal
                            sesi
                        </div>
                    </div>

                    <div className="w-full sm:w-80">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ketik untuk memfilter…"
                        />
                        <div className="mt-2 text-xs text-muted-foreground">
                            Tersedia: {filteredCount} / {reports.length}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
