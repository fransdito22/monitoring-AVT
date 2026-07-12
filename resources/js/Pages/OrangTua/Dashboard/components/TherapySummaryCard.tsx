import type { TherapyStatistics } from "@/types/therapy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { StatisticCards } from "@/components/therapy/StatisticCards";
import { ProgressSummary } from "@/components/therapy/ProgressSummary";
import type { TherapyInsights } from "@/types/therapy";

type Props = {
    statistics: TherapyStatistics | null;
};

export function TherapySummaryCard({ statistics }: Props) {
    const insights: TherapyInsights = (() => {
        if (!statistics) {
            return {
                scoreAwal: null,
                scoreTerbaru: null,
                selisih: null,
                trend: "stabil",
            };
        }

        return {
            scoreAwal: null,
            scoreTerbaru: statistics.progressPercent ?? null,
            selisih: null,
            trend: "stabil",
        };
    })();

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                    <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                    Therapy Progress Summary
                </CardTitle>
            </CardHeader>

            <CardContent>
                {statistics ? (
                    <>
                        <StatisticCards statistics={statistics} />
                        <div className="mt-6">
                            <ProgressSummary insights={insights} />
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Statistik belum tersedia.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
