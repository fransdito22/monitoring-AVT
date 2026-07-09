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
}

export default function SessionInformation({ form, schedules }: Props) {
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
                    <Label htmlFor="schedule_id">Therapy Schedule</Label>

                    <Select
                        value={form.data.schedule_id?.toString() ?? ""}
                        onValueChange={(value) =>
                            form.setData("schedule_id", Number(value))
                        }
                    >
                        <SelectTrigger id="schedule_id" className="h-12">
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
                </div>

                {/* Date */}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Session Date</Label>

                        <Input
                            type="date"
                            value={form.data.session_date}
                            onChange={(e) =>
                                form.setData("session_date", e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Session Number</Label>

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
                        />
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
