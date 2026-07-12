import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import type { TherapyStatistics } from "@/types/therapy";

import { WelcomeBanner } from "./components/WelcomeBanner";
import { ChildProfileCard } from "./components/ChildProfileCard";
import { TherapySummaryCard } from "./components/TherapySummaryCard";
import { CurrentGoalCard } from "./components/CurrentGoalCard";
import { NextScheduleCard } from "./components/NextScheduleCard";

type NextSchedulePayload = {
    id: string;
    date: string | null;
    time: string | null;
    therapist: string | null;
    lokasi: string | null;
};

type OrangTuaDashboardProps = {
    childProfile: {
        id: string;
        name: string;
        gender: string | null;
        therapyStatus: string;
        photoUrl: string | null;
        age?: number | null;
    } | null;
    statistics: TherapyStatistics | null;
    currentGoal: {
        title: string;
        description: string;
        completion: number | null;
        long_term_goal: string | null;
        short_term_goal: string | null;
    } | null;
    nextSchedule: NextSchedulePayload | null;
};

export default function OrangTuaDashboard({
    childProfile,
    statistics,
    currentGoal,
    nextSchedule,
}: OrangTuaDashboardProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Dashboard Orang Tua
                </h2>
            }
        >
            <Head title="Dashboard Orang Tua" />

            <div className="space-y-6">
                <WelcomeBanner />

                <div className="grid gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-4">
                        <ChildProfileCard childProfile={childProfile} statistics={statistics} />

                        <CurrentGoalCard currentGoal={currentGoal} />

                        <NextScheduleCard nextSchedule={nextSchedule} />
                    </div>

                    <div className="space-y-6 xl:col-span-8">
                        <TherapySummaryCard statistics={statistics} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
