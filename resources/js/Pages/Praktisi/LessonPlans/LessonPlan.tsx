import LessonPlanTable from "@/components/lessonPlan/LessonPlanTable";

import { Link } from "@inertiajs/react";

import { Button } from "@/components/ui/button";

import type { LessonPlan } from "@/types/lessonPlan";
import AuthenticatedLayout from "@/Layouts/AppLayout";

interface Props {
    lessonPlans: LessonPlan[];
}

export default function Index({ lessonPlans }: Props) {
    const lessonPlansForTable = lessonPlans.map((lp) => ({
        ...lp,
        session_date: lp.session_date ?? "",
    }));

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
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="default">
                        <Link href={route("lesson-plans.create")}>
                            Tambah Sesi Terapi
                        </Link>
                    </Button>
                </div>

                <LessonPlanTable lessonPlans={lessonPlansForTable as any} />
            </div>
        </AuthenticatedLayout>
    );
}
