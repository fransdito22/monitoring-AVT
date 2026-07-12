import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import type {
    TherapyChartPoint,
    TherapyInsights,
    TherapyLessonPlan,
} from "@/types/therapy";
import { ProgressChart } from "@/components/therapy/ProgressChart";
import { ProgressSummary } from "@/components/therapy/ProgressSummary";
import LingSixSoundChart from "@/components/therapy/LingSixSoundChart";

type ChildProgressIndexProps = {
    progressSummary?: TherapyInsights | null;
    progressChart?: TherapyChartPoint[];
    lingSixSounds?: TherapyLessonPlan[];
};

export default function ChildProgressIndex({
    progressSummary = null,
    progressChart = [],
    lingSixSounds = [],
}: ChildProgressIndexProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Child Progress
                </h2>
            }
        >
            <Head title="Child Progress" />

            <div className="mx-auto max-w-6xl space-y-6 px-0">
                {/* 1) Progress Summary */}
                <section>
                    {progressSummary ? (
                        <div className="rounded-2xl border bg-background p-4">
                            <ProgressSummary insights={progressSummary} />
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed bg-slate-50 p-8 text-center text-sm text-muted-foreground">
                            Progress summary is not available yet.
                        </div>
                    )}
                </section>

                {/* 2) Progress Chart */}
                <section>
                    <ProgressChart chartData={progressChart} />
                </section>

                {/* 3) Ling Six Sound Chart */}
                <section>
                    <LingSixSoundChart lessonPlans={lingSixSounds} />
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
