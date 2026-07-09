import { useEffect } from "react";
import { useForm } from "@inertiajs/react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import ScheduleForm from "./ScheduleForm";
import { toastError, toastSuccess } from "@/lib/sonner";

import { Patient, Therapist, Schedule, ScheduleStatus } from "@/types/schedule";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    schedule: Schedule | null;

    patients: Patient[];
    therapists: Therapist[];
}

export default function EditScheduleDialog({
    open,
    onOpenChange,
    schedule,
    patients,
    therapists,
}: Props) {
    const { data, setData, put, processing, errors, reset } = useForm<{
        patient_id: number | "";
        therapist_id: number | "";
        schedule_date: string;
        schedule_time: string;
        status: ScheduleStatus;
        notes: string;
    }>({
        patient_id: "",
        therapist_id: "",
        schedule_date: "",
        schedule_time: "",
        status: "scheduled",
        notes: "",
    });

    useEffect(() => {
        if (!schedule) return;

        setData({
            patient_id: schedule.patient.id ?? "",
            therapist_id: schedule.therapist.id ?? "",
            schedule_date: schedule.schedule_date,
            schedule_time: schedule.schedule_time,
            status: schedule.status,
            notes: schedule.notes ?? "",
        });
    }, [schedule]);

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open]);

    const submit = () => {
        if (!schedule) return;

        put(route("admin.schedules.update", schedule.id), {
            preserveScroll: true,

            onSuccess: () => {
                toastSuccess("Jadwal diperbarui");
                onOpenChange(false);
            },
            onError: () => toastError("Gagal memperbarui jadwal"),
        });
    };

    if (!schedule) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit Schedule</DialogTitle>

                    <DialogDescription>
                        Update therapy schedule.
                    </DialogDescription>
                </DialogHeader>

                <ScheduleForm
                    data={data}
                    setData={setData}
                    patients={patients}
                    therapists={therapists}
                    errors={errors}
                    showStatus
                />

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button disabled={processing} onClick={submit}>
                        {processing ? "Updating..." : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
