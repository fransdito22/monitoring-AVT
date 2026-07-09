import { useEffect } from "react";
import { useForm } from "@inertiajs/react";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import ScheduleForm from "./ScheduleForm";
import { toastError, toastSuccess } from "@/lib/sonner";

import { Patient, Therapist } from "@/types/schedule";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    patients: Patient[];
    therapists: Therapist[];
}

export default function CreateScheduleDialog({
    open,
    onOpenChange,
    patients,
    therapists,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id: "" as number | "",
        therapist_id: "" as number | "",
        schedule_date: "",
        schedule_time: "",
        status: "scheduled" as const,
        notes: "",
    });

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open]);

    const submit = () => {
        post(route("admin.schedules.store"), {
            preserveScroll: true,

            onSuccess: () => {
                toastSuccess("Jadwal dibuat");
                reset();
                onOpenChange(false);
            },
            onError: () => toastError("Gagal membuat jadwal"),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create Therapy Schedule</DialogTitle>

                    <DialogDescription>
                        Create a new therapy schedule for a patient.
                    </DialogDescription>
                </DialogHeader>

                <ScheduleForm
                    data={data}
                    setData={setData}
                    patients={patients}
                    therapists={therapists}
                    errors={errors}
                />

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button onClick={submit} disabled={processing}>
                        {processing ? "Saving..." : "Create Schedule"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
