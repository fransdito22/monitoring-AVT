import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function WelcomeBanner() {
    return (
        <Card className="border-0 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-xl">
            <CardContent className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                    <div className="max-w-3xl">
                        <p className="text-sm/6 text-cyan-100">Welcome back</p>
                        <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                            Monitor your child’s AVT progress with confidence
                        </h1>
                        <p className="mt-2 text-sm text-cyan-100 md:text-base">
                            Pantau perkembangan terapi, jadwal sesi, target
                            terapi, dan latihan rumah dalam satu dashboard.
                        </p>
                    </div>

                    <div className="hidden rounded-2xl bg-white/20 p-3 md:block">
                        <Sparkles className="h-7 w-7" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
