import AppLayout from "@/Layouts/AppLayout";

import LessonPlanForm from "@/components/lessonPlan/LessonPlanForm";

import type { Schedule } from "@/types/lessonPlan";

interface Props {
    schedules: Schedule[];
}

export default function Create({ schedules }: Props) {
    return (
        <AppLayout>

            <LessonPlanForm
                schedules={schedules}
                mode="create"
            />

        </AppLayout>
    );
}