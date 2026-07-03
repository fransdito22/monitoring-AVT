import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";

import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Baby, ShieldCheck, UserCog, Users } from "lucide-react";

type AdminDashboardSummary = {
    totalChildren?: number;
    totalParents?: number;
    totalTherapists?: number;
    totalUserAccounts?: number;
};

type RecentChild = {
    id: number;
    name: string;
    parent_name: string;
    therapist_name: string;
    created_at: string | null;
};

type RecentAccount = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string | null;
};

type RecentActivity = {
    type: string;
    title: string;
    description: string;
    created_at: string | null;
};

type Props = {
    summary?: AdminDashboardSummary;
    recentRegisteredChildren?: RecentChild[];
    recentlyCreatedAccounts?: RecentAccount[];
    recentActivities?: RecentActivity[];
};

const roleLabel: Record<string, string> = {
    admin: "Admin",
    orang_tua: "Parent",
    praktisi_avt: "Therapist",
};

const formatDateTime = (value: string | null) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

export default function DashboardAdmin({
    summary,
    recentRegisteredChildren = [],
    recentlyCreatedAccounts = [],
    recentActivities = [],
}: Props) {
    const stats = [
        {
            title: "Total Children",
            value: summary?.totalChildren ?? 0,
            icon: Baby,
        },
        {
            title: "Total Parents",
            value: summary?.totalParents ?? 0,
            icon: Users,
        },
        {
            title: "Total Therapists",
            value: summary?.totalTherapists ?? 0,
            icon: UserCog,
        },
        {
            title: "Total User Accounts",
            value: summary?.totalUserAccounts ?? 0,
            icon: ShieldCheck,
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                AVT Monitoring System
                            </p>
                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                Welcome back, Admin
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Manage accounts and children data from one
                                simple dashboard.
                            </p>
                        </div>

                        <Badge
                            variant="secondary"
                            className="h-fit rounded-full"
                        >
                            <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                            Administrator
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Card key={item.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {item.title}
                                    </CardTitle>
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">
                                        {item.value}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-xl border bg-card p-4">
                        <h3 className="mb-3 text-lg font-semibold">
                            Quick Actions
                        </h3>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <Button
                                size="sm"
                                className="w-full justify-start p-6"
                                onClick={() =>
                                    (window.location.href = route(
                                        "admin.children.index"
                                    ))
                                }
                            >
                                <Baby className="mr-2 h-4 w-4 " />
                                Kelola Anak
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="w-full justify-start p-6"
                                onClick={() =>
                                    (window.location.href =
                                        route("admin.users.index"))
                                }
                            >
                                <Users className="mr-2 h-4 w-4" />
                                Kelola Akun
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activities</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentActivities.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No recent activities.
                                </p>
                            ) : (
                                recentActivities.map((activity, index) => (
                                    <div
                                        key={`${activity.type}-${index}`}
                                        className="space-y-1 border-b pb-3 last:border-0 last:pb-0"
                                    >
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                                            {activity.title}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDateTime(
                                                activity.created_at
                                            )}
                                        </p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Registered Children</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentRegisteredChildren.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No children registered yet.
                                </p>
                            ) : (
                                recentRegisteredChildren.map((child) => (
                                    <div
                                        key={child.id}
                                        className="space-y-1 border-b pb-3 last:border-0 last:pb-0"
                                    >
                                        <div className="font-medium">
                                            {child.name}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Parent: {child.parent_name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Therapist: {child.therapist_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Registered:{" "}
                                            {formatDateTime(child.created_at)}
                                        </p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recently Created Accounts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentlyCreatedAccounts.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No accounts created yet.
                                </p>
                            ) : (
                                recentlyCreatedAccounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className="space-y-1 border-b pb-3 last:border-0 last:pb-0"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">
                                                {account.name}
                                            </span>
                                            <Badge variant="outline">
                                                {roleLabel[account.role] ??
                                                    account.role}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {account.email}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Created:{" "}
                                            {formatDateTime(account.created_at)}
                                        </p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
