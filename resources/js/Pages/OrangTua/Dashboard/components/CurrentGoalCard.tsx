import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Goal } from "lucide-react";

type CurrentGoal = {
    title: string;
    description: string;
    completion: number | null;
    long_term_goal: string | null;
    short_term_goal: string | null;
};

type Props = {
    currentGoal: CurrentGoal | null;
};

export function CurrentGoalCard({ currentGoal }: Props) {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Goal className="h-5 w-5 text-cyan-600" />
                    Current Therapy Goal
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!currentGoal ? (
                    <p className="text-sm text-muted-foreground">
                        Belum ada target terapi aktif.
                    </p>
                ) : (
                    <div className="space-y-3">
                        <p className="font-semibold text-slate-800">
                            {currentGoal.title}
                        </p>
                        {currentGoal.description ? (
                            <p className="text-sm text-muted-foreground">
                                {currentGoal.description}
                            </p>
                        ) : null}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
