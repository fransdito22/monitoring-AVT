import Header from "./Header";
import ProgressStepper from "./ProgressStepper";
import SessionInformation from "./SessionInformation";
import PatientInformation from "./PatientInformation";
import GoalSection from "./GoalSection";
import ActivitySection from "./ActivitySection";
import LingSixSoundSection from "./LingSixSoundSection";
import EvaluationSection from "./EvaluationSection";
import HomeProgramSection from "./HomeProgramSection";
import TherapistNoteSection from "./TherapistNoteSection";
import FormActions from "./FormActions";

import { useLessonPlanForm } from "@/hooks/useLessonPlanForm";

interface LessonPlanFormProps {
    lessonPlan?: any;
    schedules: any[];
    mode?: "create" | "edit";
}

export default function LessonPlanForm({
    lessonPlan,
    schedules,
}: LessonPlanFormProps) {
    const {
        form,
        clientErrors,
        submit,

        // Activity
        addActivity,
        removeActivity,
        updateActivity,

        // Ling Six Sound
        updateLingSound,

        // Evaluation
        updateEvaluation,

        // Home Program
        addExercise,
        removeExercise,
        updateExercise,
    } = useLessonPlanForm({ lessonPlan });

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <SessionInformation
                        form={form}
                        schedules={schedules}
                        errors={clientErrors}
                    />

                    <GoalSection form={form} errors={clientErrors} />

                    <ActivitySection
                        form={form}
                        errors={clientErrors}
                        addActivity={addActivity}
                        removeActivity={removeActivity}
                        updateActivity={updateActivity}
                    />

                    <LingSixSoundSection
                        form={form}
                        errors={clientErrors}
                        updateLingSound={updateLingSound}
                    />

                    <TherapistNoteSection form={form} errors={clientErrors} />
                </div>

                <div className="space-y-6">
                    <PatientInformation
                        form={form}
                        schedules={schedules}
                        errors={clientErrors}
                    />

                    <EvaluationSection form={form} errors={clientErrors} />

                    <HomeProgramSection
                        form={form}
                        errors={clientErrors}
                        addExercise={addExercise}
                        removeExercise={removeExercise}
                        updateExercise={updateExercise}
                    />
                </div>
            </div>

            <FormActions
                mode={lessonPlan ? "edit" : "create"}
                onSubmit={() => {
                    if (lessonPlan?.id) {
                        submit(
                            route("lesson-plans.update", lessonPlan.id),
                            "put"
                        );
                        return;
                    }

                    submit(route("lesson-plans.store"), "post");
                }}
            />
        </div>
    );
}
