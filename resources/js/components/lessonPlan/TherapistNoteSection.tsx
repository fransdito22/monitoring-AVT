import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { LessonPlanFormData } from "@/types/lessonPlan";

interface Props {
    form: {
        data: Pick<LessonPlanFormData, "therapist_note">;
        setData: (key: string, value: any) => void;
    };
}

export default function TherapistNoteSection({ form }: Props) {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">Notes</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
                <Label>Therapist Note</Label>

                <Textarea
                    rows={5}
                    placeholder="Tambahkan catatan terapis..."
                    value={form.data.therapist_note}
                    onChange={(e) =>
                        form.setData("therapist_note", e.target.value)
                    }
                />
            </CardContent>
        </Card>
    );
}
