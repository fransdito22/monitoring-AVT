export interface Activity {
    activity_name: string;
    objective: string;
    score: number | null;
    observation: string;
}

export interface LingSound {
    sound: string;
    level: number;
    note: string;

    // Compatibility with other code paths that use `response`.
    // Backend uses `level` and `note`.
    response?: number;
}

export interface Evaluation {
    listening: number | null;
    speech: number | null;
    language: number | null;
    attention: number | null;
    recommendation: string;

    // Compatibility with older field names.
    objective_achieved?: 0 | 1 | 2;
}

export interface LessonPlan {
    id?: number;
    schedule_id?: string;
    session_date?: string;
    session_number?: number;
    goal?: string;
    therapist_note?: string;
    home_program?: HomeExercise[];
    activities?: Activity[];
    evaluation?: Evaluation;
    ling_six_sounds?: LingSound[];
}

export interface Schedule {
    id: number;
    schedule_date: string;
    schedule_time: string;
    status: string;
    patient: {
        id: number;
        name: string;
    };
}


export interface LessonPlanFormData {
    schedule_id: string;
    session_date: string;
    session_number: number;

    goal: string;

    home_program: HomeExercise[];

    therapist_note: string;

    activities: Activity[];

    evaluation: Evaluation;

    ling_six_sounds: LingSound[];

    
}

export interface LessonEvaluation {

    objective_achieved: 0 | 1 | 2;

    recommendation: string;

    next_plan: string;

}

export interface HomeExercise {
    title: string;
    instruction: string;
    frequency: string;
}