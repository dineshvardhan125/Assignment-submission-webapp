"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import { BookOpen, Clock, CheckSquare, Award, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

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
                            {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
                                stats.upcomingDeadlines.map((deadline: any) => (
                                    <div key={deadline.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div>
                                            <p className="font-medium">{deadline.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Due: {format(new Date(deadline.dueDate), "MMM d, yyyy, h:mm a")}
                                            </p>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs ${deadline.status === 'Submitted'
                                                ? 'bg-green-500/10 text-green-500'
                                                : deadline.status === 'Graded'
                                                    ? 'bg-blue-500/10 text-blue-500'
                                                    : 'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {deadline.status}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">
                                    <Calendar className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                    <p>No upcoming deadlines</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
