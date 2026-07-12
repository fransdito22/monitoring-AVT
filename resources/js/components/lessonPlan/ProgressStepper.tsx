import {
    CheckCircle2,
    ClipboardList,
    Ear,
    Flag,
    ListChecks,
    NotebookPen,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface ProgressStepperProps {
    currentStep?: number;
}

const steps = [
    {
        title: "Session",
        icon: ClipboardList,
    },
    {
        title: "Goal",
        icon: Flag,
    },
    {
        title: "Activities",
        icon: ListChecks,
    },
    {
        title: "Ling Six",
        icon: Ear,
    },
    {
        title: "Evaluation",
        icon: NotebookPen,
    },
];

export default function ProgressStepper({
    currentStep = 0,
}: ProgressStepperProps) {
    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const Icon = step.icon;

                    const completed = index < currentStep;

                    const active = index === currentStep;

                    return (
                        <div
                            key={step.title}
                            className="flex flex-1 items-center"
                        >
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        "flex h-12 w-12 items-center justify-center rounded-full border transition-all",

                                        completed &&
                                            "border-emerald-500 bg-emerald-500 text-white",

                                        active &&
                                            "border-primary bg-primary text-primary-foreground shadow",

                                        !completed &&
                                            !active &&
                                            "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {completed ? (
                                        <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                        <Icon className="h-5 w-5" />
                                    )}
                                </div>

                                <span
                                    className={cn(
                                        "mt-2 text-xs font-medium",

                                        active && "text-primary",

                                        completed && "text-emerald-600",

                                        !completed &&
                                            !active &&
                                            "text-muted-foreground"
                                    )}
                                >
                                    {step.title}
                                </span>
                            </div>

                            {index !== steps.length - 1 && (
                                <div className="mx-3 h-[2px] flex-1 rounded-full bg-border">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all",

                                            completed
                                                ? "w-full bg-emerald-500"
                                                : "w-0"
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
