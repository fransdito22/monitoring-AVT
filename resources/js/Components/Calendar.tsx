import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export function DashboardCalendar() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calendar</CardTitle>
            </CardHeader>

            <CardContent className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border px-10"
                />
            </CardContent>
        </Card>
    );
}