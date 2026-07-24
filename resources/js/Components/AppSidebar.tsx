import React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
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
    Calendar1Icon,
    ChevronRight,
} from "lucide-react";

import { Link, usePage } from "@inertiajs/react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const items = {
    praktisi: [
        {
            title: "Dasboard",
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
            title: "Sesi Terapi",
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
            title: "Dasboard",
            url: route("dashboard.admin"),
            icon: LayoutDashboard,
            match: "/dashboard-admin",
        },
        {
            title: "Jadwal",
            url: route("schedule.admin"),
            icon: Calendar1Icon,
            match: "/schedule-admin",
        },
    ],

    orang_tua: [
        {
            title: "Dasboard",
            url: route("dashboard.orangtua"),
            icon: LayoutDashboard,
            match: "dashboard-orangtua",
        },

        // {
        //     title: "Terapi AVT",
        //     url: route("schedule.orangtua"),
        //     icon: HeartPulse,
        //     match: "schedule-orangtua",
        // },
        {
            title: "Perkembangan Anak",
            url: route("child-progress.orangtua"),
            icon: Sparkles,
            match: "child-progress",
        },
        {
            title: "Progres Terapi",
            url: route("progress.orangtua"),
            icon: BookText,
            match: "progress-reports",
        },
    ],
};

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function AppSidebar() {
    const { url, props } = usePage();

    const user = props.auth.user;

    const roleKey =
        user?.role === "orang_tua"
            ? "orang_tua"
            : user?.role === "admin"
            ? "admin"
            : "praktisi";

    const menuItems = items[roleKey] ?? [];

    let profileUrl = "/";
    if (user?.role === "admin") {
        profileUrl = route("admin.profile");
    } else if (user?.role === "praktisi_avt") {
        profileUrl = route("therapist.profile");
    } else if (user?.role === "orang_tua") {
        profileUrl = route("profile.orangtua.edit");
    }

    const initials = user?.name
        ?.split(" ")
        ?.map((word: string) => word[0])
        ?.join("")
        ?.slice(0, 2)
        ?.toUpperCase();

    const roleLabel =
        user?.role === "orang_tua"
            ? "Orang Tua"
            : user?.role === "admin"
            ? "Admin"
            : "Praktisi AVT";

    const isAdmin = roleKey === "admin";

    const isUsersActive = url.includes("/admin/users");
    const isPatientsActive = url.includes("/admin/children");
    const isMasterDataOpen = isUsersActive || isPatientsActive;

    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarContent>
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Ear className="h-5 w-5" />
                    </div>

                    <div
                        className="
                            flex flex-col
                            transition-all duration-300 ease-in-out
                            group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0
                            group-data-[collapsible=icon]:overflow-hidden
                        "
                    >
                        <span className="text-sm font-semibold">
                            Monitoring AVT
                        </span>

                        <span className="text-xs text-muted-foreground">
                            Terapi Verbal Auditori
                        </span>
                    </div>
                </div>

                <SidebarSeparator />

                {/* Menu */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Non-master items */}
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

                            {/* Admin Master Data */}
                            {isAdmin && (
                                <AdminMasterDataMenu
                                    isActive={isMasterDataOpen}
                                    isUsersActive={isUsersActive}
                                    isPatientsActive={isPatientsActive}
                                />
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t bg-sidebar">
                <div
                    className="
                        relative w-full
                        flex flex-col items-center
                        space-y-3 px-3 py-3
                        transition-all duration-300 ease-in-out
                        group-data-[collapsible=icon]:space-y-2 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2
                    "
                >
                    {/* Info */}
                    <div
                        className="
                            w-full rounded-xl border bg-sidebar-accent/40 p-3
                            transition-all duration-300 ease-in-out
                            group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:p-0
                            group-data-[collapsible=icon]:overflow-hidden
                        "
                    >
                        <p className="text-xs leading-relaxed text-muted-foreground">
                            Sistem monitoring perkembangan terapi verbal
                            auditori pasien AVT.
                        </p>
                    </div>

                    {/* User */}
                    <div
                        className="
                            flex w-full items-center gap-3 rounded-xl border bg-background p-2
                            transition-all duration-300 ease-in-out
                            group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0
                        "
                    >
                        {/* Avatar */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9">
                            {initials}
                        </div>

                        {/* User Info */}
                        <div
                            className="
                                flex-1 overflow-hidden
                                transition-all duration-300 ease-in-out
                                group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0
                            "
                        >
                            <p className="truncate text-sm font-medium">
                                {user?.name}
                            </p>

                            <p className="truncate text-xs capitalize text-muted-foreground">
                                {roleLabel}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div
                        className="
                            flex w-full items-center justify-center gap-2
                            group-data-[collapsible=icon]:flex-col
                        "
                    >
                        {/* Profile */}
                        <Tooltip>
                            <TooltipTrigger>
                                <Link
                                    href={profileUrl}
                                    className="
                                        flex h-9 w-full items-center justify-center gap-2
                                        rounded-lg border bg-background px-3 text-sm
                                        transition-all duration-300 ease-in-out
                                        hover:bg-accent
                                        group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex-none
                                    "
                                    title="Profil"
                                >
                                    <User className="h-4 w-4" />
                                    <span
                                        className="
                                            transition-all duration-300 ease-in-out
                                            group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden
                                        "
                                    >
                                        Profil
                                    </span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="center">
                                Profil
                            </TooltipContent>
                        </Tooltip>

                        {/* Logout */}
                        <Tooltip>
                            <TooltipTrigger>
                                <form
                                    method="post"
                                    action={route("logout")}
                                    className="w-full"
                                >
                                    <button
                                        type="submit"
                                        className="
                                            flex h-9 w-full items-center justify-center gap-2
                                            rounded-lg border border-destructive/20
                                            bg-destructive/10 px-3 text-sm text-destructive
                                            transition-all duration-300 ease-in-out
                                            hover:bg-destructive/20
                                            group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:px-0
                                        "
                                        title="Keluar"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span
                                            className="
                                                transition-all duration-300 ease-in-out
                                                group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden
                                            "
                                        >
                                            Keluar
                                        </span>
                                    </button>
                                </form>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="center">
                                Keluar
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}

function AdminMasterDataMenu({
    isActive,
    isUsersActive,
    isPatientsActive,
}: {
    isActive: boolean;
    isUsersActive: boolean;
    isPatientsActive: boolean;
}) {
    const [open, setOpen] = React.useState(isActive);

    React.useEffect(() => {
        if (isActive) setOpen(true);
    }, [isActive]);

    return (
        <SidebarMenuItem>
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        tooltip="Data Master"
                        isActive={isActive}
                    >
                        <div className="flex items-center gap-2">
                            <ChevronRight
                                className={[
                                    "h-4 w-4 text-sidebar-accent-foreground transition-transform duration-200 ease-in-out",
                                    open ? "rotate-90" : "rotate-0",
                                ].join(" ")}
                            />
                            <span>Data Master</span>
                        </div>
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className="overflow-hidden transition-[max-height,opacity,transform] duration-200 ease-in-out data-state-open:opacity-100 data-state-open:translate-y-0 data-state-closed:opacity-0 data-state-closed:-translate-y-1">
                    <SidebarMenuSub className="pl-5">
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                                render={
                                    <Link
                                        href={route("admin.users.index")}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                }
                                isActive={isUsersActive}
                            >
                                <Users className="h-4 w-4" />
                                <span>Manajemen Akun</span>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                                render={
                                    <Link
                                        href={route("admin.children.index")}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                }
                                isActive={isPatientsActive}
                            >
                                <ClipboardList className="h-4 w-4" />
                                <span>Manajemen Pasien</span>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
}
