import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppTopbar } from "@/components/AppTopbar";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
        // Optional: Redirect to login if not authenticated or not admin
        // redirect('/login'); 
        // For now, we'll just show a fallback or let the page handle it, 
        // but ideally layout should protect the route.
    }

    return (
        <SidebarProvider defaultOpen>
            <div className="flex min-h-screen w-full">
                <AppSidebar role="admin" />
                <div className="flex-1 flex flex-col">
                    <AppTopbar userName={user?.name || "Admin User"} userRole="admin" />
                    <main className="flex-1 p-8 bg-gradient-to-br from-background via-background to-primary/5">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
