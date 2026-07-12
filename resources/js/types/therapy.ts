export type TherapyPatient = {
    id: number;
    name: string;
    photo: string | null;
    status: string;
    progress: number;
    birth_date: string | null;
    age: number | null;
    gender: string | null;
    parent: { id: number | null; name: string | null };
    therapist: { id: number | null; name: string | null };
    created_at: string | null;
    updated_at: string | null;
};

export type TherapyStatistics = {
    totalLessonPlan: number;
    totalTesArtikulasi: number;
    totalPertemuan: number;
    progressPercent: number;
};

export type TherapyChartPoint = {
    session: string;
    progress: number;
    date: string | null;
};

export type TherapyInsights = {
    scoreAwal: number | null;
    scoreTerbaru: number | null;
    selisih: number | null;
    trend: 'naik' | 'turun' | 'stabil';
};


export type TherapyArticulationReport = {
    id: number;
    tanggal: string | null;
    summary: string | null;
    progress: number;
    detailArtikulasi: {
        category: string;
        note: string | null;
        target_word: string;
        target_phoneme: string;
    }[];
};

export type TherapyTimelineEvent = {
    type: string;
    label: string;
    date: string | null;
    meta: Record<string, string | number | boolean | null | undefined>;
};


export type TherapyShowProps = {
    patient: TherapyPatient;
    statistics: TherapyStatistics;
    chartData: TherapyChartPoint[];
    insights: TherapyInsights;
    tabs: {
        lessonPlans: TherapyLessonPlan[];
        articulationReports: TherapyArticulationReport[];
        timeline: TherapyTimelineEvent[];
    };
};

export interface TherapyActivity {
    id: number;
    activity_name: string;
    objective?: string | null;
    score?: number | null;
    observation?: string | null;
}

export interface TherapyEvaluation {
    listening?: number | null;
    speech?: number | null;
    language?: number | null;
    attention?: number | null;
    recommendation?: string | null;
}

export interface LingSixSound {
    id: number;
    sound: string;
    level: number;
    note?: string | null;
}

export interface TherapyLessonPlan {
    id: number;

    session_date: string;
    session_number: number;

    long_term_goal?: string | null;
    short_term_goal?: string | null;


    therapist_note?: string | null;

    status: string;

    activities: TherapyActivity[];

    evaluation: TherapyEvaluation | null;

    lingSixSounds: LingSixSound[];
}

export interface HomeProgram {
    title: string;
    instruction: string;
    frequency: string;
}

export interface TherapyLessonPlan {
    id: number;

    session_date: string;
    session_number: number;

    long_term_goal?: string | null;
    short_term_goal?: string | null;

    home_program?: HomeProgram[];

    therapist_note?: string | null;

    status: string;

    activities: TherapyActivity[];

    evaluation: TherapyEvaluation | null;

    lingSixSounds: LingSixSound[];
}

