import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import type {
    TherapyChartPoint,
    TherapyInsights,
    TherapyLessonPlan,
    SessionEvaluationChartData,
} from "@/types/therapy";
import { ProgressChart } from "@/components/therapy/ProgressChart";
import { ProgressSummary } from "@/components/therapy/ProgressSummary";
import LingSixSoundChart from "@/components/therapy/LingSixSoundChart";
import SessionEvaluationChart from "@/components/charts/SessionEvaluationChart";
import { TherapyHistory } from "@/Pages/OrangTua/Therapy/components/TherapyHistory";

type ChildProgressIndexProps = {
    progressSummary?: TherapyInsights | null;
    progressChart?: TherapyChartPoint[];
    lingSixSounds?: TherapyLessonPlan[];
    sessionEvaluationChart?: SessionEvaluationChartData[];
    therapyHistory?: TherapyLessonPlan[];
};

export default function ChildProgressIndex({
    progressSummary = null,
    progressChart = [],
    lingSixSounds = [],
    sessionEvaluationChart = [],
    therapyHistory = [],
}: ChildProgressIndexProps) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Progres Anak</h2>
                        <p className="text-sm text-muted-foreground">
                            Ringkasan statistik perkembangan terapi AVT.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Child Progress" />

            <div className="mx-auto max-w-6xl space-y-6 px-0">
                {/* 1) Ringkasan Progress */}
                <section>
                    {progressSummary ? (
                        <div className="rounded-2xl border bg-background p-4">
                            <ProgressSummary insights={progressSummary} />
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed bg-slate-50 p-8 text-center text-sm text-muted-foreground">
                            Belum ada data ringkasan progress.
                        </div>
                    )}
                </section>

                {/* 2) Ling Six Sound Assessment */}
                <section>
                    <LingSixSoundChart lessonPlans={lingSixSounds} />
                </section>

                {/* 3) Session Evaluation Progress */}
                <section>
                    <SessionEvaluationChart data={sessionEvaluationChart} />
                </section>

                {/* 4) Perkembangan Artikulasi */}
                <section>
                    <ProgressChart chartData={progressChart} />
                </section>

                {/* 5) Riwayat Terapi */}
                <section>
                    <TherapyHistory recentLessons={therapyHistory} />
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
