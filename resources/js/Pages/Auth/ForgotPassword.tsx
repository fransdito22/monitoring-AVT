import { Head, useForm } from "@inertiajs/react";
import { toastError, toastSuccess } from "@/lib/sonner";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Activity, Ear } from "lucide-react";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("password.email"), {
            onSuccess: () => toastSuccess("Link reset dikirim"),
            onError: () => toastError("Gagal mengirim link reset"),
        });
    };

    return (
        <>
            <Head title="Forgot Password" />

            <div className="flex min-h-screen items-center justify-center bg-background px-6">
                <Card className="w-full max-w-md border-0 shadow-2xl">
                    <CardContent className="p-8">
                        <div className="mb-8 flex flex-col items-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                <Ear className="h-8 w-8" />
                            </div>

                            <h1 className="mt-4 text-2xl font-bold">
                                Forgot Password
                            </h1>

                            <p className="mt-2 text-center text-sm text-muted-foreground">
                                Masukkan email untuk reset password
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 rounded-xl bg-green-100 px-4 py-3 text-sm text-green-700">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <Label>Email</Label>

                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="Masukkan email"
                                    className="h-11 rounded-xl"
                                />

                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="h-11 w-full rounded-xl"
                                disabled={processing}
                            >
                                {processing ? "Loading..." : "Kirim Link Reset"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
