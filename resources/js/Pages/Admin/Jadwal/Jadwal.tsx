import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";

import ScheduleToolbar from "@/components/schedule/ScheduleToolbar";
import ScheduleTable from "@/components/schedule/ScheduleTable";
import CreateScheduleDialog from "@/components/schedule/CreateScheduleDialog";
import EditScheduleDialog from "@/components/schedule/EditScheduleDialog";
import DeleteScheduleDialog from "@/components/schedule/DeleteScheduleDialog";

import { Schedule, SchedulePageProps } from "@/types/schedule";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/Layouts/AppLayout";

interface Props extends SchedulePageProps {}

export default function Jadwal({ patients, therapists, schedules }: Props) {
    /**
     * ===========================
     * Search & Filter
     * ===========================
     */

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("all");

    /**
     * ===========================
     * Dialog State
     * ===========================
     */

    const [openCreate, setOpenCreate] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    /**
     * ===========================
     * Selected Schedule
     * ===========================
     */

    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
        null
    );

    /**
     * ===========================
     * Filter Schedule
     * ===========================
     */

    const filteredSchedules = useMemo(() => {
        return schedules.filter((schedule) => {
            const keyword = search.toLowerCase();

            const matchSearch =
                schedule.patient.name?.toLowerCase().includes(keyword) ||
                schedule.therapist.name?.toLowerCase().includes(keyword);

            const matchStatus = status === "all" || schedule.status === status;

            return matchSearch && matchStatus;
        });
    }, [search, status, schedules]);

    /**
     * ===========================
     * Action
     * ===========================
     */

    const handleEdit = (schedule: Schedule) => {
        setSelectedSchedule(schedule);
        setOpenEdit(true);
    };

    const handleDelete = (schedule: Schedule) => {
        setSelectedSchedule(schedule);
        setOpenDelete(true);
    };

    return (
        <AuthenticatedLayout
        header={
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Jadwal</h2>
                    <p className="text-sm text-muted-foreground">
                        Tambah jadwal sesi terapi AVT.
                    </p>
                </div>
            </div>
        }>
            <Head title="Therapy Schedule" />

            <div className="space-y-6 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Jadwal Terapi</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <ScheduleToolbar
                            search={search}
                            onSearchChange={setSearch}
                            status={status}
                            onStatusChange={(value) => {
                                setStatus(value ?? "all");
                            }}
                            onCreate={() => setOpenCreate(true)}
                        />

                        <ScheduleTable
                            schedules={filteredSchedules}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </CardContent>
                </Card>

                {/* Create Dialog */}
                <CreateScheduleDialog
                    open={openCreate}
                    onOpenChange={setOpenCreate}
                    patients={patients}
                    therapists={therapists}
                />

                {/* Edit Dialog */}
                <EditScheduleDialog
                    open={openEdit}
                    onOpenChange={(open) => {
                        setOpenEdit(open);

                        if (!open) {
                            setSelectedSchedule(null);
                        }
                    }}
                    schedule={selectedSchedule}
                    patients={patients}
                    therapists={therapists}
                />

                {/* Delete Dialog */}
                <DeleteScheduleDialog
                    open={openDelete}
                    onOpenChange={(open) => {
                        setOpenDelete(open);

                        if (!open) {
                            setSelectedSchedule(null);
                        }
                    }}
                    schedule={selectedSchedule}
                />
            </div>
        </AuthenticatedLayout>
    );
}
