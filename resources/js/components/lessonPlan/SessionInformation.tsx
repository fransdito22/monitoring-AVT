import { CalendarDays, Clock3, Hash } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import StatusBadge from "@/components/schedule/StatusBadge";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Schedule {
    id: number;

    schedule_date: string;

    schedule_time: string;

    status: string;

    patient: {
        id: number;

        name: string;
    };
}

interface Props {
    form: any;

    schedules: Schedule[];

    errors?: Record<string, string>;
}

export default function SessionInformation({
    form,
    schedules,
    errors = {},
}: Props) {
    const selectedSchedule = schedules.find(
        (schedule) => schedule.id === Number(form.data.schedule_id)
    );

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    Session Information
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Schedule */}

                <div className="space-y-2">
                    <Label
                        htmlFor="schedule_id"
                        className={cn(
                            Boolean(errors["schedule_id"]) && "text-red-500"
                        )}
                    >
                        Therapy Schedule
                        <span className="text-red-500 ml-1">*</span>
                    </Label>

                    <Select
                        value={form.data.schedule_id?.toString() ?? ""}
                        onValueChange={(value) =>
                            form.setData("schedule_id", Number(value))
                        }
                    >
                        <SelectTrigger
                            id="schedule_id"
                            className={cn(
                                "h-12",
                                Boolean(errors["schedule_id"]) &&
                                    "border-red-500 focus:ring-red-500"
                            )}
                        >
                            <SelectValue placeholder="Select therapy schedule" />
                        </SelectTrigger>

                        <SelectContent>
                            {schedules.length === 0 ? (
                                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                                    No therapy schedule available
                                </div>
                            ) : (
                                schedules.map((schedule) => (
                                    <SelectItem
                                        key={schedule.id}
                                        value={schedule.id.toString()}
                                    >
                                        <div className="flex w-full flex-col">
                                            <span className="font-medium">
                                                {schedule.patient.name}
                                            </span>

                                            <span className="text-xs text-muted-foreground">
                                                📅 {schedule.schedule_date}
                                                {" • "}
                                                🕒 {schedule.schedule_time}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>

                    {errors["schedule_id"] && (
                        <p className="text-sm text-red-500">
                            {errors["schedule_id"]}
                        </p>
                    )}
                </div>

                {/* Date */}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            className={cn(
                                Boolean(errors["session_date"]) &&
                                    "text-red-500"
                            )}
                        >
                            Session Date
                            <span className="text-red-500 ml-1">*</span>
                        </Label>

                        <Input
                            type="date"
                            value={form.data.session_date}
                            onChange={(e) =>
                                form.setData("session_date", e.target.value)
                            }
                            className={cn(
                                Boolean(errors["session_date"]) &&
                                    "border-red-500 focus:ring-red-500"
                            )}
                        />
                        {errors["session_date"] && (
                            <p className="text-sm text-red-500">
                                {errors["session_date"]}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            className={cn(
                                Boolean(errors["session_number"]) &&
                                    "text-red-500"
                            )}
                        >
                            Session Number
                            <span className="text-red-500 ml-1">*</span>
                        </Label>

                        <Input
                            type="number"
                            min={1}
                            value={form.data.session_number}
                            onChange={(e) =>
                                form.setData(
                                    "session_number",
                                    Number(e.target.value)
                                )
                            }
                            className={cn(
                                Boolean(errors["session_number"]) &&
                                    "border-red-500 focus:ring-red-500"
                            )}
                        />
                        {errors["session_number"] && (
                            <p className="text-sm text-red-500">
                                {errors["session_number"]}
                            </p>
                        )}
                    </div>
                </div>

                {/* Summary */}

                {selectedSchedule && (
                    <div className="rounded-xl border bg-muted/40 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock3 className="h-4 w-4 text-primary" />

                                <span className="text-sm font-medium">
                                    {selectedSchedule.schedule_time}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Hash className="h-4 w-4 text-primary" />
                                <StatusBadge
                                    status={selectedSchedule.status as any}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
