import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import type { HomeProgram } from "@/types/therapy";

function normalizeHomeProgram(homeProgram: unknown): HomeProgram[] {
    if (Array.isArray(homeProgram)) {
        return homeProgram.filter(
            (item): item is HomeProgram =>
                typeof item === "object" && item !== null && "title" in item
        );
    }
    if (typeof homeProgram === "string") {
        try {
            const parsed = JSON.parse(homeProgram);
            if (Array.isArray(parsed)) {
                return parsed.filter(
                    (item): item is HomeProgram =>
                        typeof item === "object" &&
                        item !== null &&
                        "title" in item
                );
            }
        } catch {
            // not valid JSON, treat as plain text
            return homeProgram
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((title) => ({ title, instruction: "", frequency: "" }));
        }
    }
    return [];
}

export function HomeProgramCard({
    homeProgram,
}: {
    homeProgram?: HomeProgram[] | null;
}) {
    const programs = normalizeHomeProgram(homeProgram);

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Target className="h-5 w-5 text-cyan-600" />
                    Home Program
                </CardTitle>
            </CardHeader>
            <CardContent>
                {programs.length > 0 ? (
                    <ul className="space-y-3 text-sm">
                        {programs.map((item, idx) => (
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
