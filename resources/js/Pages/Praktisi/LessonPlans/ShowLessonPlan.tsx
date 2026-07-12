import AppLayout from "@/Layouts/AppLayout";

import LessonPlanDetail from "@/components/lessonPlan/LessonPlanDetail";

import type { LessonPlan } from "@/types/lessonPlan";

interface Props {
    lessonPlan: LessonPlan;
}

export default function Show({
    lessonPlan,
}: Props) {
    return (
        <AppLayout>

            <LessonPlanDetail
                lessonPlan={lessonPlan}
            />

        </AppLayout>
    );
}