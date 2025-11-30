<<<<<<< HEAD
import connectDB from '@/lib/db';
import Submission from '@/models/Submission';
import Assignment from '@/models/Assignment';
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
=======
"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
>>>>>>> friend/main
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function StudentSubmissionsPage() {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    // Ensure Assignment model is registered
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = Assignment;

    const submissions = await Submission.find({ student: user.id })
        .populate('assignment')
        .sort({ createdAt: -1 })
        .lean();
=======
import { Loader2, ExternalLink, FileText, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface Submission {
    _id: string;
    assignment: {
        _id: string;
        title: string;
        subject: string;
        totalMarks?: number;
    } | null;
    fileUrl: string;
    submissionType: 'link' | 'file';
    status: 'submitted' | 'graded';
    marks?: number;
    feedback?: string;
    createdAt: string;
}

export default function StudentSubmissionsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ["studentSubmissions"],
        queryFn: async () => {
            const res = await fetch("/api/student/submissions");
            if (!res.ok) throw new Error("Failed to fetch submissions");
            return res.json();
        },
    });

    const submissions: Submission[] = data?.submissions || [];
>>>>>>> friend/main

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Submissions</h1>
                <p className="text-muted-foreground">
<<<<<<< HEAD
                    View your submission history and grades.
                </p>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Assignment</TableHead>
                            <TableHead>Submitted On</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Marks</TableHead>
                            <TableHead>Feedback</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No submissions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            submissions.map((submission) => (
                                <TableRow key={submission._id.toString()}>
                                    <TableCell className="font-medium">
                                        {submission.assignment?.title || 'Unknown Assignment'}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(submission.createdAt), "PPP p")}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                submission.status === 'graded'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className={
                                                submission.status === 'graded'
                                                    ? 'bg-green-500 hover:bg-green-600'
                                                    : 'text-yellow-600 bg-yellow-50'
                                            }
                                        >
                                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {submission.marks !== undefined ? submission.marks : '-'}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={submission.feedback}>
                                        {submission.feedback || '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {submission.fileUrl && (
                                            <Button variant="ghost" size="sm" asChild>
                                                <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                    <ExternalLink className="h-4 w-4" />
                                                    View Work
                                                </a>
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
=======
                    View your past assignment submissions and grades.
                </p>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Submission History ({submissions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Assignment</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Submitted On</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Marks</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {submissions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground animate-float">
                                                No submissions found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        submissions.map((submission, index) => (
                                            <TableRow
                                                key={submission._id}
                                                className="animate-fade-in-up"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <TableCell className="font-medium">
                                                    {submission.assignment?.title || <span className="text-muted-foreground italic">Assignment Deleted</span>}
                                                </TableCell>
                                                <TableCell>
                                                    {submission.assignment?.subject || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {format(new Date(submission.createdAt), "MMM d, yyyy h:mm a")}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={submission.status === 'graded' ? 'default' : 'secondary'} className="capitalize">
                                                        {submission.status === 'graded' ? (
                                                            <div className="flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3" /> Graded
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" /> Submitted
                                                            </div>
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {submission.status === 'graded' ? (
                                                        <span className="font-bold text-green-600 dark:text-green-400">
                                                            {submission.marks} / {submission.assignment?.totalMarks || 100}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                                                            {submission.submissionType === 'link' ? (
                                                                <>
                                                                    <ExternalLink className="w-4 h-4 mr-2" /> View Link
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FileText className="w-4 h-4 mr-2" /> View File
                                                                </>
                                                            )}
                                                        </a>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
>>>>>>> friend/main
        </div>
    );
}
