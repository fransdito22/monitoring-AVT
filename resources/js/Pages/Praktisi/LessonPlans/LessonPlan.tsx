import AppLayout from "@/Layouts/AppLayout";

import LessonPlanTable from "@/components/lessonPlan/LessonPlanTable";

import { Link } from "@inertiajs/react";

import { Button } from "@/components/ui/button";

import type { LessonPlan } from "@/types/lessonPlan";

interface Props {
    lessonPlans: LessonPlan[];
}

export default function Index({ lessonPlans }: Props) {
    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Lesson Plan</h1>

                        <p className="text-muted-foreground">
                            Kelola seluruh lesson plan terapi AVT.
                        </p>
                    </div>

                    <Button variant="default">
                        <Link href={route("lesson-plans.create")}>
                            Tambah Lesson Plan
                        </Link>
                    </Button>
                </div>

                <LessonPlanTable lessonPlans={lessonPlans} />
            </div>
        </AppLayout>
    );
}
