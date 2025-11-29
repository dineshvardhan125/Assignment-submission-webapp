import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import { getCurrentUser } from "@/lib/auth";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";

export default async function StudentAssignmentsPage() {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
        return <div>Please log in to view assignments.</div>;
    }

    const assignments = await Assignment.find({}).sort({ createdAt: -1 }).lean();
    const submissions = await Submission.find({ student: user.id }).lean();

    const assignmentsWithStatus = assignments.map((assignment) => {
        const submission = submissions.find(
            (s) => s.assignment.toString() === assignment._id.toString()
        );
        return {
            ...assignment,
            submission,
            status: submission ? submission.status : 'pending',
        };
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Assignments</h1>
                <p className="text-muted-foreground">
                    View and submit your course assignments.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {assignmentsWithStatus.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No assignments available at the moment.
                    </div>
                ) : (
                    assignmentsWithStatus.map((assignment) => (
                        <Card key={assignment._id.toString()} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="mb-2">
                                        {assignment.subject || 'General'}
                                    </Badge>
                                    {assignment.status === 'submitted' || assignment.status === 'graded' ? (
                                        <Badge className="bg-green-500 hover:bg-green-600">Submitted</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="text-yellow-600 bg-yellow-50">Pending</Badge>
                                    )}
                                </div>
                                <CardTitle className="line-clamp-1">{assignment.title}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {assignment.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Due: {format(new Date(assignment.dueDate), "PPP")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span>Year: {assignment.year || 'All'}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/student/assignments/${assignment._id}`} className="w-full">
                                    <Button className="w-full" variant={assignment.status === 'pending' ? "default" : "outline"}>
                                        {assignment.status === 'pending' ? (
                                            <>
                                                <Clock className="mr-2 h-4 w-4" />
                                                Submit Now
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                View Submission
                                            </>
                                        )}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
