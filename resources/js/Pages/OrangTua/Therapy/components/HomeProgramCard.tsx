import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import type { HomeProgram } from "@/types/therapy";

export function HomeProgramCard({
    homeProgram,
}: {
    homeProgram?: HomeProgram[] | null;
}) {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Target className="h-5 w-5 text-cyan-600" />
                    Home Program
                </CardTitle>
            </CardHeader>
            <CardContent>
                {homeProgram?.length ? (
                    <ul className="space-y-3 text-sm">
                        {homeProgram.map((item, idx) => (
                            <li
                                key={`${item.title}-${idx}`}
                                className="rounded-xl border p-3"
                            >
                                <div className="font-semibold text-slate-800">
                                    {item.title}
                                </div>
                                <div className="mt-1 text-muted-foreground">
                                    {item.instruction}
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                    Frekuensi: {item.frequency}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Belum ada latihan rumah.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
