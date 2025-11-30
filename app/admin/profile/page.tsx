import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarSelection } from "@/components/AvatarSelection";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User, Mail, Calendar, Shield } from "lucide-react";

export default async function AdminProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and view your profile information.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <AvatarSelection currentAvatar={user.avatar || 'adventurer-neutral'} userName={user.name} />
                            <div>
                                <h3 className="text-xl font-semibold">{user.name}</h3>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <Badge className="mt-2" variant="secondary">
                                    {user.role}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Full Name</p>
                                    <p className="text-sm text-muted-foreground">{user.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Email Address</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Role</p>
                                    <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Member Since</p>
                                    <p className="text-sm text-muted-foreground">
                                        {user.createdAt ? format(new Date(user.createdAt), "MMMM d, yyyy") : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
