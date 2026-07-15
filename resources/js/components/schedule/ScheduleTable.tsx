import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import StatusBadge from "./StatusBadge";

import { Schedule } from "@/types/schedule";

interface Props {
    schedules: Schedule[];

    onEdit: (schedule: Schedule) => void;

    onDelete: (schedule: Schedule) => void;
}

export default function ScheduleTable({
    schedules,
    onEdit,
    onDelete,
}: Props) {
    if (schedules.length === 0) {
        return (
            <div className="rounded-lg border border-dashed py-16">
                <div className="text-center">
                    <h3 className="text-lg font-semibold">
                        Tidak Ada Jadwal Terapu
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Create your first therapy schedule.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-17.5">
                            Patient
                        </TableHead>

                        <TableHead>Name</TableHead>

                        <TableHead>Therapist</TableHead>

                        <TableHead>Date</TableHead>

                        <TableHead>Time</TableHead>

                        <TableHead>Status</TableHead>

                        <TableHead className="text-right">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {schedules.map((schedule) => (
                        <TableRow key={schedule.id}>
                            {/* Avatar */}
                            <TableCell>
                                <Avatar>
                                    <AvatarImage
                                        src={
                                            schedule.patient.photo ??
                                            undefined
                                        }
                                    />

                                    <AvatarFallback>
                                        {schedule.patient.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>

                            {/* Patient */}
                            <TableCell>
                                <div className="font-medium">
                                    {schedule.patient.name}
                                </div>
                            </TableCell>

                            {/* Therapist */}
                            <TableCell>
                                {schedule.therapist.name}
                            </TableCell>

                            {/* Date */}
                            <TableCell>
                                {schedule.schedule_date}
                            </TableCell>

                            {/* Time */}
                            <TableCell>
                                {schedule.schedule_time}
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                                <StatusBadge
                                    status={schedule.status}
                                />
                            </TableCell>

                            {/* Action */}
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                    >
                                        <DropdownMenuItem
                                            onClick={() =>
                                                onEdit(schedule)
                                            }
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() =>
                                                onDelete(
                                                    schedule
                                                )
                                            }
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}