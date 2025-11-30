import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import { getCurrentUser } from "@/lib/auth";
import SubmissionForm from './SubmissionForm';
import { notFound } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, BookOpen, Clock, FileText, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default async function AssignmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await connectDB();
    const user = await getCurrentUser();

    const assignment = await Assignment.findById(id).lean();

    if (!assignment) {
        notFound();
    }

    // Fetch existing submission
    let submission = null;
    if (user) {
        submission = await Submission.findOne({
            assignment: id,
            student: user.id,
        }).lean();
    }

    // Serialize dates and ObjectIds to pass to client component
    const serializedSubmission = submission ? {
        ...submission,
        _id: submission._id.toString(),
        assignment: submission.assignment.toString(),
        student: submission.student.toString(),
        submissionType: submission.submissionType || 'link',
        createdAt: submission.createdAt.toISOString(),
        updatedAt: submission.updatedAt.toISOString(),
    } : null;

    const isPdf = submission?.fileUrl?.toLowerCase().endsWith('.pdf');
    const isImage = submission?.fileUrl?.match(/\.(jpeg|jpg|gif|png)$/i);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{assignment.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{assignment.subject || 'General'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Due: {format(new Date(assignment.dueDate), "PPP p")}</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Instructions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                                {assignment.description}
                            </div>
                        </CardContent>
                    </Card>

                    <SubmissionForm
                        assignmentId={id}
                        existingSubmission={serializedSubmission}
                    />
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">Submission Status</div>
                                {submission ? (
                                    <Badge
                                        variant={submission.status === 'graded' ? 'default' : 'secondary'}
                                        className={submission.status === 'graded' ? 'bg-green-500' : 'bg-yellow-100 text-yellow-800'}
                                    >
                                        {submission.status === 'graded' ? 'Graded' : 'Submitted'}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">Pending</Badge>
                                )}
                            </div>

                            {submission && (
                                <>
                                    <Separator />
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Submitted On</div>
                                        <div className="text-sm">{format(new Date(submission.createdAt), "PP p")}</div>
                                    </div>

                                    <Separator />
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">File</div>
                                        <a
                                            href={submission.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            <FileText className="h-3 w-3" />
                                            View Submission <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </>
                            )}

                            {submission?.status === 'graded' && (
                                <>
                                    <Separator />
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Grade</div>
                                        <div className="text-2xl font-bold">{submission.marks}</div>
                                    </div>
                                    {submission.feedback && (
                                        <div>
                                            <div className="text-sm font-medium text-muted-foreground mb-1">Feedback</div>
                                            <div className="text-sm bg-muted p-2 rounded">{submission.feedback}</div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
