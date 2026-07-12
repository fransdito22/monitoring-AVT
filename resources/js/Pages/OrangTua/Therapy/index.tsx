import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";

import type {
    TherapyLessonPlan,
    TherapyEvaluation,
    HomeProgram,
} from "@/types/therapy";

import { CurrentGoalCard } from "./components/CurrentGoalCard";
import { HomeProgramCard } from "./components/HomeProgramCard";
import { EvaluationCard } from "./components/EvaluationCard";
import { TherapyHistory } from "./components/TherapyHistory";
import { TherapyTimelineSection } from "./components/TherapyTimelineSection";

type TherapyGoal = {
    title: string;
    description: string;
};

type TherapyPageProps = {
    currentGoal?: TherapyGoal | null;
    homeProgram?: HomeProgram[] | null;
    evaluation?: TherapyEvaluation | null;
    recentLessons?: TherapyLessonPlan[] | null;
    timeline?: Array<{
        sessionNumber?: number | null;
        date?: string | null;
        therapistName?: string;
        evaluation?: string;
        improvementNotes?: string;
    }> | null;
};

export default function TherapyIndex(props: TherapyPageProps) {
    const {
        currentGoal = null,
        homeProgram = [],
        evaluation = null,
        recentLessons = [],
        timeline = [],
    } = props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Therapy AVT
                </h2>
            }
        >
            <Head title="Therapy AVT" />

            <div className="mx-auto max-w-6xl space-y-6 px-0 py-2">
                <CurrentGoalCard currentGoal={currentGoal} />
                <HomeProgramCard homeProgram={homeProgram} />
                <EvaluationCard evaluation={evaluation} />
                <TherapyHistory recentLessons={recentLessons} />
                <TherapyTimelineSection timeline={timeline} />
            </div>
        </AuthenticatedLayout>
    );
}
