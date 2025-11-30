import connectDB from '@/lib/db';
import Submission from '@/models/Submission';
import Assignment from '@/models/Assignment';
import User from '@/models/User';
import GradeForm from '@/components/GradeForm';
import SubmissionsFilter from './SubmissionsFilter';
import HighlightText from '@/components/HighlightText';
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
import { FileText, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default async function AllSubmissionsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    await connectDB();

    const params = await searchParams;
    const search = typeof params.search === 'string' ? params.search : '';
    const subject = typeof params.subject === 'string' ? params.subject : '';

    let query: any = {};

    // Filter by subject
    if (subject) {
        const assignments = await Assignment.find({ subject: { $regex: subject, $options: 'i' } });
        const assignmentIds = assignments.map(a => a._id);
        query.assignment = { $in: assignmentIds };
    }

    // Filter by student (name, roll, year)
    if (search) {
        const studentQuery = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { rollNumber: { $regex: search, $options: 'i' } },
                { year: { $regex: search, $options: 'i' } }
            ]
        };
        const students = await User.find(studentQuery);
        const studentIds = students.map(s => s._id);

        // If we already have a query (from subject), we need to use $and
        if (query.assignment) {
            query.student = { $in: studentIds };
        } else {
            query.student = { $in: studentIds };
        }
    }

    const submissions = await Submission.find(query)
        .populate('student', 'name email rollNumber year')
        .populate('assignment', 'title subject')
        .sort({ createdAt: -1 })
        .lean();

    // Serialize for client component
    const serializedSubmissions = submissions.map(sub => ({
        ...sub,
        _id: sub._id.toString(),
        // @ts-ignore
        assignment: sub.assignment ? { ...sub.assignment, _id: sub.assignment._id.toString() } : null,
        student: sub.student ? {
            // @ts-ignore
            ...sub.student,
            // @ts-ignore
            _id: sub.student._id.toString(),
        } : null,
        createdAt: sub.createdAt.toISOString(),
        updatedAt: sub.updatedAt.toISOString(),
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Submissions</h1>
                    <p className="text-muted-foreground">
                        View and manage student submissions across all subjects.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Submissions</CardTitle>
                            <CardDescription>
                                Total Submissions: {submissions.length}
                            </CardDescription>
                        </div>
                        <SubmissionsFilter />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Assignment</TableHead>
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
                                    <TableCell colSpan={9} className="h-24 text-center">
                                        No submissions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                serializedSubmissions.map((submission) => (
                                    <TableRow key={submission._id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    <HighlightText text={submission.student?.name || 'Unknown'} highlight={search} />
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    <HighlightText text={submission.student?.rollNumber || submission.student?.email || ''} highlight={search} />
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <HighlightText text={submission.student?.year || 'N/A'} highlight={search} />
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                <HighlightText text={submission.assignment?.subject || 'N/A'} highlight={subject || search} />
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-medium">{submission.assignment?.title || 'Unknown Assignment'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={submission.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                            >
                                                <FileText className="h-4 w-4" />
                                                View
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(submission.createdAt), "MMM d, p")}
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
                                            <GradeForm submission={submission} />
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
