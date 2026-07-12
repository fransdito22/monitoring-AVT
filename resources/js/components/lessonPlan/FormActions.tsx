import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
    /**
     * create/edit label switch.
     */
    mode?: "create" | "edit";

    /**
     * Parent handles validation + UX + submit.
     */
    onSubmit: () => void;
}

export default function FormActions({ mode = "create", onSubmit }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClick = () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            onSubmit();
        } finally {
            // Defensive guard: real submit remounts on success,
            // but we keep a short guard to prevent double click.
            setTimeout(() => setIsSubmitting(false), 300);
        }
    };

    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
            <Button type="button" onClick={handleClick} disabled={isSubmitting}>
                {isSubmitting
                    ? "Saving..."
                    : mode === "edit"
                    ? "Update Draft"
                    : "Save Draft"}
            </Button>
        </div>
    );
}
