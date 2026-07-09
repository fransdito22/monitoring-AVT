import { Patient, Therapist, ScheduleStatus } from "@/types/schedule";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ScheduleFormData {
    patient_id: number | "";
    therapist_id: number | "";
    schedule_date: string;
    schedule_time: string;
    status: ScheduleStatus;
    notes: string;
}

interface ScheduleFormErrors {
    patient_id?: string;
    therapist_id?: string;
    schedule_date?: string;
    schedule_time?: string;
    status?: string;
    notes?: string;
}

interface ScheduleFormProps {
    data: ScheduleFormData;

    setData: <K extends keyof ScheduleFormData>(
        key: K,
        value: ScheduleFormData[K]
    ) => void;

    patients: Patient[];
    therapists: Therapist[];

    errors: ScheduleFormErrors;

    showStatus?: boolean;
}

export default function ScheduleForm({
    data,
    setData,
    patients,
    therapists,
    errors,
    showStatus = false,
}: ScheduleFormProps) {
    return (
        <div className="space-y-6">
            {/* Patient */}
            <div className="space-y-2">
                <Label>Patient</Label>

                <Select
                    value={
                        data.patient_id
                            ? data.patient_id.toString()
                            : undefined
                    }
                    onValueChange={(value) =>
                        setData("patient_id", Number(value))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                    </SelectTrigger>

                    <SelectContent>
                        {patients.map((patient) => (
                            <SelectItem
                                key={patient.id}
                                value={patient.id.toString()}
                            >
                                {patient.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {errors.patient_id && (
                    <p className="text-sm text-red-500">
                        {errors.patient_id}
                    </p>
                )}
            </div>

            {/* Therapist */}
            <div className="space-y-2">
                <Label>Therapist</Label>

                <Select
                    value={
                        data.therapist_id
                            ? data.therapist_id.toString()
                            : undefined
                    }
                    onValueChange={(value) =>
                        setData("therapist_id", Number(value))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select therapist" />
                    </SelectTrigger>

                    <SelectContent>
                        {therapists.map((therapist) => (
                            <SelectItem
                                key={therapist.id}
                                value={therapist.id.toString()}
                            >
                                {therapist.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {errors.therapist_id && (
                    <p className="text-sm text-red-500">
                        {errors.therapist_id}
                    </p>
                )}
            </div>

            {/* Date */}
            <div className="space-y-2">
                <Label>Date</Label>

                <Input
                    type="date"
                    value={data.schedule_date}
                    onChange={(e) =>
                        setData("schedule_date", e.target.value)
                    }
                />

                {errors.schedule_date && (
                    <p className="text-sm text-red-500">
                        {errors.schedule_date}
                    </p>
                )}
            </div>

            {/* Time */}
            <div className="space-y-2">
                <Label>Time</Label>

                <Input
                    type="time"
                    value={data.schedule_time}
                    onChange={(e) =>
                        setData("schedule_time", e.target.value)
                    }
                />

                {errors.schedule_time && (
                    <p className="text-sm text-red-500">
                        {errors.schedule_time}
                    </p>
                )}
            </div>

            {/* Status (Edit only) */}
            {showStatus && (
                <div className="space-y-2">
                    <Label>Status</Label>

                    <Select
                        value={data.status}
                        onValueChange={(value) =>
                            setData(
                                "status",
                                value as ScheduleStatus
                            )
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="scheduled">
                                Scheduled
                            </SelectItem>

                            <SelectItem value="completed">
                                Completed
                            </SelectItem>

                            <SelectItem value="cancelled">
                                Cancelled
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {errors.status && (
                        <p className="text-sm text-red-500">
                            {errors.status}
                        </p>
                    )}
                </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
                <Label>Notes</Label>

                <Textarea
                    rows={4}
                    value={data.notes}
                    onChange={(e) =>
                        setData("notes", e.target.value)
                    }
                    placeholder="Additional notes..."
                />

                {errors.notes && (
                    <p className="text-sm text-red-500">
                        {errors.notes}
                    </p>
                )}
            </div>
        </div>
    );
}