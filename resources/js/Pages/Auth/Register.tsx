import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { toastError, toastSuccess } from "@/lib/sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Activity, Ear } from "lucide-react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onSuccess: () => toastSuccess("Registrasi berhasil"),
            onError: () =>
                toastError("Registrasi gagal", "Cek data yang Anda masukkan"),
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Head title="Register" />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-10">
                {/* BACKGROUND */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute left-25 top-25 h-75 w-75 rounded-full bg-primary/20 blur-3xl" />

                    <div className="absolute bottom-25 right-25 h-87.5 w-87.5 rounded-full bg-cyan-500/20 blur-3xl" />
                </div>

                <Card className="w-full max-w-md border-0 bg-background/80 shadow-2xl backdrop-blur-xl">
                    <CardContent className="p-8">
                        {/* LOGO */}
                        <div className="mb-8 flex flex-col items-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                                <Ear className="h-8 w-8" />
                            </div>

                            <h1 className="mt-4 text-2xl font-bold">
                                Register AVT
                            </h1>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Buat akun orang tua
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <Label>Nama</Label>

                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Masukkan nama"
                                    className="h-11 rounded-xl"
                                />

                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

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

                            <div className="space-y-2">
                                <Label>Password</Label>

                                <Input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="Masukkan password"
                                    className="h-11 rounded-xl"
                                />

                                {errors.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Konfirmasi Password</Label>

                                <Input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Ulangi password"
                                    className="h-11 rounded-xl"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="h-11 w-full rounded-xl"
                                disabled={processing}
                            >
                                {processing ? "Loading..." : "Register"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Sudah punya akun?{" "}
                            <Link
                                href={route("login")}
                                className="font-medium text-primary hover:underline"
                            >
                                Login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
