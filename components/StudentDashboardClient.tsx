"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import { BookOpen, Clock, CheckSquare, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function StudentDashboardClient() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["studentStats"],
        queryFn: async () => {
            const res = await fetch("/api/dashboard/student/stats");
            if (!res.ok) throw new Error("Failed to fetch stats");
            return res.json();
        },
    });

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-[120px] rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Assignments"
                    value={stats?.totalAssignments || 0}
                    icon={BookOpen}
                    description="Total assigned"
                />
                <StatsCard
                    title="Pending"
                    value={stats?.pendingAssignments || 0}
                    icon={Clock}
                    description="Due soon"
                />
                <StatsCard
                    title="Submitted"
                    value={stats?.submittedAssignments || 0}
                    icon={CheckSquare}
                    description="Waiting for grade"
                />
                <StatsCard
                    title="Average Grade"
                    value={stats?.averageGrade || "N/A"}
                    icon={Award}
                    description="Across all subjects"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <div>
                                    <p className="font-medium">Physics Lab Report</p>
                                    <p className="text-sm text-muted-foreground">Due: Tomorrow, 11:59 PM</p>
                                </div>
                                <div className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-xs">Pending</div>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <div>
                                    <p className="font-medium">History Essay</p>
                                    <p className="text-sm text-muted-foreground">Due: Nov 15, 2023</p>
                                </div>
                                <div className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs">Submitted</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
