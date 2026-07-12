import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import type { TherapyArticulationReport } from "@/types/therapy";

const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
};

export function ReportCard({ report }: { report: TherapyArticulationReport }) {
    return (
        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="text-xs text-slate-500">Tanggal</div>
                        <div className="text-sm font-semibold text-slate-900">
                            {formatDate(report.tanggal ?? undefined) ?? "-"}
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-xs text-slate-500">Progress</div>
                        <div className="text-sm font-semibold text-slate-900">
                            {report.progress}%
                        </div>
                    </div>
                </div>

                {report.summary ? (
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs text-slate-500">Summary</div>
                        <div className="mt-1 text-sm font-medium text-slate-900">
                            {report.summary}
                        </div>
                    </div>
                ) : null}

                <div className="mt-4">
                    <Progress value={report.progress} />
                    <div className="mt-2 flex flex-wrap gap-2">
                        {report.detailArtikulasi.map((d, idx) => (
                            <div
                                key={`${d.category}-${idx}`}
                                className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                            >
                                {d.category}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {report.detailArtikulasi.map((d, idx) => (
                        <div
                            key={`${d.category}-${idx}`}
                            className="rounded-2xl border border-slate-200 p-4"
                        >
                            <div className="text-xs text-slate-500">
                                Kategori
                            </div>
                            <div className="text-sm font-semibold text-slate-900">
                                {d.category}
                            </div>

                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                <div>
                                    <div className="text-xs text-slate-500">
                                        Target Word
                                    </div>
                                    <div className="text-sm font-medium text-slate-900">
                                        {d.target_word}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">
                                        Target Phoneme
                                    </div>
                                    <div className="text-sm font-medium text-slate-900">
                                        {d.target_phoneme}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="text-xs text-slate-500">
                                    Catatan
                                </div>
                                <div className="text-sm font-medium text-slate-900">
                                    {d.note ?? "-"}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
