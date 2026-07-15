import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ScheduleToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;

    status: string;
    onStatusChange: (value: string | null) => void;

    onCreate: () => void;
}

export default function ScheduleToolbar({
    search,
    onSearchChange,
    status,
    onStatusChange,
    onCreate,
}: ScheduleToolbarProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Left */}
            <div className="flex flex-1 flex-col gap-3 md:flex-row">
                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Cari Pasien Atau Terapis"
                        className="pl-9"
                    />
                </div>

                <Select value={status} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter status" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">
                            All Status
                        </SelectItem>

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
            </div>

            {/* Right */}
            <Button onClick={onCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Jadwal
            </Button>
        </div>
    );
}