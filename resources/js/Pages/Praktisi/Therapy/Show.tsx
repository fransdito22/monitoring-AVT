import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

import type { TherapyShowProps } from "@/types/therapy";

import { Button } from "@/components/ui/button";

import { TherapyHeader } from "@/components/therapy/TherapyHeader";
import { PatientSummaryCard } from "@/components/therapy/PatientSummaryCard";
import { StatisticCards } from "@/components/therapy/StatisticCards";
import { ProgressChart } from "@/components/therapy/ProgressChart";
import { ProgressSummary } from "@/components/therapy/ProgressSummary";
import { TherapyTabs } from "@/components/therapy/TherapyTabs";
import LingSixSoundChart from "@/components/therapy/LingSixSoundChart";

export default function Show({
    patient,
    statistics,
    chartData,
    insights,
    tabs,
}: TherapyShowProps) {
    console.log("Lesson Plan:", tabs.lessonPlans);
    console.log("Lesson Plan pertama:", tabs.lessonPlans[0]);
    return (
        <AuthenticatedLayout
            header={
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <TherapyHeader
                            title="Detail Terapi Anak"
                            subtitle="Monitoring perkembangan terapi anak"
                        />
                    </div>
                </div>
            }
        >
            <Link href={route("patients.praktisi")}>
                <Button variant="outline" className="rounded-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar
                </Button>
            </Link>
            <Head title={`Detail Terapi Anak - ${patient.name}`} />

            <div className="min-h-[calc(100vh-6rem)] space-y-6 bg-slate-50 p-6">
                <PatientSummaryCard
                    patient={patient}
                    progressPercent={statistics.progressPercent}
                />

                <StatisticCards statistics={statistics} />

                <LingSixSoundChart lessonPlans={tabs.lessonPlans} />

                <ProgressChart chartData={chartData} />

                <ProgressSummary insights={insights} />

                <TherapyTabs tabs={tabs} />
            </div>
        </AuthenticatedLayout>
    );
}
