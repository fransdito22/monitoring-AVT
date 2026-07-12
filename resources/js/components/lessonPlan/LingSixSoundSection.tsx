import { Ear, Info } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type { LingSound } from "@/types/lessonPlan";

interface Props {
    form: any;
    updateLingSound: (
        index: number,
        field: keyof LingSound,
        value: any
    ) => void;
}

const RESPONSE_OPTIONS = [
    {
        value: 0,
        label: "NR",
        fullLabel: "Not Response",
        activeClass:
            "data-[state=on]:bg-red-500 data-[state=on]:text-white data-[state=on]:border-red-500",
    },
    {
        value: 1,
        label: "DET",
        fullLabel: "Detection",
        activeClass:
            "data-[state=on]:bg-yellow-500 data-[state=on]:text-black data-[state=on]:border-yellow-500",
    },
    {
        value: 2,
        label: "CR",
        fullLabel: "Correct Response",
        activeClass:
            "data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:border-green-600",
    },
];

const getResponseBadge = (value: number | null) => {
    switch (value) {
        case 0:
            return "bg-red-100 text-red-700 border-red-200";
        case 1:
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case 2:
            return "bg-green-100 text-green-700 border-green-200";
        default:
            return "bg-muted";
    }
};

const getResponseLabel = (value: number | null) => {
    return RESPONSE_OPTIONS.find((item) => item.value === value)?.label ?? "-";
};

export default function LingSixSoundSection({ form, updateLingSound }: Props) {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Ear className="h-5 w-5 text-primary" />
                            Ling Six Sound Test
                        </CardTitle>

                        <CardDescription>
                            Nilai respon pasien terhadap enam suara Ling.
                        </CardDescription>
                    </div>

                    <Badge variant="secondary">6 Sounds</Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="rounded-xl border bg-muted/40 p-4">
                    <div className="flex items-start gap-3">
                        <Info className="mt-0.5 h-4 w-4 text-primary" />

                        <div className="text-sm">
                            <p>
                                <strong>NR</strong> = Not Response
                            </p>

                            <p>
                                <strong>DET</strong> = Detection
                            </p>

                            <p>
                                <strong>CR</strong> = Correct Response
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {form.data.ling_six_sounds.map(
                        (sound: LingSound, index: number) => (
                            <Card key={sound.sound} className="rounded-xl">
                                <CardContent className="space-y-5 p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold">
                                                /{sound.sound}/
                                            </h3>

                                            <p className="text-xs text-muted-foreground">
                                                Ling Sound
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-primary/10 p-2">
                                            <Ear className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label>Response</Label>

                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    getResponseBadge(
                                                        (sound as any)
                                                            .response ??
                                                            (sound as any)
                                                                .level ??
                                                            null
                                                    )
                                                )}
                                            >
                                                {getResponseLabel(
                                                    (sound as any).response ??
                                                        (sound as any).level ??
                                                        null
                                                )}
                                            </Badge>
                                        </div>

                                        <Select
                                            value={
                                                (sound as any).response ??
                                                (sound as any).level
                                                    ? String(
                                                          (sound as any)
                                                              .response ??
                                                              (sound as any)
                                                                  .level
                                                      )
                                                    : undefined
                                            }
                                            onValueChange={(value) =>
                                                updateLingSound(
                                                    index,
                                                    "level",
                                                    Number(value)
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih respon" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {RESPONSE_OPTIONS.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={String(
                                                                option.value
                                                            )}
                                                        >
                                                            <div className="flex items-center justify-between w-full">
                                                                <span className="font-medium">
                                                                    {
                                                                        option.label
                                                                    }
                                                                </span>

                                                                <span className="ml-2 text-muted-foreground text-xs">
                                                                    {
                                                                        option.fullLabel
                                                                    }
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Observation</Label>

                                        <Textarea
                                            rows={3}
                                            placeholder="Tambahkan catatan jika diperlukan..."
                                            value={String(sound.note ?? "")}
                                            onChange={(e) =>
                                                updateLingSound(
                                                    index,
                                                    "note",
                                                    e.target.value ?? ""
                                                )
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
