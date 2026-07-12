import AppLayout from "@/Layouts/AppLayout";

import LessonPlanForm from "@/components/lessonPlan/LessonPlanForm";

import type {
    LessonPlan,
    Schedule,
} from "@/types/lessonPlan";

interface Props {
    lessonPlan: LessonPlan;
    schedules: Schedule[];
}

export default function Edit({
    lessonPlan,
    schedules,
}: Props) {
    return (
        <AppLayout>

            <LessonPlanForm
                lessonPlan={lessonPlan}
                schedules={schedules}
                mode="edit"
            />

        </AppLayout>
    );
}