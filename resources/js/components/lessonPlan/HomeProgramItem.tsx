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

import type { HomeExercise } from "@/types/lesson-plan";

interface Props {
    index: number;
    item: HomeExercise;
    update: (index: number, field: keyof HomeExercise, value: string) => void;
    remove: (index: number) => void;
}

export default function HomeProgramItem({
    index,
    item,
    update,
    remove,
}: Props) {
    return (
        <Card className="rounded-xl p-5 space-y-4">
            <div className="flex justify-between">
                <h3 className="font-semibold">Exercise #{index + 1}</h3>

                <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => remove(index)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-2">
                <Label>Title</Label>

                <Input
                    value={item.title}
                    onChange={(e) => update(index, "title", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>Instruction</Label>

                <Textarea
                    rows={3}
                    value={item.instruction}
                    onChange={(e) =>
                        update(index, "instruction", e.target.value)
                    }
                />
            </div>

            <div className="space-y-2">
                <Label>Frequency</Label>

                <Select
                    value={item.frequency}
                    onValueChange={(value) =>
                        update(index, "frequency", value ?? "")
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="Every Day">Every Day</SelectItem>

                        <SelectItem value="3 Times / Week">
                            3 Times / Week
                        </SelectItem>

                        <SelectItem value="2 Times / Week">
                            2 Times / Week
                        </SelectItem>

                        <SelectItem value="Once / Week">Once / Week</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </Card>
    );
}
