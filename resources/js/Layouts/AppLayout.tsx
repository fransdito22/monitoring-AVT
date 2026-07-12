import { PropsWithChildren, ReactNode } from "react";
import { usePage } from "@inertiajs/react";
import { AppSidebar } from "@/Components/AppSidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user as {
        name: string;
        email: string;
        role?: string;
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="min-h-screen bg-background">
                    {/* Top Navbar */}
                    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            {/* Page Header */}
                            {header && (
                                <div className="px-6 py-4">{header}</div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium">
                                    {user.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="p-6">{children}</main>
                    <Toaster
                        richColors
                        closeButton
                        position="top-right"
                        duration={3500}
                    />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
