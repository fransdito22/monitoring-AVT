import { useForm } from "@inertiajs/react";

import type {
    Activity,
    HomeExercise,
    Evaluation,
    LessonPlanFormData,
    LingSound,
} from "@/types/lessonPlan";

import {
    DEFAULT_ACTIVITY,
    DEFAULT_EVALUATION,
    DEFAULT_HOME_EXERCISE,
    DEFAULT_LING_SOUNDS,
} from "../types/features/lesson-plan/constants";


interface Props {
    lessonPlan?: Partial<LessonPlanFormData>;
}


export function useLessonPlanForm({ lessonPlan }: Props = {}) {
    const normalizedLingSixSounds = (() => {
        const lp: any = lessonPlan;

        // 1) Preferred: snake_case from API
        if (Array.isArray(lp?.ling_six_sounds) && lp.ling_six_sounds.length) {
            return lp.ling_six_sounds;
        }

        // 2) Fallback: camelCase from API + `{ sound, level }`
        if (Array.isArray(lp?.lingSixSounds) && lp.lingSixSounds.length) {
            return lp.lingSixSounds.map((item: any) => ({
                sound: String(item?.sound ?? ""),
                level: Number(item?.level ?? 0),
                note: item?.note ?? "",
            }));
        }

        // 3) Fallback: whatever exists in `ling_six_sounds`, but with different field names
        if (Array.isArray(lp?.ling_six_sounds) && lp.ling_six_sounds.length) {
            return lp.ling_six_sounds.map((item: any) => ({
                sound: String(item?.sound ?? ""),
                // Frontend previously used `response`; backend expects `level`.
                level:
                    item?.level !== undefined && item?.level !== null
                        ? Number(item.level)
                        : Number(item?.response ?? 0),
                note: item?.note ?? "",
            }));
        }

        // 4) Default
        return DEFAULT_LING_SOUNDS.map((item) => ({ ...item }));
    })();


    const form = useForm<LessonPlanFormData>({

        schedule_id: lessonPlan?.schedule_id ?? "",
        session_date: lessonPlan?.session_date ?? "",
        session_number: lessonPlan?.session_number ?? 1,
        goal: lessonPlan?.goal ?? "",

        activities:
            lessonPlan?.activities?.length
                ? lessonPlan.activities
                : [{ ...DEFAULT_ACTIVITY }],

        ling_six_sounds: normalizedLingSixSounds,

        evaluation:
            lessonPlan?.evaluation ?? { ...DEFAULT_EVALUATION },

        home_program:
            lessonPlan?.home_program?.length
                ? lessonPlan.home_program
                : [{ ...DEFAULT_HOME_EXERCISE }],

        therapist_note: lessonPlan?.therapist_note ?? "",
    });

    /*
    |--------------------------------------------------------------------------
    | Activity
    |--------------------------------------------------------------------------
    */

    const addActivity = () => {
        form.setData("activities", [
            ...form.data.activities,
            { ...DEFAULT_ACTIVITY },
        ]);
    };

    const removeActivity = (index: number) => {
        form.setData(
            "activities",
            form.data.activities.filter((_, i) => i !== index)
        );
    };

    const updateActivity = (
        index: number,
        field: keyof Activity,
        value: any
    ) => {
        const activities = [...form.data.activities];

        activities[index] = {
            ...activities[index],
            [field]: value,
        };

        form.setData("activities", activities);
    };

    /*
    |--------------------------------------------------------------------------
    | Ling Six Sound
    |--------------------------------------------------------------------------
    */

    const updateLingSound = (
        index: number,
        field: keyof LingSound,
        value: any
    ) => {
        const sounds = [...form.data.ling_six_sounds];

        sounds[index] = {
            ...sounds[index],
            [field]: value,
        };

        form.setData("ling_six_sounds", sounds);
    };

    /*
    |--------------------------------------------------------------------------
    | Evaluation
    |--------------------------------------------------------------------------
    */

    const updateEvaluation = (
        field: keyof Evaluation,
        value: any
    ) => {
        form.setData("evaluation", {
            ...form.data.evaluation,
            [field]: value,
        });
    };


    /*
    |--------------------------------------------------------------------------
    | Home Program
    |--------------------------------------------------------------------------
    */

    const addExercise = () => {
        form.setData("home_program", [
            ...form.data.home_program,
            { ...DEFAULT_HOME_EXERCISE },
        ]);
    };

    const removeExercise = (index: number) => {
        form.setData(
            "home_program",
            form.data.home_program.filter((_, i) => i !== index)
        );
    };

    const updateExercise = (
        index: number,
        field: keyof HomeExercise,
        value: string
    ) => {
        const exercises = [...form.data.home_program];

        exercises[index] = {
            ...exercises[index],
            [field]: value,
        };

        form.setData("home_program", exercises);
    };

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const submit = (
        url: string,
        method: "post" | "put" = "post"
    ) => {
        if (method === "post") {
            form.post(url);
            return;
        }

        form.put(url);
    };

    return {
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

        // Submit
        submit,
    };
}