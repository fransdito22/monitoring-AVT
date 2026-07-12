import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

type DashboardSummary = {
    totalPatients: number;
    activePatients: number;
    inTherapyPatients: number;
    progressRate: number;
    lessonPlansTotal: number;
    lessonPlansToday: number;
    reportsTotal: number;
    reportsToday: number;
};

export function PatientProgressCard({
    summary,
}: {
    summary?: DashboardSummary;
}) {
    const rate = summary?.progressRate ?? 0;

    return (
        <Card className="rounded-xl shadow-sm border">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-base font-semibold">
                            Patient Progress
                        </CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ringkasan progress rata-rata pasien.
                        </p>
                    </div>

                    <Badge variant="secondary" className="rounded-xl">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        Avg
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="flex items-baseline justify-between gap-4">
                        <div>
                            <div className="text-3xl font-bold leading-none">
                                {rate}%
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">
                                Rata-rata
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Progress value={rate} className="h-2 rounded-full" />
                    </div>

                    {summary == null && (
                        <div className="mt-3 text-sm text-muted-foreground">
                            Belum ada data progress.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
