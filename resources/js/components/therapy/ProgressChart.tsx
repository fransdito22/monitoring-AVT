import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress as ProgressBar } from "@/components/ui/progress";

import { Activity, TrendingDown, TrendingUp } from "lucide-react";

import type { TherapyChartPoint } from "@/types/therapy";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { EmptyState } from "@/components/therapy/EmptyState";

type Props = {
    chartData: TherapyChartPoint[];
};

function getTrendIcon(points: TherapyChartPoint[]) {
    if (points.length < 2) return null;

    const first = points[0]?.progress;
    const last = points[points.length - 1]?.progress;

    if (first === undefined || last === undefined) return null;
    if (last > first)
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
    if (last < first)
        return <TrendingDown className="h-4 w-4 text-orange-600" />;
    return null;
}

export function ProgressChart({ chartData }: Props) {
    const hasData = chartData.length > 0;

    const trendIcon = getTrendIcon(chartData);

    return (
        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                        <Activity className="h-5 w-5 text-sky-600" />
                        Perkembangan Terapi per Sesi
                    </CardTitle>
                    <p className="mt-1 text-sm text-slate-600">
                        Grafik menunjukkan perkembangan kemampuan anak pada
                        setiap sesi terapi.
                    </p>
                </div>

                {trendIcon}
            </CardHeader>

            <CardContent>
                {!hasData ? (
                    <EmptyState
                        title="Belum ada data sesi"
                        description="Saat therapy berjalan, progres per sesi akan muncul di sini."
                    />
                ) : (
                    <div className="space-y-4">
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#e2e8f0"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: "#64748b", fontSize: 12 }}
                                        interval={0}
                                        tickFormatter={(value: string) => value}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        tick={{ fill: "#64748b", fontSize: 12 }}
                                        width={38}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 12,
                                            border: "1px solid #e2e8f0",
                                            boxShadow:
                                                "0 4px 14px rgba(15, 23, 42, 0.08)",
                                        }}
                                        formatter={(value: unknown) => {
                                            const v =
                                                typeof value === "number"
                                                    ? value
                                                    : 0;
                                            return [`${v}%`, "Progress"];
                                        }}
                                        labelFormatter={(label: unknown) => {
                                            return typeof label === "string"
                                                ? label
                                                : "";
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="progress"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        dot={{
                                            r: 4,
                                            fill: "#2563eb",
                                            stroke: "white",
                                            strokeWidth: 2,
                                        }}
                                        activeDot={{ r: 6 }}
                                        isAnimationActive={true}
                                        strokeLinecap="round"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-sm text-slate-600">
                                        Progress awal
                                    </div>
                                    <div className="mt-1 font-semibold text-slate-900">
                                        {chartData[0]?.progress ?? 0}%
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <ProgressBar
                                        value={chartData[0]?.progress ?? 0}
                                    />
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-600">
                                        Progress terbaru
                                    </div>
                                    <div className="mt-1 font-semibold text-slate-900">
                                        {chartData[chartData.length - 1]
                                            ?.progress ?? 0}
                                        %
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
