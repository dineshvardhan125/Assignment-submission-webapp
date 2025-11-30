"use client";

import { Search, Bell, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface AppTopbarProps {
    userName: string;
    userRole: string;
    avatar?: string;
}

export function AppTopbar({ userName, userRole, avatar }: AppTopbarProps) {
    const { setTheme, theme } = useTheme();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {
            console.error(e);
        }

        toast.success("Logged out successfully", {
            description: "You have been signed out of your account",
        });
        router.push("/login");
    };

    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        if (userRole !== 'student') return;
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.isRead).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Poll for notifications every minute
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);
    return (
        <header className="h-16 border-b border-border bg-card/40 backdrop-blur-xl flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        className="pl-10 bg-secondary/50 border-border/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="hover-glow"
                >
                    {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>

                {userRole === 'student' && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover-glow relative" onClick={fetchNotifications}>
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                            <DropdownMenuLabel className="flex justify-between items-center">
                                <span>Notifications</span>
                                {unreadCount > 0 && (
                                    <span
                                        className="text-xs text-primary cursor-pointer hover:underline"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            await fetch('/api/notifications', {
                                                method: 'PATCH',
                                                body: JSON.stringify({ id: 'all' }),
                                            });
                                            fetchNotifications();
                                        }}
                                    >
                                        Mark all read
                                    </span>
                                )}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    No notifications
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <DropdownMenuItem
                                        key={notification._id}
                                        className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notification.isRead ? 'bg-secondary/50' : ''}`}
                                        onClick={async () => {
                                            if (!notification.isRead) {
                                                await fetch('/api/notifications', {
                                                    method: 'PATCH',
                                                    body: JSON.stringify({ id: notification._id }),
                                                });
                                                fetchNotifications();
                                            }
                                        }}
                                    >
                                        <p className={`text-sm ${!notification.isRead ? 'font-semibold' : ''}`}>
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </p>
                                    </DropdownMenuItem>
                                ))
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-3 pl-4 border-l border-border hover-glow">
                            <Avatar className="w-9 h-9 border-2 border-primary/20">
                                <AvatarImage src={`https://api.dicebear.com/7.x/${avatar || 'adventurer-neutral'}/svg?seed=${userName}`} />
                                <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                                <p className="text-sm font-medium">{userName}</p>
                                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/${userRole}/profile`)}>
                            Profile Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/${userRole}/dashboard`)}>
                            Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive cursor-pointer">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You will be redirected to the login page.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Logout
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
