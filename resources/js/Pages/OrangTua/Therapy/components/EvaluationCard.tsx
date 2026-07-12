import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";
import type { TherapyEvaluation } from "@/types/therapy";

export function EvaluationCard({
    evaluation,
}: {
    evaluation?: TherapyEvaluation | null;
}) {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Stethoscope className="h-5 w-5 text-sky-600" />
                    Latest Evaluation
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!evaluation ? (
                    <p className="text-sm text-muted-foreground">
                        No evaluation has been recorded yet.
                    </p>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-xl border bg-slate-50/60 p-4">
                            <p className="text-xs font-semibold text-muted-foreground">
                                Overall assessment
                            </p>
                            <p className="mt-2 text-sm text-slate-700">
                                {(evaluation as any).overallAssessment ??
                                    (evaluation as any).assessment ??
                                    "—"}
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-xl border bg-background p-4">
                                <p className="text-xs font-semibold text-muted-foreground">
                                    Strengths
                                </p>
                                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                    {Array.isArray(
                                        (evaluation as any).strengths
                                    ) &&
                                    (evaluation as any).strengths.length ? (
                                        (evaluation as any).strengths.map(
                                            (s: string, i: number) => (
                                                <li key={`${s}-${i}`}>• {s}</li>
                                            )
                                        )
                                    ) : (
                                        <li>—</li>
                                    )}
                                </ul>
                            </div>

                            <div className="rounded-xl border bg-background p-4">
                                <p className="text-xs font-semibold text-muted-foreground">
                                    Areas for improvement
                                </p>
                                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                    {Array.isArray(
                                        (evaluation as any).areasForImprovement
                                    ) &&
                                    (evaluation as any).areasForImprovement
                                        .length ? (
                                        (
                                            evaluation as any
                                        ).areasForImprovement.map(
                                            (s: string, i: number) => (
                                                <li key={`${s}-${i}`}>• {s}</li>
                                            )
                                        )
                                    ) : (
                                        <li>—</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="rounded-xl border bg-background p-4">
                            <p className="text-xs font-semibold text-muted-foreground">
                                Home practice recommendations
                            </p>
                            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                {Array.isArray(
                                    (evaluation as any)
                                        .homePracticeRecommendations
                                ) &&
                                (evaluation as any).homePracticeRecommendations
                                    .length ? (
                                    (
                                        evaluation as any
                                    ).homePracticeRecommendations.map(
                                        (s: string, i: number) => (
                                            <li key={`${s}-${i}`}>• {s}</li>
                                        )
                                    )
                                ) : (
                                    <li>—</li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
