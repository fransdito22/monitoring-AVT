import { Button } from "@/components/ui/button";

interface VisitOptions {
    onStart?: () => void;
    onSuccess?: () => void;
    onError?: (errors: Record<string, string>) => void;
    onFinish?: () => void;
}

interface Props {
    form: {
        data: Record<string, any>;
        post: (url: string, options?: VisitOptions) => void;
        put: (url: string, options?: VisitOptions) => void;
    };
    mode?: "create" | "edit";
    lessonPlanId?: number;
}

export default function FormActions({
    form,
    mode = "create",
    lessonPlanId,
}: Props) {
    const handleSubmit = () => {
        console.log("Form Data:");
        console.log(form.data);
        console.log(JSON.stringify(form.data, null, 2));

        const options: VisitOptions = {
            onStart: () => console.log("START"),
            onSuccess: () => console.log("SUCCESS"),
            onError: (errors) => console.log("ERROR", errors),
            onFinish: () => console.log("FINISH"),
        };

        if (mode === "edit") {
            if (!lessonPlanId) {
                console.error("lessonPlanId is required for update.");
                return;
            }

            form.put(route("lesson-plans.update", lessonPlanId), options);
            return;
        }

        form.post(route("lesson-plans.store"), options);
    };

    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
            <Button
                type="button"
                onClick={handleSubmit}
            >
                {mode === "edit" ? "Update Draft" : "Save Draft"}
            </Button>
        </div>
    );
}