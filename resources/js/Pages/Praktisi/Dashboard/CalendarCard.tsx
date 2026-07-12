import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCalendar } from "@/Components/Calendar";

export function CalendarCard() {
    return (
        <CardContent className="pt-0 ">
            {/* Pertahankan komponen calendar yang sudah ada */}
            <div>
                <DashboardCalendar />
            </div>
        </CardContent>
    );
}
