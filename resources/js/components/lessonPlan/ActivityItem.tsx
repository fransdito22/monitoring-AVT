import { Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

import type { Activity } from "@/types/lessonPlan";

interface Props {
    index: number;
    activity: Activity;
    updateActivity: (index: number, field: keyof Activity, value: any) => void;
    removeActivity: (index: number) => void;
}

export default function ActivityItem({
    index,
    activity,
    updateActivity,
    removeActivity,
}: Props) {
    return (
        <Card className="rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Activity #{index + 1}</h3>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeActivity(index)}
                >
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>Activity Name</Label>

                    <Input
                        value={activity.activity_name}
                        onChange={(e) =>
                            updateActivity(
                                index,
                                "activity_name",
                                e.target.value
                            )
                        }
                    />
                </div>

                <div className="space-y-2">
                    <Label>Score</Label>

                    <Select
                        value={activity.score?.toString() ?? ""}
                        onValueChange={(value) =>
                            updateActivity(index, "score", Number(value))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose score" />
                        </SelectTrigger>

                        <SelectContent>
                            {[1, 2, 3, 4, 5].map((score) => (
                                <SelectItem key={score} value={String(score)}>
                                    {score}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Objective</Label>

                <Textarea
                    rows={3}
                    value={activity.objective}
                    onChange={(e) =>
                        updateActivity(index, "objective", e.target.value)
                    }
                />
            </div>

            <div className="space-y-2">
                <Label>Observation</Label>

                <Textarea
                    rows={3}
                    value={activity.observation}
                    onChange={(e) =>
                        updateActivity(index, "observation", e.target.value)
                    }
                />
            </div>
        </Card>
    );
}
