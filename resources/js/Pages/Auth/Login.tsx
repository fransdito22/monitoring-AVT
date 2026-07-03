import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Ear, Brain, HeartHandshake, Eye, EyeOff } from "lucide-react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const [role, setRole] = useState<"admin" | "therapist" | "parent">(
        "therapist"
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen flex overflow-hidden bg-background">
                {/* LEFT SIDE */}
                <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center ">
                    {/* BACKGROUND IMAGE */}
                    <img
                        src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1600&auto=format&fit=crop"
                        alt="AVT"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />

                    {/* CONTENT */}
                    <div className="relative z-10 max-w-xl rounded-[32px] border border-white/20 bg-white/70 p-10 shadow-2xl backdrop-blur-xl">
                        {/* LOGO */}
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                <Ear className="h-7 w-7" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-primary">
                                    AVT Connect
                                </h1>

                                <p className="text-sm text-muted-foreground">
                                    Auditory Verbal Therapy
                                </p>
                            </div>
                        </div>

                        {/* HERO */}
                        <h2 className="text-5xl font-bold leading-tight tracking-tight text-foreground">
                            Empowering every child's voice.
                        </h2>

                        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                            Connect with therapists, monitor therapy progress,
                            and support every stage of auditory verbal
                            development in one integrated platform.
                        </p>

                        {/* FEATURES */}
                        <div className="mt-10 grid gap-4">
                            <Card className="border-white/30 bg-white/60 shadow-none backdrop-blur">
                                <CardContent className="flex items-start gap-4 p-5">
                                    <div className="rounded-2xl bg-primary/10 p-3">
                                        <Brain className="h-5 w-5 text-primary" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            Monitoring Progress
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Rekam perkembangan terapi anak
                                            secara detail dan terstruktur.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-white/30 bg-white/60 shadow-none backdrop-blur">
                                <CardContent className="flex items-start gap-4 p-5">
                                    <div className="rounded-2xl bg-primary/10 p-3">
                                        <HeartHandshake className="h-5 w-5 text-primary" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            Kolaborasi Orang Tua
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Orang tua dapat memantau progres
                                            terapi AVT.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* RIGHT SIDE */}
                <main className="flex w-full lg:w-1/2 items-center justify-center bg-background px-6 py-10 lg:px-16">
                    <div className="w-full max-w-md">
                        {/* MOBILE LOGO */}
                        <div className="mb-10 flex items-center gap-4 lg:hidden">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                <Ear className="h-7 w-7" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-primary">
                                    AVT Connect
                                </h1>

                                <p className="text-sm text-muted-foreground">
                                    Auditory Verbal Therapy
                                </p>
                            </div>
                        </div>

                        {/* HEADER */}
                        <div className="mb-8">
                            <h2 className="text-4xl font-bold tracking-tight">
                                Welcome Back
                            </h2>

                            <p className="mt-2 text-muted-foreground">
                                Access your therapy dashboard and patient data
                            </p>
                        </div>

                        {/* STATUS */}
                        {status && (
                            <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                {status}
                            </div>
                        )}

                        {/* FORM */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* EMAIL */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    autoFocus
                                    autoComplete="username"
                                    placeholder="name@clinic.com"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="h-12 rounded-2xl border-muted bg-background/70"
                                />

                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* PASSWORD */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>

                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={data.password}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="h-12 rounded-2xl border-muted bg-background/70 pr-12"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>

                                {errors.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* REMEMBER */}
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) =>
                                        setData("remember", checked === true)
                                    }
                                />

                                <Label
                                    htmlFor="remember"
                                    className="font-normal text-muted-foreground"
                                >
                                    Remember me for 30 days
                                </Label>
                            </div>

                            {/* BUTTON */}
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-14 w-full rounded-2xl text-base font-semibold shadow-lg"
                            >
                                {processing
                                    ? "Loading..."
                                    : "Sign in to Portal"}
                            </Button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}
