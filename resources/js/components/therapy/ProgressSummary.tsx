import { Card, CardContent } from "@/components/ui/card";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import type { TherapyInsights } from "@/types/therapy";

export function ProgressSummary({ insights }: { insights: TherapyInsights }) {
    const trend = insights.trend;

    const TrendIndicator = () => {
        if (trend === "naik") {
            return (
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-medium">📈 Naik</span>
                </div>
            );
        }

        if (trend === "turun") {
            return (
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-orange-700">
                    <ArrowDownRight className="h-4 w-4 rotate-180" />
                    <span className="text-sm font-medium">📉 Turun</span>
                </div>
            );
        }

        return (
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-slate-700">
                <span className="text-sm font-medium">➖ Stabil</span>
            </div>
        );
    };

    const scoreAwal = insights.scoreAwal ?? 0;
    const scoreTerbaru = insights.scoreTerbaru ?? 0;
    const selisih = insights.selisih ?? 0;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                <CardContent className="p-5">
                    <div className="text-sm text-slate-600">Progress Awal</div>
                    <div className="mt-2 text-3xl font-bold text-slate-900">
                        {scoreAwal}%
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                <CardContent className="p-5">
                    <div className="text-sm text-slate-600">
                        Progress Terakhir
                    </div>
                    <div className="mt-2 text-3xl font-bold text-slate-900">
                        {scoreTerbaru}%
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                <CardContent className="p-5">
                    <div className="text-sm text-slate-600">Peningkatan</div>
                    <div className="mt-2 text-3xl font-bold text-slate-900">
                        {selisih >= 0 ? `+${selisih}%` : `${selisih}%`}
                    </div>

                    <div className="mt-3">
                        <TrendIndicator />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
