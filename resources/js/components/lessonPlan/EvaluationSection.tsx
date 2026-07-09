import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { ClipboardCheck } from "lucide-react";

import type { Evaluation } from "@/types/lessonPlan";

interface Props {
    form: {
        data: {
            evaluation: Evaluation;
        };
        setData: (key: string, value: any) => void;
    };
}

const SCORE_OPTIONS = [
    {
        value: 1,
        label: "1 - Very Poor",
    },
    {
        value: 2,
        label: "2 - Poor",
    },
    {
        value: 3,
        label: "3 - Fair",
    },
    {
        value: 4,
        label: "4 - Good",
    },
    {
        value: 5,
        label: "5 - Excellent",
    },
];

const FIELDS = [
    {
        key: "listening",
        label: "Listening",
    },
    {
        key: "speech",
        label: "Speech",
    },
    {
        key: "language",
        label: "Language",
    },
    {
        key: "attention",
        label: "Attention",
    },
] as const;

const getScoreLabel = (score: number | null | undefined) => {
    switch (score) {
        case 1:
            return "Very Poor";
        case 2:
            return "Poor";
        case 3:
            return "Fair";
        case 4:
            return "Good";
        case 5:
            return "Excellent";
        default:
            return "-";
    }
};

export default function EvaluationSection({ form }: Props) {
    const evaluation = form.data.evaluation;

    const updateField = (field: keyof Evaluation, value: number) => {
        form.setData("evaluation", {
            ...evaluation,
            [field]: value,
        });
    };

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                    Session Evaluation
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {FIELDS.map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>{label}</Label>

                            <Badge variant="secondary">
                                {getScoreLabel(evaluation[key])}
                            </Badge>
                        </div>

                        <Select
                            value={
                                evaluation[key] != null
                                    ? String(evaluation[key])
                                    : ""
                            }
                            onValueChange={(value) =>
                                updateField(key, Number(value))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih nilai" />
                            </SelectTrigger>

                            <SelectContent>
                                {SCORE_OPTIONS.map((score) => (
                                    <SelectItem
                                        key={score.value}
                                        value={String(score.value)}
                                    >
                                        {score.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}

                <div className="space-y-2">
                    <Label>Recommendation</Label>

                    <Textarea
                        rows={4}
                        placeholder="Masukkan rekomendasi terapi..."
                        value={evaluation.recommendation ?? ""}
                        onChange={(e) =>
                            form.setData("evaluation", {
                                ...evaluation,
                                recommendation: e.target.value,
                            })
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}
