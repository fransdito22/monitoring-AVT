import type { TherapyStatistics } from "@/types/therapy";
import { PatientSummaryCard } from "@/components/therapy/PatientSummaryCard";

type Props = {
    childProfile: {
        id: string;
        name: string;
        gender: string | null;
        therapyStatus: string;
        photoUrl: string | null;
        age?: number | null;

        // computed in backend (DashboardController)
        parentName?: string | null;
        therapistName?: string | null;
    } | null;
    statistics: TherapyStatistics | null;
};

export function ChildProfileCard({ childProfile, statistics }: Props) {
    if (!childProfile) {
        return (
            <div className="rounded-2xl shadow-sm border bg-background">
                <div className="p-6 text-center text-sm text-muted-foreground">
                    Data anak belum tersedia.
                </div>
            </div>
        );
    }

    return (
        <PatientSummaryCard
            patient={{
                id: Number(childProfile.id) || 0,
                name: childProfile.name,
                photo: childProfile.photoUrl,
                status: childProfile.therapyStatus,
                progress: statistics?.progressPercent ?? 0,
                birth_date: null,
                age: childProfile.age ?? null,
                gender: childProfile.gender ?? null,
                parent: { id: null, name: childProfile.parentName ?? null },
                therapist: {
                    id: null,
                    name: childProfile.therapistName ?? null,
                },
                created_at: null,
                updated_at: null,
            }}
            progressPercent={statistics?.progressPercent ?? 0}
        />
    );
}
