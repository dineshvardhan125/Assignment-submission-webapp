import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import GradeForm from '@/components/GradeForm';
import { notFound } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default async function AdminSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await connectDB();

    const assignment = await Assignment.findById(id).lean();

    if (!assignment) {
        notFound();
    }

    const submissions = await Submission.find({ assignment: id })
        .populate('student', 'name email')
        .sort({ createdAt: -1 })
        .lean();

    // Serialize for client component
    const serializedSubmissions = submissions.map(sub => ({
        ...sub,
        _id: sub._id.toString(),
        assignment: sub.assignment.toString(),
        student: {
            // @ts-ignore
            ...sub.student,
            // @ts-ignore
            _id: sub.student._id.toString(),
        },
        createdAt: sub.createdAt.toISOString(),
        updatedAt: sub.updatedAt.toISOString(),
    }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
                <p className="text-muted-foreground">
                    Viewing submissions for: <span className="font-semibold text-foreground">{assignment.title}</span>
                    <span className="ml-2 text-sm bg-secondary px-2 py-1 rounded-md">Total Marks: {assignment.totalMarks || 100}</span>
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Student Submissions</CardTitle>
                    <CardDescription>
                        Total Submissions: {submissions.length}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>File</TableHead>
                                <TableHead>Submitted On</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Marks</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {serializedSubmissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No submissions yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                serializedSubmissions.map((submission) => (
                                    <TableRow key={submission._id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{submission.student?.name}</span>
                                                <span className="text-xs text-muted-foreground">{submission.student?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={submission.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                            >
                                                <FileText className="h-4 w-4" />
                                                View File <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(submission.createdAt), "PP p")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={submission.status === 'graded' ? 'default' : 'secondary'}
                                                className={submission.status === 'graded' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}
                                            >
                                                {submission.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {submission.status === 'graded' ? (
                                                <span className="font-semibold">{submission.marks}</span>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <GradeForm submission={submission} totalMarks={assignment.totalMarks || 100} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
