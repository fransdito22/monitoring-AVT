import EmptyState from "./EmptyState";
import type { RecentActivity } from "@/types/dashboard";

interface RecentActivityTimelineProps {
    activities: RecentActivity[];
}

export default function RecentActivityTimeline({
    activities,
}: RecentActivityTimelineProps) {
    if (activities.length === 0) {
        return (
            <EmptyState
                title="Belum ada aktivitas"
                description="Aktivitas terbaru akan muncul di sini."
            />
        );
    }

    return (
        <div className="space-y-6">
            {activities.map((activity) => (
                <div
                    key={`${activity.type}-${activity.created_at}`}
                    className="flex gap-4"
                >
                    <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />

                        <div className="mt-1 h-full w-px bg-gray-200" />
                    </div>

                    <div className="flex-1 pb-6">
                        <h4 className="font-medium text-gray-900">
                            {activity.title}
                        </h4>

                        <p className="mt-1 text-sm text-gray-600">
                            {activity.description}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                            {new Date(activity.created_at).toLocaleString(
                                "id-ID"
                            )}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}