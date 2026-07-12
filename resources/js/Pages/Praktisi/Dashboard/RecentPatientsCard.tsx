import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/dashboard/EmptyState";
import { UserRound } from "lucide-react";

type UpcomingItem = {
    id: number;
    name: string;
    photo?: string | null;
    status: string;
    progress: number;
    eta: string;
    parent_name?: string | null;
};

export function RecentPatientsCard({
    patients,
}: {
    patients?: UpcomingItem[];
}) {
    const list = patients ?? [];

    return (
        <Card className="rounded-xl shadow-sm border">
            <CardHeader>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-base font-semibold">
                            Recent Patients
                        </CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Pasien terbaru dari antrian.
                        </p>
                    </div>
                    {list.length > 0 && (
                        <Badge variant="secondary" className="rounded-xl">
                            {list.length} item
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {list.length === 0 ? (
                    <EmptyState
                        icon={<UserRound className="h-5 w-5" />}
                        title="Belum ada pasien."
                        description="Saat ini tidak ada pasien terbaru untuk ditampilkan."
                    />
                ) : (
                    <div className="divide-y">
                        {list.map((p, idx) => {
                            const initials =
                                (p.name?.trim()?.[0] ?? "").toUpperCase() ||
                                (
                                    p.name?.trim()?.split(" ")?.[0]?.[0] ?? "P"
                                ).toUpperCase();

                            return (
                                <div
                                    key={p.id}
                                    className={[
                                        "flex items-center gap-4 px-2 py-4",
                                        idx !== list.length - 1
                                            ? "border-b"
                                            : "",
                                    ].join(" ")}
                                >
                                    <Avatar className="h-10 w-10 rounded-xl">
                                        {p.photo ? (
                                            <AvatarImage src={p.photo} />
                                        ) : null}
                                        <AvatarFallback>
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="truncate font-semibold">
                                            {p.name}
                                        </h4>
                                        <div className="mt-1 flex flex-wrap items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="rounded-xl border-muted-foreground/20"
                                            >
                                                {p.status}
                                            </Badge>

                                            {/* progress ada di payload: tampilkan hanya jika ada field */}
                                            {typeof p.progress === "number" && (
                                                <span className="text-sm text-muted-foreground">
                                                    Progress:{" "}
                                                    <span className="font-medium text-foreground">
                                                        {p.progress}%
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
