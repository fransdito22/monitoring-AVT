import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import type { TherapyLessonPlan } from "@/types/therapy";
import LessonPlanCard from "@/components/therapy/LessonPlanCard";

export function TherapyHistory({
    recentLessons,
}: {
    recentLessons?: TherapyLessonPlan[] | null;
}) {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                    <ClipboardList className="h-5 w-5 text-cyan-600" />
                    Recent Therapy History
                </CardTitle>
            </CardHeader>
            <CardContent>
                {recentLessons?.length ? (
                    <div className="space-y-4">
                        {recentLessons.slice(0, 5).map((lp) => (
                            <LessonPlanCard key={lp.id} lessonPlan={lp} />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Riwayat terapi terbaru belum tersedia.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
