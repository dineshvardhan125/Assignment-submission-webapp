import connectDB from '@/lib/db';
import Submission from '@/models/Submission';
import Assignment from '@/models/Assignment';
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Submissions</h1>
                <p className="text-muted-foreground">
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
        </div>
    );
}
