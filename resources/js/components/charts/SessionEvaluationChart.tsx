import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { SessionEvaluationChartData } from "@/types/therapy";

type Props = {
    data: SessionEvaluationChartData[];
};

const COLORS: Record<string, string> = {
    listening: "#2563EB",
    speech: "#16A34A",
    language: "#EA580C",
    attention: "#9333EA",
};

const LABELS: Record<string, string> = {
    listening: "Listening",
    speech: "Speech",
    language: "Language",
    attention: "Attention",
};

const EVALUATION_LABEL: Record<number, string> = {
    1: "Kurang",
    2: "Cukup",
    3: "Baik",
    4: "Sangat Baik",
};

const KEYS = ["listening", "speech", "language", "attention"] as const;

export default function SessionEvaluationChart({ data }: Props) {
    if (data.length === 0) {
        return (
            <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">
                        Session Evaluation Progress
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Belum ada data evaluasi sesi.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader>
                <CardTitle className="text-base">
                    Session Evaluation Progress
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="h-[250px] sm:h-[280px] md:h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                            />
                            <XAxis dataKey="session" />
                            <YAxis
                                domain={[1, 4]}
                                ticks={[1, 2, 3, 4]}
                                tickFormatter={(value: number) =>
                                    EVALUATION_LABEL[value] ?? String(value)
                                }
                            />
                            <Legend />

                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (
                                        !active ||
                                        !payload ||
                                        payload.length === 0
                                    )
                                        return null;

                                    const sessionLabel =
                                        typeof label === "string" ? label : "";

                                    const points = KEYS.map((key) => {
                                        const found = payload.find(
                                            (p) => p.name === key
                                        );
                                        const raw = found?.value;
                                        const value =
                                            typeof raw === "number"
                                                ? raw
                                                : null;
                                        return { key, value };
                                    });

                                    return (
                                        <div className="max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                                            <div className="text-sm font-semibold text-slate-900">
                                                Sesi : {sessionLabel}
                                            </div>

                                            <div className="mt-2 space-y-1">
                                                {points.map((p) => (
                                                    <div
                                                        key={p.key}
                                                        className="text-sm text-slate-700"
                                                    >
                                                        <span className="font-medium">
                                                            {LABELS[p.key]} :{" "}
                                                        </span>
                                                        <span className="font-semibold">
                                                            {p.value === null
                                                                ? "-"
                                                                : EVALUATION_LABEL[
                                                                      p.value
                                                                  ] ??
                                                                  String(
                                                                      p.value
                                                                  )}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }}
                            />

                            {KEYS.map((key) => (
                                <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    name={key}
                                    stroke={COLORS[key]}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                    connectNulls={false}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
