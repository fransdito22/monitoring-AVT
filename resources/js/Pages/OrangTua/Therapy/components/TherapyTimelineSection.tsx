import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock3 } from "lucide-react";

type TimelineItem = {
    sessionNumber?: number | null;
    date?: string | null;
    therapistName?: string;
    evaluation?: string;
    improvementNotes?: string;
};

export function TherapyTimelineSection({
    timeline,
}: {
    timeline?: TimelineItem[] | null;
}) {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Clock3 className="h-5 w-5 text-cyan-600" />
                    Therapy Timeline
                </CardTitle>
            </CardHeader>
            <CardContent>
                {timeline?.length ? (
                    <ol className="space-y-4">
                        {timeline.map((item, idx) => (
                            <li
                                key={`${item.date ?? "na"}-${idx}`}
                                className="rounded-2xl border bg-background p-4"
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-800">
                                        Session #{item.sessionNumber ?? "-"}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {item.date ?? "-"}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm font-medium text-slate-800">
                                    Evaluation by {item.therapistName ?? "-"}
                                </p>
                                <p className="text-sm text-slate-700">
                                    “{item.evaluation ?? "—"}”
                                </p>

                                <div className="mt-3 rounded-xl bg-slate-50/70 p-3">
                                    <p className="text-xs font-semibold text-muted-foreground">
                                        Improvement Notes
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {item.improvementNotes ?? "—"}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Timeline akan muncul setelah sesi terapi berjalan.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
