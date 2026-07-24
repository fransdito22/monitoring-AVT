import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import ActivityItem from "./ActivityItem";

interface Props {
    form: any;

    errors?: Record<string, string>;

    addActivity: () => void;

    removeActivity: (index: number) => void;

    updateActivity: (index: number, field: any, value: any) => void;
}

export default function ActivitySection({
    form,
    errors = {},
    addActivity,
    removeActivity,
    updateActivity,
}: Props) {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Therapy Activities</CardTitle>

                <Button type="button" onClick={addActivity}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Activity
                </Button>
            </CardHeader>

            <CardContent className="space-y-5">
                {errors.activities && (
                    <p className="text-sm text-red-500">{errors.activities}</p>
                )}

                {form.data.activities.map((activity: any, index: number) => (
                    <ActivityItem
                        key={index}
                        index={index}
                        activity={activity}
                        updateActivity={updateActivity}
                        removeActivity={removeActivity}
                    />
                ))}
            </CardContent>
        </Card>
    );
}
