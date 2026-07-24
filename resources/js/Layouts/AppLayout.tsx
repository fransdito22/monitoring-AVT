import { PropsWithChildren, ReactNode } from "react";
import { usePage } from "@inertiajs/react";
import { AppSidebar } from "@/Components/AppSidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import ToastBridge from "@/components/ToastBridge";
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
            <ToastBridge />
            <AppSidebar />
            <SidebarInset>
                <div className="min-h-screen bg-background">
                    {/* Top Navbar - Responsive */}
                    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
                        <div className="flex items-center gap-2 md:gap-4 min-w-0">
                            <SidebarTrigger />
                            {/* Page Header */}
                            {header && (
                                <div className="px-2 md:px-6 py-4 truncate">
                                    {header}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 shrink-0">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium truncate max-w-[120px] md:max-w-[200px]">
                                    {user.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate max-w-[120px] md:max-w-[200px]">
                                    {user.email}
                                </p>
                            </div>
                            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary text-xs md:text-sm font-medium text-primary-foreground">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </header>

                    {/* Main Content - Responsive padding */}
                    <main className="p-3 md:p-6">{children}</main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
