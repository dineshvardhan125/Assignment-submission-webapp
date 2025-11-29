import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppTopbar } from "@/components/AppTopbar";

import { getCurrentUser } from "@/lib/auth";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    return (
        <SidebarProvider defaultOpen>
            <div className="flex min-h-screen w-full">
                <AppSidebar role="student" />
                <div className="flex-1 flex flex-col">
                    <AppTopbar userName={user?.name || "Student User"} userRole="student" />
                    <main className="flex-1 p-8 bg-gradient-to-br from-background via-background to-accent/5">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
