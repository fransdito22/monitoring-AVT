import LessonPlanCard from "@/components/therapy/LessonPlanCard";

import { Card, CardContent } from "@/components/ui/card";
import type { TherapyLessonPlan } from "@/types/therapy";

import LingSixSoundChart from "@/components/therapy/LingSixSoundChart";

export function LessonPlanList({
    lessonPlans,
}: {
    lessonPlans: TherapyLessonPlan[];
}) {
    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {lessonPlans.map((p) => (
                <LessonPlanCard key={p.id} lessonPlan={p} />
            ))}

            {lessonPlans.length === 0 ? (
                <div className="lg:col-span-2" />
            ) : null}
        </div>
    );
}
