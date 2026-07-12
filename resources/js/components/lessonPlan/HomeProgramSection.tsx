import { Home, Plus } from "lucide-react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import HomeProgramItem from "./HomeProgramItem";

interface Props {
    form: any;
    addExercise: () => void;
    removeExercise: (index: number) => void;
    updateExercise: (index: number, field: any, value: string) => void;
}

export default function HomeProgramSection({
    form,
    addExercise,
    removeExercise,
    updateExercise,
}: Props) {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-primary" />
                        Home Program
                    </CardTitle>

                    <CardDescription>
                        Latihan yang dilakukan di rumah bersama orang tua.
                    </CardDescription>
                </div>

                <Button type="button" onClick={addExercise}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Exercise
                </Button>
            </CardHeader>

            <CardContent className="space-y-5">
                {form.data.home_program.map((item: any, index: number) => (
                    <HomeProgramItem
                        key={index}
                        index={index}
                        item={item}
                        update={updateExercise}
                        remove={removeExercise}
                    />
                ))}
            </CardContent>
        </Card>
    );
}
