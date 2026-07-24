import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@inertiajs/react";
import { Eye } from "lucide-react";

interface Patient {
    id: number;
    name: string;
}

interface Schedule {
    id: number;
    schedule_date: string;
    patient?: Patient;
}

interface Activity {
    id: number;
}

interface LingSixSound {
    id: number;
}

interface LessonPlan {
    id: number;
    session_date?: string;
    session_number?: number;
    status: string;

    schedule?: Schedule;

    activities?: Activity[];

    evaluation?: unknown;

    lingSixSounds?: LingSixSound[];
}

interface Props {
    lessonPlans: LessonPlan[];
}

const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
};

const statusVariant = (status?: string) => {
    switch (status) {
        case "completed":
            return "default";
        case "draft":
            return "secondary";
        default:
            return "outline";
    }
};

const statusLabel = (status?: string) => {
    switch (status) {
        case "completed":
            return "Completed";
        case "draft":
            return "Draft";
        default:
            return "-";
    }
};

export default function LessonPlanTable({ lessonPlans }: Props) {
    return (
        <Card className="border shadow-sm rounded-2xl">
            <CardHeader>
                <CardTitle>Daftar Sesi Terapi</CardTitle>

                <p className="text-sm text-muted-foreground mt-1">
                    Total {lessonPlans.length} Lesson Plan
                </p>
            </CardHeader>

            <CardContent>
                <div className="rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">No</TableHead>
                                    <TableHead>Sesi</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Pasien</TableHead>
                                    <TableHead>Aktivitas</TableHead>
                                    <TableHead>Ling 6</TableHead>
                                    <TableHead>Evaluasi</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-center">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {lessonPlans.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={9}
                                            className="text-center h-32 text-muted-foreground"
                                        >
                                            Belum ada sesi terapi.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    lessonPlans.map((plan, index) => (
                                        <TableRow
                                            key={plan.id}
                                            className="hover:bg-muted/40"
                                        >
                                            <TableCell>{index + 1}</TableCell>

                                            <TableCell>
                                                {plan.session_number}
                                            </TableCell>

                                            <TableCell>
                                                {formatDate(plan.session_date)}
                                            </TableCell>

                                            <TableCell className="font-medium">
                                                {plan.schedule?.patient?.name ??
                                                    "-"}
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {plan.activities?.length ??
                                                        0}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="outline">
                                                    {plan.lingSixSounds
                                                        ?.length ?? 0}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        plan.evaluation
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {plan.evaluation
                                                        ? "Sudah"
                                                        : "Belum"}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={statusVariant(
                                                        plan.status
                                                    )}
                                                >
                                                    {statusLabel(plan.status)}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Link
                                                                href={route(
                                                                    "lesson-plans.show",
                                                                    plan.id
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="whitespace-nowrap"
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Detail
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Lihat Detail
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
