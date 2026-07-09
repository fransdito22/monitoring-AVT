export type ScheduleStatus =
    | "scheduled"
    | "completed"
    | "cancelled";

export interface Patient {
    id: number;
    name: string;
    photo: string | null;
    therapist_id: number | null;
    therapist_name?: string | null;
}

export interface Therapist {
    id: number;
    name: string;
}

export interface Schedule {
    id: number;

    schedule_date: string;
    schedule_time: string;

    status: ScheduleStatus;

    notes?: string | null;

    patient: {
        id: number | null;
        name: string | null;
        photo: string | null;
    };

    therapist: {
        id: number | null;
        name: string | null;
    };
}

export interface SchedulePageProps {
    patients: Patient[];
    therapists: Therapist[];
    schedules: Schedule[];
}
