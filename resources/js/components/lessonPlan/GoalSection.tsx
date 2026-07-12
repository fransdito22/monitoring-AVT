import { Target, Flag } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    form: any;
}

export default function GoalSection({ form }: Props) {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Therapy Goals
                </CardTitle>

                <CardDescription>
                    Tentukan tujuan terapi untuk sesi ini.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Flag className="h-4 w-4" />
                        Long Term Goal
                    </Label>

                    <Textarea
                        rows={4}
                        placeholder="Contoh:
Meningkatkan kemampuan mendengar percakapan tanpa bantuan visual."
                        value={form.data.long_term_goal}
                        onChange={(e) =>
                            form.setData("long_term_goal", e.target.value)
                        }
                    />
                </div>

                <div className="space-y-2">
                    <Label>Today's Goal</Label>

                    <Textarea
                        rows={4}
                        placeholder="Contoh:
Pasien mampu mengidentifikasi suara /m/ dan /u/ secara konsisten."
                        value={form.data.short_term_goal}
                        onChange={(e) =>
                            form.setData("short_term_goal", e.target.value)
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}
