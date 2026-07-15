import LessonPlanForm from "@/components/lessonPlan/LessonPlanForm";
import AuthenticatedLayout from "@/Layouts/AppLayout";

import type { Schedule } from "@/types/lessonPlan";

interface Props {
    schedules: Schedule[];
}

export default function Create({ schedules }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Sesi Terapi</h2>
                        <p className="text-sm text-muted-foreground">
                            Kelola seluruh lesson plan terapi AVT.
                        </p>
                    </div>
                </div>
            }
        >
            <LessonPlanForm schedules={schedules} mode="create" />
        </AuthenticatedLayout>
    );
}
