import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/dashboard/EmptyState";
import { History } from "lucide-react";

export function RecentActivityCard() {
    return (
        <Card className="rounded-xl shadow-sm border">
            <CardHeader>
                <CardTitle className="text-base font-semibold">
                    Recent Activity
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                    Aktivitas terbaru sesi terapi.
                </p>
            </CardHeader>

            <CardContent className="pt-0">
                <EmptyState
                    icon={<History className="h-5 w-5" />}
                    title="Belum ada aktivitas terbaru."
                    description="Saat ini tidak ada aktivitas yang dapat ditampilkan."
                />
            </CardContent>
        </Card>
    );
}
