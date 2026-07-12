import { Card, CardContent } from "@/components/ui/card";

export default function ReportSummary({ summary }: { summary: any }) {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <div className="text-xs text-muted-foreground">
                            Total sesi
                        </div>
                        <div className="mt-1 text-2xl font-bold">
                            {summary?.totalSessions ?? 0}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-muted-foreground">
                            Rata-rata progress
                        </div>
                        <div className="mt-1 text-2xl font-bold">
                            {summary?.averageProgress ?? 0}%
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-muted-foreground">
                            Rentang tanggal
                        </div>
                        <div className="mt-1 text-sm font-semibold">
                            {summary?.dateRange ?? "—"}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
