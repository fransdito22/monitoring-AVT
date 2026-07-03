import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar";

import {
    ClipboardList,
    LayoutDashboard,
    Users,
    HeartPulse,
    Ear,
    User,
    Calendar,
    BookOpenCheck,
    NotebookPen,
    LogOut,
    Sparkles,
    BookText,
} from "lucide-react";

import { Link, usePage } from "@inertiajs/react";

const items = {
    praktisi: [
        {
            title: "Dashboard",
            url: route("dashboard.praktisi"),
            icon: LayoutDashboard,
            match: "dashboard",
        },
        {
            title: "Pasien",
            url: route("patients.praktisi"),
            icon: User,
            match: "patients",
        },
        {
            title: "Jadwal",
            url: route("schedule.praktisi"),
            icon: Calendar,
            match: "schedule",
        },
        {
            title: "Lesson Plan",
            url: route("lesson-plans.index"),
            icon: NotebookPen,
            match: "lesson-plans",
        },
        {
            title: "Tes Artikulasi",
            url: route("reports.index"),
            icon: BookOpenCheck,
            match: "reports",
        },
    ],

    admin: [
        {
            title: "Dashboard Admin",
            url: route("dashboard.admin"),
            icon: LayoutDashboard,
            match: "/dashboard-admin",
        },
        {
            title: "Manajemen Akun",
            url: route("admin.users.index"),
            icon: Users,
            match: "/admin/users",
        },
        {
            title: "Manajemen Pasien",
            url: route("admin.children.index"),
            icon: ClipboardList,
            match: "/admin/children",
        },
    ],

    orangtua: [
        {
            title: "Dashboard",
            url: route("dashboard.orangtua"),
            icon: LayoutDashboard,
            match: "dashboard-orangtua",
        },
        {
            title: "Pasien",
            url: route("patients.orangtua"),
            icon: Users,
            match: "patients-orangtua",
        },
        {
            title: "Terapi AVT",
            url: route("schedule.orangtua"),
            icon: HeartPulse,
            match: "schedule-orangtua",
        },
        {
            title: "Child Progress",
            url: route("child-progress.orangtua"),
            icon: Sparkles,
            match: "child-progress",
        },
        {
            title: "Progress Reports",
            url: route("progress-reports.orangtua"),
            icon: BookText,
            match: "progress-reports",
        },
    ],
};

export function AppSidebar() {
    const { url, props } = usePage();

    const user = props.auth.user;

    const roleKey =
        user?.role === "orangtua"
            ? "orangtua"
            : user?.role === "admin"
            ? "admin"
            : "praktisi";

    const menuItems = items[roleKey] ?? [];
    const profileUrl = route("profile.edit");

    const initials = user?.name
        ?.split(" ")
        ?.map((word: string) => word[0])
        ?.join("")
        ?.slice(0, 2)
        ?.toUpperCase();

    const roleLabel =
        user?.role === "orangtua"
            ? "Orang Tua"
            : user?.role === "admin"
            ? "Admin"
            : "Praktisi AVT";

    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarContent>
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Ear className="h-5 w-5" />
                    </div>

                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-semibold">
                            Monitoring AVT
                        </span>

                        <span className="text-xs text-muted-foreground">
                            Auditory Verbal Therapy
                        </span>
                    </div>
                </div>

                <SidebarSeparator />

                {/* Menu */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={url.includes(
                                                item.match ?? ""
                                            )}
                                            render={<Link href={item.url} />}
                                        >
                                            <Icon className="h-4 w-4" />

                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t bg-sidebar">
                <div className="space-y-3 p-3 group-data-[collapsible=icon]:space-y-2 group-data-[collapsible=icon]:p-2">
                    {/* Info */}
                    <div className="rounded-xl border bg-sidebar-accent/40 p-3 group-data-[collapsible=icon]:hidden">
                        <p className="text-xs leading-relaxed text-muted-foreground">
                            Sistem monitoring perkembangan terapi verbal
                            auditori pasien AVT.
                        </p>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-3 rounded-xl border bg-background p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1.5">
                        {/* Avatar */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9">
                            {initials}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                            <p className="truncate text-sm font-medium">
                                {user?.name}
                            </p>

                            <p className="truncate text-xs capitalize text-muted-foreground">
                                {roleLabel}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
                        {/* Profile */}
                        <Link
                            href={profileUrl}
                            className="
                                flex h-9 flex-1 items-center justify-center gap-2
                                rounded-lg border bg-background px-3 text-sm
                                transition-colors hover:bg-accent
                                group-data-[collapsible=icon]:h-9
                                group-data-[collapsible=icon]:w-9
                                group-data-[collapsible=icon]:flex-none
                                group-data-[collapsible=icon]:px-0
                            "
                            title="Profile"
                        >
                            <User className="hidden h-4 w-4 group-data-[collapsible=icon]:block" />
                            <span className="group-data-[collapsible=icon]:hidden">
                                Profile
                            </span>
                        </Link>

                        {/* Logout */}
                        <form
                            method="post"
                            action={route("logout")}
                            className="flex-1 group-data-[collapsible=icon]:flex-none"
                        >
                            <button
                                type="submit"
                                className="
                                    flex h-9 w-full items-center justify-center gap-2
                                    rounded-lg border border-destructive/20
                                    bg-destructive/10 px-3 text-sm text-destructive
                                    transition-colors hover:bg-destructive/20
                                    group-data-[collapsible=icon]:h-9
                                    group-data-[collapsible=icon]:w-9
                                    group-data-[collapsible=icon]:px-0
                                "
                                title="Logout"
                            >
                                <LogOut className="hidden h-4 w-4 group-data-[collapsible=icon]:block" />
                                <span className="group-data-[collapsible=icon]:hidden">
                                    Logout
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
