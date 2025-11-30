"use client";

<<<<<<< HEAD
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Hash, BookOpen, Layers, Calendar } from "lucide-react";
=======
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Hash, BookOpen, Layers, Calendar } from "lucide-react";
import { AvatarSelection } from "@/components/AvatarSelection";
>>>>>>> friend/main

export function StudentProfileClient() {
    const { data: userData, isLoading } = useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
<<<<<<< HEAD
            const res = await fetch("/api/auth/me");
=======
            const res = await fetch("/api/auth/me", { cache: 'no-store' });
>>>>>>> friend/main
            if (!res.ok) throw new Error("Failed to fetch profile");
            return res.json();
        },
    });

    const user = userData?.user;

<<<<<<< HEAD
=======
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleAvatarUpdate = () => {
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        router.refresh();
    };

>>>>>>> friend/main
    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold tracking-tight mb-6">My Profile</h1>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-muted-foreground">Failed to load profile data.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
<<<<<<< HEAD
=======
                        <div className="flex justify-center mb-6">
                            <AvatarSelection
                                currentAvatar={user.avatar || 'adventurer-neutral'}
                                userName={user.name}
                                onAvatarUpdate={handleAvatarUpdate}
                            />
                        </div>
>>>>>>> friend/main
                        <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Full Name</p>
                                <p className="font-medium">{user.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email Address</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Academic Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                            <div className="bg-blue-500/10 p-2 rounded-full">
                                <Hash className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Roll Number</p>
                                <p className="font-medium">{user.rollNumber || "Not set"}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                            <div className="bg-green-500/10 p-2 rounded-full">
                                <BookOpen className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Branch</p>
                                <p className="font-medium">{user.branch || "Not set"}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                            <div className="bg-orange-500/10 p-2 rounded-full">
                                <Layers className="h-5 w-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Section</p>
                                <p className="font-medium">{user.section || "Not set"}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                            <div className="bg-purple-500/10 p-2 rounded-full">
                                <Calendar className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Year</p>
                                <p className="font-medium">{user.year || "Not set"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
