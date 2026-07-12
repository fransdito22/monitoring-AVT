import {
    Calendar,
    Clock3,
    Stethoscope,
    User,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PatientInformationProps {
    form?: any;
    schedules: any[];
}

export default function PatientInformation({
    form,
    schedules,
}: PatientInformationProps) {
    const selectedSchedule = schedules.find(
        (schedule) => schedule.id === Number(form?.data?.schedule_id)
    );

    if (!selectedSchedule) {
        return (
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Patient Information
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex h-56 items-center justify-center">
                    <p className="text-center text-sm text-muted-foreground">
                        Pilih jadwal terapi untuk menampilkan informasi pasien.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const patient = selectedSchedule.patient;
    const therapist = selectedSchedule.therapist;

    const initials =
        patient?.name
            ?.split(" ")
            .slice(0, 2)
            .map((word: string) => word[0])
            .join("") ?? "--";

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Patient Information
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border">
                        <AvatarImage
                            src={patient?.photo ?? undefined}
                            alt={patient?.name}
                        />

                        <AvatarFallback className="font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-semibold">
                            {patient?.name ?? "-"}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            Patient ID #{patient?.id ?? "-"}
                        </p>

                        <Badge
                            variant="secondary"
                            className="mt-2"
                        >
                            Scheduled
                        </Badge>
                    </div>
                </div>

                <Separator />

                {/* Information */}
                <div className="grid grid-cols-1 gap-3">
                    <InfoItem
                        icon={<Stethoscope className="h-4 w-4" />}
                        label="Therapist"
                        value={therapist?.name ?? "-"}
                    />

                    <InfoItem
                        icon={<Calendar className="h-4 w-4" />}
                        label="Therapy Date"
                        value={
                            selectedSchedule.schedule_date ??
                            "-"
                        }
                    />

                    <InfoItem
                        icon={<Clock3 className="h-4 w-4" />}
                        label="Therapy Time"
                        value={
                            selectedSchedule.schedule_time ??
                            "-"
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

function InfoItem({
    icon,
    label,
    value,
}: InfoItemProps) {
    return (
        <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-3">
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    {icon}
                </div>

                <span className="text-sm text-muted-foreground">
                    {label}
                </span>
            </div>

            <span className="text-sm font-medium text-right">
                {value}
            </span>
        </div>
    );
}