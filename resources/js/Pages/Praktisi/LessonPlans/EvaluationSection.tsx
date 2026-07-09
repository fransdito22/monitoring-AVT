import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group";

import {
    ClipboardCheck,
} from "lucide-react";

const STATUS = [
    {
        value: 0,
        label: "Not Achieved",
        className:
            "data-[state=on]:bg-red-500 data-[state=on]:text-white",
    },
    {
        value: 1,
        label: "Partial",
        className:
            "data-[state=on]:bg-yellow-500 data-[state=on]:text-black",
    },
    {
        value: 2,
        label: "Achieved",
        className:
            "data-[state=on]:bg-green-600 data-[state=on]:text-white",
    },
];

interface Props {
    form: any;
}

export default function EvaluationSection({
    form,
}: Props) {
    return (
        <Card className="rounded-2xl shadow-sm">

            <CardHeader>

                <CardTitle className="flex items-center gap-2">

                    <ClipboardCheck className="h-5 w-5 text-primary"/>

                    Session Evaluation

                </CardTitle>

                <CardDescription>

                    Evaluasi hasil terapi pada sesi ini.

                </CardDescription>

            </CardHeader>

            <CardContent className="space-y-6">

                <div className="space-y-3">

                    <Label>

                        Objective Achievement

                    </Label>

                    <ToggleGroup
                        type="single"
                        value={String(
                            form.data.evaluation.objective_achieved
                        )}
                        onValueChange={(value)=>{

                            if(!value) return;

                            form.setData(
                                "evaluation",
                                {
                                    ...form.data.evaluation,

                                    objective_achieved:Number(value),
                                }
                            )

                        }}
                        className="grid grid-cols-3 gap-2"
                    >

                        {STATUS.map(status=>(
                            <ToggleGroupItem
                                key={status.value}
                                value={String(status.value)}
                                className={status.className}
                            >
                                {status.label}
                            </ToggleGroupItem>
                        ))}

                    </ToggleGroup>

                </div>

                <div className="space-y-2">

                    <Label>

                        Recommendation

                    </Label>

                    <Textarea
                        rows={5}
                        value={
                            form.data.evaluation.recommendation
                        }
                        onChange={(e)=>

                            form.setData(
                                "evaluation",
                                {
                                    ...form.data.evaluation,

                                    recommendation:e.target.value,
                                }
                            )

                        }
                    />

                </div>

                <div className="space-y-2">

                    <Label>

                        Next Therapy Plan

                    </Label>

                    <Textarea
                        rows={5}
                        value={
                            form.data.evaluation.next_plan
                        }
                        onChange={(e)=>

                            form.setData(
                                "evaluation",
                                {
                                    ...form.data.evaluation,

                                    next_plan:e.target.value,
                                }
                            )

                        }
                    />

                </div>

            </CardContent>

        </Card>
    );
}