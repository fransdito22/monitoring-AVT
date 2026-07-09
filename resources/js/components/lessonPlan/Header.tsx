import { Link } from "@inertiajs/react";
import { ArrowLeft, ClipboardCheck, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Header() {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl"
                >
                    <Link href={route("lesson-plans.index")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>

                <div>

                    <div className="flex items-center gap-3">

                        <ClipboardCheck className="h-7 w-7 text-primary" />

                        <h1 className="text-2xl font-bold tracking-tight">
                            Create Lesson Plan
                        </h1>

                        <Badge
                            variant="secondary"
                            className="rounded-full"
                        >
                            Draft
                        </Badge>

                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Isi seluruh hasil terapi untuk menghasilkan laporan
                        perkembangan pasien.
                    </p>

                </div>

            </div>

            <Button
                type="button"
                variant="outline"
                className="rounded-xl"
            >
                <Save className="mr-2 h-4 w-4" />

                Save Draft
            </Button>

        </div>
    );
}