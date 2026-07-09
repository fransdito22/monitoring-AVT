import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import { LessonPlanList } from "@/components/therapy/LessonPlanList";
import { ReportList } from "@/components/therapy/ReportList";
import { TherapyTimeline } from "@/components/therapy/TherapyTimeline";

import type {
    TherapyArticulationReport,
    TherapyLessonPlan,
    TherapyTimelineEvent,
} from "@/types/therapy";

type Props = {
    tabs: {
        lessonPlans: TherapyLessonPlan[];
        articulationReports: TherapyArticulationReport[];
        timeline: TherapyTimelineEvent[];
    };
};

type TabKey = "lesson_plans" | "articulation_reports" | "timeline";

const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "lesson_plans", label: "Lesson Plan" },
    { key: "articulation_reports", label: "Tes Artikulasi" },
    { key: "timeline", label: "Timeline" },
];

export function TherapyTabs({ tabs: tabData }: Props) {
    const [active, setActive] = useState<TabKey>("lesson_plans");

    const content = useMemo(() => {
        if (active === "lesson_plans") {
            return <LessonPlanList lessonPlans={tabData.lessonPlans} />;
        }

        if (active === "articulation_reports") {
            return <ReportList reports={tabData.articulationReports} />;
        }

        return <TherapyTimeline events={tabData.timeline} />;
    }, [active, tabData]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                {tabs.map((t) => {
                    const isActive = t.key === active;
                    return (
                        <Button
                            key={t.key}
                            type="button"
                            variant={isActive ? "default" : "outline"}
                            className={
                                isActive
                                    ? "rounded-full"
                                    : "rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            }
                            onClick={() => setActive(t.key)}
                        >
                            {t.label}
                        </Button>
                    );
                })}
            </div>

            {content}
        </div>
    );
}
