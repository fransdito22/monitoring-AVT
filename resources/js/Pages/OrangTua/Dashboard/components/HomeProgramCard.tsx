import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export type DashboardHomeProgramItem = {
    title: string;
    instruction: string;
    frequency: string;
};

export type DashboardHomeProgramCardPayload = {
    sessionDate: string | null;
    sessionNumber: string | null;
    homeProgramItems: DashboardHomeProgramItem[];
    status: string | null;
};

type Props = {
    homeProgramCard: DashboardHomeProgramCardPayload | null;
};

function renderInstructionAsBullets(text: string) {
    const raw = text ?? "";
    const parts = raw
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);

    if (parts.length <= 1) {
        // If only one line, show as text to keep UI compact.
        return <p className="text-sm text-muted-foreground">{raw}</p>;
    }

    return (
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {parts.map((p, idx) => (
                <li key={`${idx}-${p}`}>{p}</li>
            ))}
        </ul>
    );
}

export function HomeProgramCard({ homeProgramCard }: Props) {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Target className="h-5 w-5 text-cyan-600" />
                    Home Program
                </CardTitle>

                {homeProgramCard?.status ? (
                    <div className="mt-2 inline-flex items-center rounded-full border px-3 py-1 text-xs text-slate-600">
                        {homeProgramCard.status}
                    </div>
                ) : null}
            </CardHeader>

            <CardContent>
                {!homeProgramCard ? (
                    <p className="text-sm text-muted-foreground">
                        Belum ada Home Program yang diberikan oleh terapis.
                    </p>
                ) : homeProgramCard.homeProgramItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Belum ada Home Program yang diberikan oleh terapis.
                    </p>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                            <div>
                                <span className="font-medium text-slate-800">
                                    Tanggal sesi:
                                </span>{" "}
                                {homeProgramCard.sessionDate ?? "—"}
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">
                                    Nomor sesi:
                                </span>{" "}
                                {homeProgramCard.sessionNumber ?? "—"}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-slate-800">
                                Isi Home Program
                            </p>

                            <div className="space-y-3">
                                {homeProgramCard.homeProgramItems.map(
                                    (item, idx) => (
                                        <div
                                            key={`${item.title}-${idx}`}
                                            className="rounded-xl border p-3"
                                        >
                                            <div className="font-semibold text-slate-800">
                                                {item.title}
                                            </div>

                                            {item.instruction ? (
                                                <div className="mt-1">
                                                    {renderInstructionAsBullets(
                                                        item.instruction
                                                    )}
                                                </div>
                                            ) : null}

                                            {item.frequency ? (
                                                <div className="mt-2 text-xs text-muted-foreground">
                                                    Frekuensi: {item.frequency}
                                                </div>
                                            ) : null}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
