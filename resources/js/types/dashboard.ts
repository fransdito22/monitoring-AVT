export interface DashboardSummary {
    totalChildren: number;
    totalParents: number;
    totalTherapists: number;
    totalUserAccounts: number;
}

export interface RecentChild {
    id: number;
    name: string;
    parent_name: string;
    therapist_name: string;
    created_at: string;
}

export interface RecentAccount {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export interface RecentActivity {
    type: string;
    title: string;
    description: string;
    created_at: string;
}

export interface DashboardProps {
    summary: DashboardSummary;
    recentRegisteredChildren: RecentChild[];
    recentlyCreatedAccounts: RecentAccount[];
    recentActivities: RecentActivity[];
}

export interface NextSchedulePayload {
    id: string;
    schedule_date: string | null;
    schedule_time: string | null;
    end_time: string | null;
    session_number: string | number | null;
    status: string | null;
    location: string | null;
    therapist: { id: string; name: string } | null;
}
