import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { ScheduleStatus } from "@/types/schedule";

interface StatusBadgeProps {
    status: ScheduleStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    switch (status) {
        case "scheduled":
            return (
                <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                >
                    <Clock3 className="mr-1 h-3.5 w-3.5" />
                    Scheduled
                </Badge>
            );

        case "completed":
            return (
                <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 hover:bg-green-100"
                >
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                    Completed
                </Badge>
            );

        case "cancelled":
            return (
                <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                >
                    <XCircle className="h-3.5 w-3.5" />
                    Cancelled
                </Badge>
            );

        default:
            return (
                <Badge variant="outline">
                    Unknown
                </Badge>
            );
    }
}