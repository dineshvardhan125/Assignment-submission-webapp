"use client";

import { LayoutDashboard, FileText, CheckSquare, Users, User } from "lucide-react";
import { NavLink } from "./NavLink";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
    role: "admin" | "student";
}

export function AppSidebar({ role }: AppSidebarProps) {
    const { open } = useSidebar();

    const adminItems = [
        { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
        { title: "Assignments", url: "/admin/assignments", icon: FileText },
        { title: "Submissions", url: "/admin/submissions", icon: CheckSquare },
        { title: "Users", url: "/admin/users", icon: Users },
        { title: "Profile", url: "/admin/profile", icon: User },
    ];

    const studentItems = [
        { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard },
        { title: "Assignments", url: "/student/assignments", icon: FileText },
        { title: "Submissions", url: "/student/submissions", icon: CheckSquare },
        { title: "Profile", url: "/student/profile", icon: User },
    ];

    const items = role === "admin" ? adminItems : studentItems;

    return (
        <Sidebar className="border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl">
            <SidebarContent>
                <div className="p-6 border-b border-sidebar-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow">
                            <FileText className="w-5 h-5 text-primary-foreground" />
                        </div>
                        {open && (
                            <div>
                                <h2 className="text-lg font-bold">AssignHub</h2>
                                <p className="text-xs text-muted-foreground capitalize">{role}</p>
                            </div>
                        )}
                    </div>
                </div>

                <SidebarGroup>
                    <SidebarGroupContent className="p-4">
                        <SidebarMenu className="space-y-2">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="hover-glow">
                                        <NavLink
                                            to={item.url}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                                            activeClassName="bg-primary/10 text-primary border border-primary/20"
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {open && <span className="font-medium">{item.title}</span>}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
