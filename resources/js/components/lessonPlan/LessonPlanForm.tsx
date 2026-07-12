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
                    <SessionInformation form={form} schedules={schedules} />

                    <GoalSection form={form} />

                    <ActivitySection
                        form={form}
                        addActivity={addActivity}
                        removeActivity={removeActivity}
                        updateActivity={updateActivity}
                    />

                    <LingSixSoundSection
                        form={form}
                        updateLingSound={updateLingSound}
                    />

                    <TherapistNoteSection form={form} />
                </div>

                <div className="space-y-6">
                    <PatientInformation form={form} schedules={schedules} />

                    <EvaluationSection form={form} />

                    <HomeProgramSection
                        form={form}
                        addExercise={addExercise}
                        removeExercise={removeExercise}
                        updateExercise={updateExercise}
                    />
                </div>
            </div>

            {/* FormActions sekarang hanya tombol. Validasi + submit tetap di parent/logic lain. */}
            <FormActions
                mode={lessonPlan ? "edit" : "create"}
                onSubmit={() => {
                    // sementara: fallback gunakan submit lama (tanpa UX validator belum dipasang di Tahap 1)
                    if (lessonPlan?.id) {
                        // useFormForm already contains put/post methods inside `form`
                        form.put(route("lesson-plans.update", lessonPlan.id));
                        return;
                    }
                    form.post(route("lesson-plans.store"));
                }}
            />
        </div>
    );
}
