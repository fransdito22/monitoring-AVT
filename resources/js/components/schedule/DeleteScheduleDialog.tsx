import { router } from "@inertiajs/react";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Schedule } from "@/types/schedule";
import { toastError, toastSuccess } from "@/lib/sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    schedule: Schedule | null;
}

export default function DeleteScheduleDialog({
    open,
    onOpenChange,
    schedule,
}: Props) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!schedule) return;

        setProcessing(true);

        router.delete(route("admin.schedules.destroy", schedule.id), {
            preserveScroll: true,

            onFinish: () => {
                setProcessing(false);
            },

            onSuccess: () => {
                toastSuccess("Jadwal dihapus");
                onOpenChange(false);
            },
            onError: () => toastError("Gagal menghapus jadwal"),
        });
    };

    if (!schedule) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Schedule</AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to delete this therapy schedule?
                        <div className="mt-4 rounded-lg border bg-muted p-3">
                            <div className="font-medium">
                                {schedule.patient.name}
                            </div>

                            <div className="text-sm text-muted-foreground">
                                {schedule.therapist.name}
                            </div>

                            <div className="mt-2 text-sm">
                                {schedule.schedule_date}
                            </div>

                            <div className="text-sm">
                                {schedule.schedule_time}
                            </div>
                        </div>
                        <p className="mt-4 text-red-500">
                            This action cannot be undone.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={processing}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
