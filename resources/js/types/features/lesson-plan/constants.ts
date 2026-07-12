import type {
    Activity,
    Evaluation,
    HomeExercise,
    LessonPlanFormData,
    LingSound,
} from "@/types/lessonPlan";

export const DEFAULT_ACTIVITY: Activity = {
    activity_name: "",
    objective: "",
    score: null,
    observation: "",
};

export const DEFAULT_EVALUATION: Evaluation = {
    listening: null,
    speech: null,
    language: null,
    attention: null,
    recommendation: "",
};

export const DEFAULT_HOME_EXERCISE: HomeExercise = {
    title: "",
    instruction: "",
    frequency: "Every Day",
};

export const DEFAULT_LING_SOUNDS: LingSound[] = [
    {
        sound: "m",
        level: 0,
        note: "",
    },
    {
        sound: "u",
        level: 0,
        note: "",
    },
    {
        sound: "i",
        level: 0,
        note: "",
    },
    {
        sound: "a",
        level: 0,
        note: "",
    },
    {
        sound: "sh",
        level: 0,
        note: "",
    },
    {
        sound: "s",
        level: 0,
        note: "",
    },
];


export const DEFAULT_LESSON_PLAN: LessonPlanFormData = {
    schedule_id: "",
    session_date: "",
    session_number: 1,

    goal: "",

    activities: [
        {
            ...DEFAULT_ACTIVITY,
        },
    ],

    ling_six_sounds: DEFAULT_LING_SOUNDS.map((item) => ({
        ...item,
    })),

    evaluation: {
        ...DEFAULT_EVALUATION,
    },

    home_program: [
        {
            ...DEFAULT_HOME_EXERCISE,
        },
    ],

    therapist_note: "",
};